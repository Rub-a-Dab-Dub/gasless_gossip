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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    eventEmitter;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    emitTipEvent(event) {
        this.logger.log(`Emitting analytics event: ${event.eventType} for user ${event.userId}`);
        this.eventEmitter.emit(`tip.${event.eventType}`, event);
        this.eventEmitter.emit('tip.activity', event);
    }
    async trackUserEngagement(userId, action, metadata) {
        const event = {
            userId,
            action,
            metadata,
            timestamp: new Date()
        };
        this.logger.log(`Tracking user engagement: ${JSON.stringify(event)}`);
        this.eventEmitter.emit('user.engagement', event);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map