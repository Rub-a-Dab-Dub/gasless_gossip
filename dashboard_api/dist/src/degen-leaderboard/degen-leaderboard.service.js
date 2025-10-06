"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenLeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const degen_score_entity_1 = require("./entities/degen-score.entity");
const leaderboard_badge_entity_1 = require("./entities/leaderboard-badge.entity");
const leaderboard_event_entity_1 = require("./entities/leaderboard-event.entity");
let DegenLeaderboardService = class DegenLeaderboardService {
    degenScoreRepo;
    badgeRepo;
    eventRepo;
    redisClient;
    constructor(repoFactory, redisClient) {
        this.degenScoreRepo = repoFactory.getRepository(degen_score_entity_1.DegenScore);
        this.badgeRepo = repoFactory.getRepository(leaderboard_badge_entity_1.LeaderboardBadge);
        this.eventRepo = repoFactory.getRepository(leaderboard_event_entity_1.LeaderboardEvent);
        this.redisClient = redisClient;
    }
    async computeDegen(dto) {
        const { userId, username, category, totalBets, totalWagered, totalWon, totalLost } = dto;
        const winRate = totalBets > 0 ? (totalWon / (totalWon + totalLost)) * 100 : 0;
        const avgBetSize = totalBets > 0 ? totalWagered / totalBets : 0;
        const riskScore = this.calculateRiskScore(avgBetSize, totalWagered, winRate);
        const score = this.calculateDegenScore(totalWagered, totalBets, riskScore, winRate);
        let degenScore = await this.degenScoreRepo.findOne({
            where: { userId, category, cycleId: dto.cycleId || "current" },
        });
        if (degenScore) {
            const oldRank = degenScore.rank;
            degenScore.totalBets = totalBets;
            degenScore.totalWagered = totalWagered;
            degenScore.totalWon = totalWon;
            degenScore.totalLost = totalLost;
            degenScore.winRate = winRate;
            degenScore.avgBetSize = avgBetSize;
            degenScore.riskScore = riskScore;
            degenScore.score = score;
            const saved = await this.degenScoreRepo.save(degenScore);
            await this.updateRanks(category, dto.cycleId || "current");
            const newScore = await this.degenScoreRepo.findOne({ where: { id: saved.id } });
            if (newScore && newScore.rank !== oldRank) {
                await this.createEvent({
                    userId,
                    eventType: "rank_change",
                    category,
                    data: { oldRank, newRank: newScore.rank, score },
                    description: `Rank changed from ${oldRank} to ${newScore.rank}`,
                });
            }
            await this.invalidateCache(category, dto.cycleId);
            return newScore || saved;
        }
        else {
            degenScore = this.degenScoreRepo.create({
                userId,
                username,
                category,
                totalBets,
                totalWagered,
                totalWon,
                totalLost,
                winRate,
                avgBetSize,
                riskScore,
                score,
                cycleId: dto.cycleId || "current",
                cycleStartDate: dto.cycleStartDate ? new Date(dto.cycleStartDate) : new Date(),
                cycleEndDate: dto.cycleEndDate ? new Date(dto.cycleEndDate) : undefined,
            });
            const saved = await this.degenScoreRepo.save(degenScore);
            await this.updateRanks(category, dto.cycleId || "current");
            return saved;
        }
    }
    async getLeaderboard(query) {
        const { category = "overall", cycleId = "current", limit = 100, minScore } = query;
        const cacheKey = `leaderboard:${category}:${cycleId}:${limit}`;
        if (this.redisClient) {
            const cached = await this.redisClient.get(cacheKey);
            if (cached)
                return JSON.parse(cached);
        }
        const where = { category, cycleId };
        if (minScore)
            where.score = (0, typeorm_1.MoreThan)(minScore);
        const leaderboard = await this.degenScoreRepo.find({
            where,
            order: { rank: "ASC" },
            take: limit,
        });
        if (this.redisClient) {
            await this.redisClient.setex(cacheKey, 10, JSON.stringify(leaderboard));
        }
        return leaderboard;
    }
    async getUserRank(userId, category, cycleId = "current") {
        return this.degenScoreRepo.findOne({
            where: { userId, category, cycleId },
        });
    }
    async awardBadge(dto) {
        const badge = this.badgeRepo.create({
            userId: dto.userId,
            badgeType: dto.badgeType,
            badgeName: this.getBadgeName(dto.badgeType, dto.tier),
            description: this.getBadgeDescription(dto.badgeType, dto.tier),
            tier: dto.tier,
            awardedAt: new Date(),
            awardedBy: dto.awardedBy,
        });
        const saved = await this.badgeRepo.save(badge);
        await this.degenScoreRepo.update({ userId: dto.userId }, { badge: dto.badgeType });
        await this.createEvent({
            userId: dto.userId,
            eventType: "badge_awarded",
            data: { badgeType: dto.badgeType },
            description: `Awarded ${badge.badgeName} badge`,
        });
        return saved;
    }
    async resetCycle(dto) {
        const { category, newCycleId = `cycle_${Date.now()}` } = dto;
        const currentScores = await this.degenScoreRepo.find({
            where: { category, cycleId: "current" },
        });
        await this.degenScoreRepo.update({ category, cycleId: "current" }, { cycleId: `archived_${Date.now()}` });
        for (const score of currentScores) {
            await this.createEvent({
                userId: score.userId,
                eventType: "cycle_reset",
                category,
                data: { oldCycleId: "current", newCycleId },
                description: `Cycle reset for ${category}`,
            });
        }
        await this.invalidateCache(category, "current");
        return { archived: currentScores.length, newCycleId };
    }
    async getUserBadges(userId) {
        return this.badgeRepo.find({
            where: { userId, isActive: true },
            order: { awardedAt: "DESC" },
        });
    }
    async getEvents(userId, limit = 50) {
        return this.eventRepo.find({
            where: { userId },
            order: { createdAt: "DESC" },
            take: limit,
        });
    }
    async exportEvents(category, startDate, endDate) {
        return this.eventRepo.find({
            where: {
                category,
                createdAt: (0, typeorm_1.MoreThan)(startDate) && (0, typeorm_1.LessThan)(endDate),
            },
            order: { createdAt: "DESC" },
        });
    }
    calculateRiskScore(avgBetSize, totalWagered, winRate) {
        const betSizeScore = Math.min((avgBetSize / 1000) * 30, 30);
        const volumeScore = Math.min((totalWagered / 100000) * 40, 40);
        const winRateScore = Math.abs(50 - winRate) * 0.6;
        return Math.min(betSizeScore + volumeScore + winRateScore, 100);
    }
    calculateDegenScore(totalWagered, totalBets, riskScore, winRate) {
        const volumeWeight = 0.4;
        const frequencyWeight = 0.3;
        const riskWeight = 0.2;
        const performanceWeight = 0.1;
        const volumeScore = Math.log10(totalWagered + 1) * 1000;
        const frequencyScore = Math.log10(totalBets + 1) * 500;
        const performanceScore = winRate * 10;
        return (volumeScore * volumeWeight +
            frequencyScore * frequencyWeight +
            riskScore * riskWeight +
            performanceScore * performanceWeight);
    }
    async updateRanks(category, cycleId) {
        const scores = await this.degenScoreRepo.find({
            where: { category, cycleId },
            order: { score: "DESC" },
        });
        for (let i = 0; i < scores.length; i++) {
            scores[i].rank = i + 1;
            await this.degenScoreRepo.save(scores[i]);
        }
    }
    async invalidateCache(category, cycleId) {
        if (!this.redisClient)
            return;
        const pattern = `leaderboard:${category}:${cycleId || "*"}:*`;
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
            await this.redisClient.del(...keys);
        }
    }
    getBadgeName(badgeType, tier) {
        const names = {
            whale: "Whale",
            degen: "Degen",
            risk_master: "Risk Master",
            high_roller: "High Roller",
            streak_king: "Streak King",
        };
        return `${tier.charAt(0).toUpperCase() + tier.slice(1)} ${names[badgeType] || badgeType}`;
    }
    getBadgeDescription(badgeType, tier) {
        return `Awarded for exceptional ${badgeType} performance at ${tier} tier`;
    }
    async createEvent(data) {
        const event = this.eventRepo.create(data);
        return this.eventRepo.save(event);
    }
};
exports.DegenLeaderboardService = DegenLeaderboardService;
exports.DegenLeaderboardService = DegenLeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], DegenLeaderboardService);
//# sourceMappingURL=degen-leaderboard.service.js.map