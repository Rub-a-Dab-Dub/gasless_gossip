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
var LeaderboardsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_2 = require("cache-manager");
const level_entity_1 = require("../../levels/entities/level.entity");
let LeaderboardsService = LeaderboardsService_1 = class LeaderboardsService {
    levelRepository;
    cacheManager;
    logger = new common_1.Logger(LeaderboardsService_1.name);
    CACHE_KEYS = {
        LEADERBOARD: 'leaderboard',
        USER_RANK: 'user_rank',
        STATS: 'leaderboard_stats',
    };
    constructor(levelRepository, cacheManager) {
        this.levelRepository = levelRepository;
        this.cacheManager = cacheManager;
    }
    async getLeaderboard(limit = 10) {
        const cacheKey = `${this.CACHE_KEYS.LEADERBOARD}:${limit}`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for leaderboard with limit ${limit}`);
                return cached;
            }
            this.logger.debug(`Cache miss for leaderboard with limit ${limit}, fetching from database`);
            const levels = await this.levelRepository.find({
                order: { totalXp: 'DESC' },
                take: limit,
                relations: ['user'],
            });
            const leaderboard = levels.map((level, index) => ({
                userId: level.userId,
                username: level.user?.username || 'Unknown',
                level: level.level,
                totalXp: level.totalXp,
                currentXp: level.currentXp,
                rank: index + 1,
            }));
            await this.cacheManager.set(cacheKey, leaderboard, 300000);
            this.logger.log(`Cached leaderboard with ${leaderboard.length} entries`);
            return leaderboard;
        }
        catch (error) {
            this.logger.error(`Error fetching leaderboard: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUserRank(userId) {
        const cacheKey = `${this.CACHE_KEYS.USER_RANK}:${userId}`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached !== undefined) {
                this.logger.debug(`Cache hit for user rank: ${userId}`);
                return cached;
            }
            this.logger.debug(`Cache miss for user rank: ${userId}, fetching from database`);
            const userLevel = await this.levelRepository.findOne({
                where: { userId },
            });
            if (!userLevel) {
                return 0;
            }
            const rank = await this.levelRepository
                .createQueryBuilder('level')
                .where('level.totalXp > :userXp', { userXp: userLevel.totalXp })
                .getCount();
            const userRank = rank + 1;
            await this.cacheManager.set(cacheKey, userRank, 300000);
            this.logger.debug(`Cached user rank for ${userId}: ${userRank}`);
            return userRank;
        }
        catch (error) {
            this.logger.error(`Error fetching user rank for ${userId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getLeaderboardStats() {
        const cacheKey = this.CACHE_KEYS.STATS;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug('Cache hit for leaderboard stats');
                return cached;
            }
            this.logger.debug('Cache miss for leaderboard stats, fetching from database');
            const [totalUsers, averageResult, topLevelResult] = await Promise.all([
                this.levelRepository.count(),
                this.levelRepository
                    .createQueryBuilder('level')
                    .select('AVG(level.totalXp)', 'average')
                    .getRawOne(),
                this.levelRepository
                    .createQueryBuilder('level')
                    .select('MAX(level.level)', 'maxLevel')
                    .getRawOne(),
            ]);
            const stats = {
                totalUsers,
                averageXp: parseFloat(averageResult?.average || '0'),
                topLevel: parseInt(topLevelResult?.maxLevel || '0'),
                lastUpdated: new Date(),
            };
            await this.cacheManager.set(cacheKey, stats, 600000);
            this.logger.log(`Cached leaderboard stats: ${totalUsers} users, avg XP: ${stats.averageXp}`);
            return stats;
        }
        catch (error) {
            this.logger.error(`Error fetching leaderboard stats: ${error.message}`, error.stack);
            throw error;
        }
    }
    async invalidateLeaderboardCache() {
        try {
            await this.cacheManager.del(this.CACHE_KEYS.LEADERBOARD);
            await this.cacheManager.del(this.CACHE_KEYS.STATS);
            this.logger.log('Invalidated leaderboard cache entries');
        }
        catch (error) {
            this.logger.error(`Error invalidating leaderboard cache: ${error.message}`, error.stack);
        }
    }
    async invalidateUserRankCache(userId) {
        try {
            const cacheKey = `${this.CACHE_KEYS.USER_RANK}:${userId}`;
            await this.cacheManager.del(cacheKey);
            this.logger.debug(`Invalidated user rank cache for ${userId}`);
        }
        catch (error) {
            this.logger.error(`Error invalidating user rank cache for ${userId}: ${error.message}`, error.stack);
        }
    }
    async getCacheStats() {
        return {
            leaderboardHits: 0,
            leaderboardMisses: 0,
            userRankHits: 0,
            userRankMisses: 0,
            statsHits: 0,
            statsMisses: 0,
        };
    }
};
exports.LeaderboardsService = LeaderboardsService;
exports.LeaderboardsService = LeaderboardsService = LeaderboardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object])
], LeaderboardsService);
//# sourceMappingURL=leaderboards.service.js.map