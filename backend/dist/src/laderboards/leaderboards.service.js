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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LeaderboardsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ioredis_1 = __importDefault(require("ioredis"));
const leaderboard_entity_1 = require("./entities/leaderboard.entity");
let LeaderboardsService = LeaderboardsService_1 = class LeaderboardsService {
    leaderboardRepository;
    redis;
    logger = new common_1.Logger(LeaderboardsService_1.name);
    CACHE_TTL = 300;
    CACHE_PREFIX = 'leaderboard:';
    constructor(leaderboardRepository, redis) {
        this.leaderboardRepository = leaderboardRepository;
        this.redis = redis;
    }
    async getLeaderboard(query) {
        const { type, limit, offset } = query;
        const cacheKey = `${this.CACHE_PREFIX}${type}:${limit}:${offset}`;
        try {
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for leaderboard: ${type}`);
                const cachedData = JSON.parse(cached);
                return {
                    ...cachedData,
                    cached: true,
                };
            }
            this.logger.debug(`Cache miss for leaderboard: ${type}, fetching from DB`);
            const [entries, total] = await this.leaderboardRepository
                .createQueryBuilder('leaderboard')
                .where('leaderboard.rankType = :type', { type })
                .orderBy('leaderboard.score', 'DESC')
                .skip(offset)
                .take(limit)
                .getManyAndCount();
            const leaderboardEntries = entries.map((entry, index) => ({
                rank: offset + index + 1,
                userId: entry.userId,
                score: entry.score,
            }));
            const response = {
                type,
                entries: leaderboardEntries,
                total,
                cached: false,
                generatedAt: new Date(),
            };
            await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(response));
            this.logger.debug(`Cached leaderboard: ${type}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error fetching leaderboard ${type}:`, error);
            throw error;
        }
    }
    async updateUserScore(createLeaderboardDto) {
        const { rankType, userId, score } = createLeaderboardDto;
        const existingEntry = await this.leaderboardRepository.findOne({
            where: { rankType, userId },
        });
        let leaderboard;
        if (existingEntry) {
            existingEntry.score = score;
            leaderboard = await this.leaderboardRepository.save(existingEntry);
        }
        else {
            leaderboard = this.leaderboardRepository.create(createLeaderboardDto);
            leaderboard = await this.leaderboardRepository.save(leaderboard);
        }
        await this.invalidateLeaderboardCache(rankType);
        return leaderboard;
    }
    async getUserRank(userId, rankType) {
        const userEntry = await this.leaderboardRepository.findOne({
            where: { userId, rankType },
        });
        if (!userEntry) {
            return null;
        }
        const rank = await this.leaderboardRepository
            .createQueryBuilder('leaderboard')
            .where('leaderboard.rankType = :rankType', { rankType })
            .andWhere('leaderboard.score > :score', { score: userEntry.score })
            .getCount();
        return {
            rank: rank + 1,
            score: userEntry.score,
        };
    }
    async getTopUsers(rankType, limit = 10) {
        const entries = await this.leaderboardRepository
            .createQueryBuilder('leaderboard')
            .where('leaderboard.rankType = :rankType', { rankType })
            .orderBy('leaderboard.score', 'DESC')
            .limit(limit)
            .getMany();
        return entries.map((entry, index) => ({
            rank: index + 1,
            userId: entry.userId,
            score: entry.score,
        }));
    }
    async invalidateLeaderboardCache(rankType) {
        try {
            const pattern = `${this.CACHE_PREFIX}${rankType}:*`;
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                this.logger.debug(`Invalidated cache for ${rankType}, removed ${keys.length} keys`);
            }
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for ${rankType}:`, error);
        }
    }
    async generateSampleData() {
        const sampleData = [
            { rankType: leaderboard_entity_1.RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440001', score: 15000 },
            { rankType: leaderboard_entity_1.RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440002', score: 12500 },
            { rankType: leaderboard_entity_1.RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440003', score: 10000 },
            { rankType: leaderboard_entity_1.RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440004', score: 8500 },
            { rankType: leaderboard_entity_1.RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440005', score: 7000 },
            { rankType: leaderboard_entity_1.RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440001', score: 500 },
            { rankType: leaderboard_entity_1.RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440003', score: 450 },
            { rankType: leaderboard_entity_1.RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440002', score: 400 },
            { rankType: leaderboard_entity_1.RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440006', score: 350 },
            { rankType: leaderboard_entity_1.RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440007', score: 300 },
            { rankType: leaderboard_entity_1.RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440002', score: 200 },
            { rankType: leaderboard_entity_1.RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440001', score: 180 },
            { rankType: leaderboard_entity_1.RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440008', score: 160 },
            { rankType: leaderboard_entity_1.RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440004', score: 140 },
            { rankType: leaderboard_entity_1.RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440009', score: 120 },
        ];
        for (const data of sampleData) {
            await this.updateUserScore(data);
        }
        this.logger.log('Sample leaderboard data generated successfully');
    }
};
exports.LeaderboardsService = LeaderboardsService;
exports.LeaderboardsService = LeaderboardsService = LeaderboardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leaderboard_entity_1.Leaderboard)),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof ioredis_1.default !== "undefined" && ioredis_1.default) === "function" ? _a : Object])
], LeaderboardsService);
//# sourceMappingURL=leaderboards.service.js.map