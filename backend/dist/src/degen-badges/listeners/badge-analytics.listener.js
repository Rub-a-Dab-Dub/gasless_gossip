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
var BadgeAnalyticsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeAnalyticsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let BadgeAnalyticsListener = BadgeAnalyticsListener_1 = class BadgeAnalyticsListener {
    logger = new common_1.Logger(BadgeAnalyticsListener_1.name);
    async handleBadgeAwarded(event) {
        this.logger.log(`Badge awarded: ${event.badge.badgeType} to user ${event.badge.userId}`);
        await this.trackBadgeAward(event);
        await this.sendBadgeNotification(event);
        await this.updateUserAchievements(event);
    }
    async handleBadgeMinted(event) {
        this.logger.log(`Badge token minted: ${event.assetCode} for user ${event.userId}`);
        await this.trackStellarMinting(event);
    }
    async trackBadgeAward(event) {
        const analyticsData = {
            event: "badge_awarded",
            userId: event.badge.userId,
            badgeType: event.badge.badgeType,
            rarity: event.badge.rarity,
            rewardAmount: event.badge.rewardAmount,
            timestamp: event.timestamp,
            achievementData: event.achievementData,
        };
        this.logger.debug("Badge award analytics:", analyticsData);
    }
    async sendBadgeNotification(event) {
        const notification = {
            type: "badge_awarded",
            userId: event.badge.userId,
            title: "New Badge Earned!",
            message: `You've earned the ${event.badge.badgeType} badge!`,
            data: {
                badgeId: event.badge.id,
                badgeType: event.badge.badgeType,
                rarity: event.badge.rarity,
                rewardAmount: event.badge.rewardAmount,
            },
        };
        this.logger.debug("Sending badge notification:", notification);
    }
    async updateUserAchievements(event) {
        this.logger.debug(`Updating achievements for user ${event.badge.userId}`);
    }
    async trackStellarMinting(event) {
        const stellarData = {
            event: "badge_token_minted",
            userId: event.userId,
            transactionId: event.transactionId,
            assetCode: event.assetCode,
            amount: event.amount,
            timestamp: event.timestamp,
        };
        this.logger.debug("Stellar minting analytics:", stellarData);
    }
};
exports.BadgeAnalyticsListener = BadgeAnalyticsListener;
__decorate([
    (0, event_emitter_1.OnEvent)("badge.awarded"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BadgeAnalyticsListener.prototype, "handleBadgeAwarded", null);
__decorate([
    (0, event_emitter_1.OnEvent)("badge.minted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BadgeAnalyticsListener.prototype, "handleBadgeMinted", null);
exports.BadgeAnalyticsListener = BadgeAnalyticsListener = BadgeAnalyticsListener_1 = __decorate([
    (0, common_1.Injectable)()
], BadgeAnalyticsListener);
//# sourceMappingURL=badge-analytics.listener.js.map