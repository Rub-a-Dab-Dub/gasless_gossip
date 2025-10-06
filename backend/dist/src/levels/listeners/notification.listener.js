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
var NotificationListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let NotificationListener = NotificationListener_1 = class NotificationListener {
    notificationService;
    logger = new common_1.Logger(NotificationListener_1.name);
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handleLevelUpEvent(event) {
        this.logger.log(`Handling level up notification for user ${event.userId}`);
        await this.notificationService.sendLevelUpNotification(event);
    }
    async handleXpGainedEvent(event) {
        if (event.xpAmount >= 10) {
            this.logger.log(`Handling XP gained notification for user ${event.userId}`);
            await this.notificationService.sendXpGainedNotification(event);
        }
    }
    async handleBadgeUnlockedEvent(event) {
        this.logger.log(`Handling badge unlocked notification for user ${event.userId}`);
        await this.notificationService.sendBadgeUnlockedNotification(event);
    }
};
exports.NotificationListener = NotificationListener;
__decorate([
    (0, event_emitter_1.OnEvent)('level.up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleLevelUpEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('xp.gained'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleXpGainedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('badge.unlocked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleBadgeUnlockedEvent", null);
exports.NotificationListener = NotificationListener = NotificationListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], NotificationListener);
//# sourceMappingURL=notification.listener.js.map