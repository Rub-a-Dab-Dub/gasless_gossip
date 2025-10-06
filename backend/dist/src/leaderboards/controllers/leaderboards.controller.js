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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leaderboards_service_1 = require("../services/leaderboards.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let LeaderboardsController = class LeaderboardsController {
    leaderboardsService;
    constructor(leaderboardsService) {
        this.leaderboardsService = leaderboardsService;
    }
    async getLeaderboard(limit) {
        const safeLimit = Math.min(limit || 10, 100);
        return this.leaderboardsService.getLeaderboard(safeLimit);
    }
    async getLeaderboardStats() {
        return this.leaderboardsService.getLeaderboardStats();
    }
    async getUserRank(userId) {
        const rank = await this.leaderboardsService.getUserRank(userId);
        return { userId, rank };
    }
    async getCacheStats() {
        return this.leaderboardsService.getCacheStats();
    }
    async invalidateCache() {
        await this.leaderboardsService.invalidateLeaderboardCache();
        return { message: 'Leaderboard cache invalidated successfully' };
    }
};
exports.LeaderboardsController = LeaderboardsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cached leaderboard of top users by XP',
        description: 'Returns the top users by total XP with Redis caching for improved performance'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of users to return (default: 10, max: 100)',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Leaderboard retrieved successfully from cache or database',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    userId: { type: 'string', description: 'User ID' },
                    username: { type: 'string', description: 'Username' },
                    level: { type: 'number', description: 'User level' },
                    totalXp: { type: 'number', description: 'Total XP earned' },
                    currentXp: { type: 'number', description: 'Current level XP' },
                    rank: { type: 'number', description: 'User rank in leaderboard' },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cached leaderboard statistics',
        description: 'Returns overall leaderboard statistics with Redis caching'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Leaderboard statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalUsers: { type: 'number', description: 'Total number of users' },
                averageXp: { type: 'number', description: 'Average XP across all users' },
                topLevel: { type: 'number', description: 'Highest level achieved' },
                lastUpdated: { type: 'string', format: 'date-time', description: 'Last cache update time' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getLeaderboardStats", null);
__decorate([
    (0, common_1.Get)('user/:userId/rank'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cached user rank by XP',
        description: 'Returns the rank of a specific user in the XP leaderboard with Redis caching'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User rank retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                rank: { type: 'number', description: 'User rank (0 if not found)' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getUserRank", null);
__decorate([
    (0, common_1.Get)('cache/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get cache performance statistics',
        description: 'Returns cache hit/miss statistics for monitoring performance'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Cache statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                leaderboardHits: { type: 'number', description: 'Number of leaderboard cache hits' },
                leaderboardMisses: { type: 'number', description: 'Number of leaderboard cache misses' },
                userRankHits: { type: 'number', description: 'Number of user rank cache hits' },
                userRankMisses: { type: 'number', description: 'Number of user rank cache misses' },
                statsHits: { type: 'number', description: 'Number of stats cache hits' },
                statsMisses: { type: 'number', description: 'Number of stats cache misses' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getCacheStats", null);
__decorate([
    (0, common_1.Get)('cache/invalidate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Invalidate all leaderboard cache',
        description: 'Manually invalidate all leaderboard cache entries (admin endpoint)'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Cache invalidated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Success message' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "invalidateCache", null);
exports.LeaderboardsController = LeaderboardsController = __decorate([
    (0, swagger_1.ApiTags)('leaderboards'),
    (0, common_1.Controller)('leaderboards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [leaderboards_service_1.LeaderboardsService])
], LeaderboardsController);
//# sourceMappingURL=leaderboards.controller.js.map