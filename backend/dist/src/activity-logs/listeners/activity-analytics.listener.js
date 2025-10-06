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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityAnalyticsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const activity_log_entity_1 = require("../entities/activity-log.entity");
let ActivityAnalyticsListener = class ActivityAnalyticsListener {
    async handleActivityLogged(event) {
        const { activityLog } = event;
        console.log(`[v0] Activity logged: ${activityLog.action} by user ${activityLog.userId}`);
        switch (activityLog.action) {
            case activity_log_entity_1.ActivityAction.MESSAGE_SENT:
                await this.handleMessageSent(activityLog);
                break;
            case activity_log_entity_1.ActivityAction.TIP_SENT:
                await this.handleTipSent(activityLog);
                break;
            case activity_log_entity_1.ActivityAction.ROOM_JOINED:
                await this.handleRoomJoined(activityLog);
                break;
            case activity_log_entity_1.ActivityAction.LEVEL_UP:
                await this.handleLevelUp(activityLog);
                break;
            case activity_log_entity_1.ActivityAction.BADGE_EARNED:
                await this.handleBadgeEarned(activityLog);
                break;
            default:
                await this.handleGenericActivity(activityLog);
        }
    }
    async handleMessageSent(activityLog) {
        console.log(`[v0] Processing message sent activity for user ${activityLog.userId}`);
    }
    async handleTipSent(activityLog) {
        console.log(`[v0] Processing tip sent activity: ${activityLog.amount} to user ${activityLog.targetUserId}`);
    }
    async handleRoomJoined(activityLog) {
        console.log(`[v0] Processing room joined activity: user ${activityLog.userId} joined room ${activityLog.roomId}`);
    }
    async handleLevelUp(activityLog) {
        console.log(`[v0] Processing level up activity for user ${activityLog.userId}`);
    }
    async handleBadgeEarned(activityLog) {
        console.log(`[v0] Processing badge earned activity for user ${activityLog.userId}`);
    }
    async handleGenericActivity(activityLog) {
        console.log(`[v0] Processing generic activity: ${activityLog.action} for user ${activityLog.userId}`);
    }
};
exports.ActivityAnalyticsListener = ActivityAnalyticsListener;
__decorate([
    (0, event_emitter_1.OnEvent)("activity.logged"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], ActivityAnalyticsListener.prototype, "handleActivityLogged", null);
exports.ActivityAnalyticsListener = ActivityAnalyticsListener = __decorate([
    (0, common_1.Injectable)()
], ActivityAnalyticsListener);
//# sourceMappingURL=activity-analytics.listener.js.map