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
var DegenBadgesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenBadgesService = void 0;
const common_1 = require("@nestjs/common");
const degen_badge_entity_1 = require("../entities/degen-badge.entity");
const badge_awarded_event_1 = require("../events/badge-awarded.event");
let DegenBadgesService = DegenBadgesService_1 = class DegenBadgesService {
    degenBadgeRepository;
    stellarBadgeService;
    eventEmitter;
    logger = new common_1.Logger(DegenBadgesService_1.name);
    constructor(degenBadgeRepository, stellarBadgeService, eventEmitter) {
        this.degenBadgeRepository = degenBadgeRepository;
        this.stellarBadgeService = stellarBadgeService;
        this.eventEmitter = eventEmitter;
    }
    async awardBadge(awardBadgeDto) {
        const { userId, badgeType, achievementData, mintToken = true, customRewardAmount } = awardBadgeDto;
        const existingBadge = await this.degenBadgeRepository.findOne({
            where: { userId, badgeType, isActive: true },
        });
        if (existingBadge) {
            throw new common_1.ConflictException(`User already has ${badgeType} badge`);
        }
        const badgeConfig = this.getBadgeConfiguration(badgeType);
        const criteria = this.buildCriteria(badgeType, achievementData);
        const badge = this.degenBadgeRepository.create({
            userId,
            badgeType,
            rarity: badgeConfig.rarity,
            criteria,
            description: badgeConfig.description,
            imageUrl: badgeConfig.imageUrl,
            rewardAmount: customRewardAmount || badgeConfig.rewardAmount,
        });
        const savedBadge = await this.degenBadgeRepository.save(badge);
        if (mintToken) {
            try {
                const stellarResult = await this.stellarBadgeService.mintBadgeToken(userId, badgeType, savedBadge.rewardAmount || 0);
                savedBadge.txId = stellarResult.transactionId;
                savedBadge.stellarAssetCode = stellarResult.assetCode;
                savedBadge.stellarAssetIssuer = stellarResult.assetIssuer;
                await this.degenBadgeRepository.save(savedBadge);
            }
            catch (error) {
                this.logger.error(`Failed to mint Stellar token for badge ${savedBadge.id}:`, error);
            }
        }
        this.eventEmitter.emit("badge.awarded", new badge_awarded_event_1.BadgeAwardedEvent(savedBadge, achievementData));
        this.logger.log(`Awarded ${badgeType} badge to user ${userId}`);
        return this.mapToResponseDto(savedBadge);
    }
    async batchAwardBadges(batchAwardDto) {
        const { userIds, badgeType, mintTokens = false } = batchAwardDto;
        const results = [];
        for (const userId of userIds) {
            try {
                const badge = await this.awardBadge({
                    userId,
                    badgeType,
                    mintToken: mintTokens,
                });
                results.push(badge);
            }
            catch (error) {
                this.logger.error(`Failed to award badge to user ${userId}:`, error);
            }
        }
        return results;
    }
    async getUserBadges(userId) {
        const badges = await this.degenBadgeRepository.find({
            where: { userId, isActive: true },
            order: { createdAt: "DESC" },
        });
        return badges.map((badge) => this.mapToResponseDto(badge));
    }
    async getUserBadgeStats(userId) {
        const badges = await this.degenBadgeRepository.find({
            where: { userId, isActive: true },
        });
        const badgesByType = badges.reduce((acc, badge) => {
            acc[badge.badgeType] = (acc[badge.badgeType] || 0) + 1;
            return acc;
        }, {});
        const badgesByRarity = badges.reduce((acc, badge) => {
            acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
            return acc;
        }, {});
        const totalRewards = badges.reduce((sum, badge) => sum + (badge.rewardAmount || 0), 0);
        const latestBadge = badges.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
        const rarestBadge = this.findRarestBadge(badges);
        return {
            totalBadges: badges.length,
            badgesByType,
            badgesByRarity,
            totalRewards,
            latestBadge: latestBadge ? this.mapToResponseDto(latestBadge) : undefined,
            rarestBadge: rarestBadge ? this.mapToResponseDto(rarestBadge) : undefined,
        };
    }
    async checkBadgeEligibility(userId, badgeType, userActivity) {
        const badgeConfig = this.getBadgeConfiguration(badgeType);
        const existingBadge = await this.degenBadgeRepository.findOne({
            where: { userId, badgeType, isActive: true },
        });
        if (existingBadge) {
            return false;
        }
        return this.evaluateBadgeCriteria(badgeType, badgeConfig.criteria, userActivity);
    }
    getBadgeConfiguration(badgeType) {
        const configs = {
            [degen_badge_entity_1.DegenBadgeType.HIGH_ROLLER]: {
                rarity: degen_badge_entity_1.DegenBadgeRarity.RARE,
                description: "Awarded for placing high-value bets",
                imageUrl: "/badges/high-roller.png",
                rewardAmount: 100,
                criteria: { minAmount: 10000 },
            },
            [degen_badge_entity_1.DegenBadgeType.RISK_TAKER]: {
                rarity: degen_badge_entity_1.DegenBadgeRarity.COMMON,
                description: "Awarded for taking high-risk positions",
                imageUrl: "/badges/risk-taker.png",
                rewardAmount: 50,
                criteria: { riskLevel: 8 },
            },
            [degen_badge_entity_1.DegenBadgeType.STREAK_MASTER]: {
                rarity: degen_badge_entity_1.DegenBadgeRarity.EPIC,
                description: "Awarded for consecutive wins",
                imageUrl: "/badges/streak-master.png",
                rewardAmount: 500,
                criteria: { streakLength: 10 },
            },
            [degen_badge_entity_1.DegenBadgeType.WHALE_HUNTER]: {
                rarity: degen_badge_entity_1.DegenBadgeRarity.EPIC,
                description: "Awarded for defeating whale opponents",
                imageUrl: "/badges/whale-hunter.png",
                rewardAmount: 750,
                criteria: { minAmount: 50000, conditions: ["beat_whale"] },
            },
            [degen_badge_entity_1.DegenBadgeType.DIAMOND_HANDS]: {
                rarity: degen_badge_entity_1.DegenBadgeRarity.RARE,
                description: "Awarded for holding positions under pressure",
                imageUrl: "/badges/diamond-hands.png",
                rewardAmount: 200,
                criteria: { timeframe: "24h", conditions: ["hold_under_pressure"] },
            },
            [degen_badge_entity_1.DegenBadgeType.DEGEN_LEGEND]: {
                rarity: degen_badge_entity_1.DegenBadgeRarity.LEGENDARY,
                description: "The ultimate degen achievement",
                imageUrl: "/badges/degen-legend.png",
                rewardAmount: 2500,
                criteria: { minAmount: 100000, streakLength: 20, riskLevel: 10 },
            },
        };
        return configs[badgeType];
    }
    buildCriteria(badgeType, achievementData) {
        const baseConfig = this.getBadgeConfiguration(badgeType);
        return {
            ...baseConfig.criteria,
            achievedAt: new Date(),
            achievementData: achievementData || {},
        };
    }
    evaluateBadgeCriteria(badgeType, criteria, userActivity) {
        switch (badgeType) {
            case degen_badge_entity_1.DegenBadgeType.HIGH_ROLLER:
                return userActivity.maxBetAmount >= criteria.minAmount;
            case degen_badge_entity_1.DegenBadgeType.RISK_TAKER:
                return userActivity.maxRiskLevel >= criteria.riskLevel;
            case degen_badge_entity_1.DegenBadgeType.STREAK_MASTER:
                return userActivity.currentStreak >= criteria.streakLength;
            case degen_badge_entity_1.DegenBadgeType.WHALE_HUNTER:
                return userActivity.maxBetAmount >= criteria.minAmount && userActivity.defeatedWhales > 0;
            case degen_badge_entity_1.DegenBadgeType.DIAMOND_HANDS:
                return userActivity.holdDuration >= 24 * 60 * 60 * 1000;
            case degen_badge_entity_1.DegenBadgeType.DEGEN_LEGEND:
                return (userActivity.maxBetAmount >= criteria.minAmount &&
                    userActivity.currentStreak >= criteria.streakLength &&
                    userActivity.maxRiskLevel >= criteria.riskLevel);
            default:
                return false;
        }
    }
    findRarestBadge(badges) {
        const rarityOrder = {
            [degen_badge_entity_1.DegenBadgeRarity.LEGENDARY]: 4,
            [degen_badge_entity_1.DegenBadgeRarity.EPIC]: 3,
            [degen_badge_entity_1.DegenBadgeRarity.RARE]: 2,
            [degen_badge_entity_1.DegenBadgeRarity.COMMON]: 1,
        };
        return badges.reduce((rarest, current) => {
            if (!rarest || rarityOrder[current.rarity] > rarityOrder[rarest.rarity]) {
                return current;
            }
            return rarest;
        }, undefined);
    }
    mapToResponseDto(badge) {
        return {
            id: badge.id,
            userId: badge.userId,
            badgeType: badge.badgeType,
            rarity: badge.rarity,
            criteria: badge.criteria,
            txId: badge.txId,
            stellarAssetCode: badge.stellarAssetCode,
            stellarAssetIssuer: badge.stellarAssetIssuer,
            description: badge.description,
            imageUrl: badge.imageUrl,
            rewardAmount: badge.rewardAmount,
            isActive: badge.isActive,
            createdAt: badge.createdAt,
            updatedAt: badge.updatedAt,
        };
    }
};
exports.DegenBadgesService = DegenBadgesService;
exports.DegenBadgesService = DegenBadgesService = DegenBadgesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Object])
], DegenBadgesService);
//# sourceMappingURL=degen-badges.service.js.map