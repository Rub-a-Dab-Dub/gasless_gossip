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
var VisitAnalyticsListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitAnalyticsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let VisitAnalyticsListener = VisitAnalyticsListener_1 = class VisitAnalyticsListener {
    logger = new common_1.Logger(VisitAnalyticsListener_1.name);
    async handleVisitCreated(event) {
        const { visit } = event;
        this.logger.log(`Visit analytics: Room ${visit.roomId} visited by user ${visit.userId} for ${visit.duration}s`);
        await this.trackRoomPopularity(visit.roomId);
        await this.trackUserEngagement(visit.userId, visit.duration);
    }
    async handleVisitUpdated(event) {
        const { visit } = event;
        this.logger.log(`Visit updated: Extended duration for room ${visit.roomId} to ${visit.duration}s`);
    }
    async trackRoomPopularity(roomId) {
    }
    async trackUserEngagement(userId, duration) {
    }
};
exports.VisitAnalyticsListener = VisitAnalyticsListener;
__decorate([
    (0, event_emitter_1.OnEvent)("visit.created"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], VisitAnalyticsListener.prototype, "handleVisitCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)("visit.updated"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], VisitAnalyticsListener.prototype, "handleVisitUpdated", null);
exports.VisitAnalyticsListener = VisitAnalyticsListener = VisitAnalyticsListener_1 = __decorate([
    (0, common_1.Injectable)()
], VisitAnalyticsListener);
//# sourceMappingURL=visit-analytics.listener.js.map