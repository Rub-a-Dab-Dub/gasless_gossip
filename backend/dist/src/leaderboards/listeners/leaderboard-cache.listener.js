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
var LeaderboardCacheListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardCacheListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const leaderboards_service_1 = require("../services/leaderboards.service");
let LeaderboardCacheListener = LeaderboardCacheListener_1 = class LeaderboardCacheListener {
    leaderboardsService;
    logger = new common_1.Logger(LeaderboardCacheListener_1.name);
    constructor(leaderboardsService) {
        this.leaderboardsService = leaderboardsService;
    }
    async handleXpGained(event) {
        this.logger.debug(`XP gained event received for user ${event.userId}: ${event.xpAmount} XP from ${event.source}`);
        try {
            await this.leaderboardsService.invalidateUserRankCache(event.userId);
            await this.leaderboardsService.invalidateLeaderboardCache();
            this.logger.debug(`Cache invalidated for XP gain: user ${event.userId}`);
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for XP gain: ${error.message}`, error.stack);
        }
    }
    async handleLevelUp(event) {
        this.logger.debug(`Level up event received for user ${event.userId}: level ${event.previousLevel} -> ${event.newLevel}`);
        try {
            await this.leaderboardsService.invalidateUserRankCache(event.userId);
            await this.leaderboardsService.invalidateLeaderboardCache();
            await this.leaderboardsService.invalidateLeaderboardCache();
            this.logger.debug(`Cache invalidated for level up: user ${event.userId}`);
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for level up: ${error.message}`, error.stack);
        }
    }
    async handleTipReceived(event) {
        this.logger.debug(`Tip received event for user ${event.userId}: ${event.tipAmount} from ${event.fromUserId}`);
        try {
            await this.leaderboardsService.invalidateUserRankCache(event.userId);
            await this.leaderboardsService.invalidateLeaderboardCache();
            this.logger.debug(`Cache invalidated for tip received: user ${event.userId}`);
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for tip received: ${error.message}`, error.stack);
        }
    }
    async handleUserCreated(event) {
        this.logger.debug(`New user created: ${event.userId}`);
        try {
            await this.leaderboardsService.invalidateLeaderboardCache();
            this.logger.debug(`Cache invalidated for new user: ${event.userId}`);
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for new user: ${error.message}`, error.stack);
        }
    }
    async handleUserDeleted(event) {
        this.logger.debug(`User deleted: ${event.userId}`);
        try {
            await this.leaderboardsService.invalidateLeaderboardCache();
            this.logger.debug(`Cache invalidated for user deletion: ${event.userId}`);
        }
        catch (error) {
            this.logger.error(`Error invalidating cache for user deletion: ${error.message}`, error.stack);
        }
    }
};
exports.LeaderboardCacheListener = LeaderboardCacheListener;
__decorate([
    (0, event_emitter_1.OnEvent)('xp.gained'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardCacheListener.prototype, "handleXpGained", null);
__decorate([
    (0, event_emitter_1.OnEvent)('level.up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardCacheListener.prototype, "handleLevelUp", null);
__decorate([
    (0, event_emitter_1.OnEvent)('tip.received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardCacheListener.prototype, "handleTipReceived", null);
__decorate([
    (0, event_emitter_1.OnEvent)('user.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardCacheListener.prototype, "handleUserCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('user.deleted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardCacheListener.prototype, "handleUserDeleted", null);
exports.LeaderboardCacheListener = LeaderboardCacheListener = LeaderboardCacheListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leaderboards_service_1.LeaderboardsService])
], LeaderboardCacheListener);
//# sourceMappingURL=leaderboard-cache.listener.js.map