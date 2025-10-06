"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
let NotificationService = NotificationService_1 = class NotificationService {
    logger = new common_1.Logger(NotificationService_1.name);
    async sendLevelUpNotification(event) {
        const notification = {
            userId: event.userId,
            type: 'level_up',
            title: 'Level Up!',
            message: `Congratulations! You've reached level ${event.newLevel}!`,
            data: {
                previousLevel: event.previousLevel,
                newLevel: event.newLevel,
                totalXp: event.totalXp,
                badgesUnlocked: event.badgesUnlocked,
            },
            timestamp: new Date(),
        };
        await this.sendNotification(notification);
    }
    async sendXpGainedNotification(event) {
        const notification = {
            userId: event.userId,
            type: 'xp_gained',
            title: 'XP Gained!',
            message: `You earned ${event.xpAmount} XP from ${event.source}!`,
            data: {
                xpAmount: event.xpAmount,
                source: event.source,
                metadata: event.metadata,
            },
            timestamp: new Date(),
        };
        await this.sendNotification(notification);
    }
    async sendBadgeUnlockedNotification(event) {
        const notification = {
            userId: event.userId,
            type: 'badge_unlocked',
            title: 'Badge Unlocked!',
            message: `You've unlocked the ${event.badgeId} badge!`,
            data: {
                badgeId: event.badgeId,
                level: event.level,
                stellarTransactionId: event.stellarTransactionId,
            },
            timestamp: new Date(),
        };
        await this.sendNotification(notification);
    }
    async sendNotification(notification) {
        this.logger.log(`Sending ${notification.type} notification to user ${notification.userId}: ${notification.message}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map