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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    logger = new common_1.Logger(AnalyticsService_1.name);
    async trackLevelUp(event) {
        const analyticsEvent = {
            userId: event.userId,
            eventType: 'level_up',
            properties: {
                previous_level: event.previousLevel,
                new_level: event.newLevel,
                total_xp: event.totalXp,
                badges_unlocked: event.badgesUnlocked,
                level_difference: event.newLevel - event.previousLevel,
            },
            timestamp: new Date(),
        };
        await this.trackEvent(analyticsEvent);
    }
    async trackXpGained(event) {
        const analyticsEvent = {
            userId: event.userId,
            eventType: 'xp_gained',
            properties: {
                xp_amount: event.xpAmount,
                source: event.source,
                metadata: event.metadata,
            },
            timestamp: new Date(),
        };
        await this.trackEvent(analyticsEvent);
    }
    async trackEvent(event) {
        this.logger.log(`Tracking analytics event: ${event.eventType} for user ${event.userId}`);
    }
};
exports.AnalyticsService = AnalyticsService;
__decorate([
    (0, event_emitter_1.OnEvent)('level.up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], AnalyticsService.prototype, "trackLevelUp", null);
__decorate([
    (0, event_emitter_1.OnEvent)('xp.gained'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], AnalyticsService.prototype, "trackXpGained", null);
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map