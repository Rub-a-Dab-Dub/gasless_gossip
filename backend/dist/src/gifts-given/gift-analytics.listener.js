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
var GiftAnalyticsListener_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftAnalyticsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const gift_given_event_1 = require("../events/gift-given.event");
const gift_analytics_event_1 = require("../events/gift-analytics.event");
let GiftAnalyticsListener = GiftAnalyticsListener_1 = class GiftAnalyticsListener {
    logger = new common_1.Logger(GiftAnalyticsListener_1.name);
    handleGiftGiven(event) {
        this.logger.log(`Gift given: ${event.giftId} by user ${event.userId}`);
        this.trackEngagement(event);
    }
    handleGiftAnalytics(event) {
        this.logger.log(`Analytics event: ${event.action} for user ${event.userId}`);
        this.processAnalytics(event);
    }
    trackEngagement(event) {
        this.logger.debug(`Tracking engagement for gift: ${event.giftId}`);
    }
    processAnalytics(event) {
        this.logger.debug(`Processing analytics for user: ${event.userId}, action: ${event.action}`);
    }
};
exports.GiftAnalyticsListener = GiftAnalyticsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('gift.given'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof gift_given_event_1.GiftGivenEvent !== "undefined" && gift_given_event_1.GiftGivenEvent) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], GiftAnalyticsListener.prototype, "handleGiftGiven", null);
__decorate([
    (0, event_emitter_1.OnEvent)('analytics.gift'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof gift_analytics_event_1.GiftAnalyticsEvent !== "undefined" && gift_analytics_event_1.GiftAnalyticsEvent) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], GiftAnalyticsListener.prototype, "handleGiftAnalytics", null);
exports.GiftAnalyticsListener = GiftAnalyticsListener = GiftAnalyticsListener_1 = __decorate([
    (0, common_1.Injectable)()
], GiftAnalyticsListener);
//# sourceMappingURL=gift-analytics.listener.js.map