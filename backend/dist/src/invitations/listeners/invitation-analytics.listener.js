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
exports.InvitationAnalyticsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let InvitationAnalyticsListener = class InvitationAnalyticsListener {
    async handleInvitationCreated(event) {
        console.log(`[Analytics] Invitation created: ${event.invitation.code} for room ${event.invitation.roomId}`);
        await this.trackInvitationMetrics("created", event.payload);
    }
    async handleInvitationAccepted(event) {
        console.log(`[Analytics] Invitation accepted: ${event.invitation.code} by user ${event.invitation.inviteeId}`);
        await this.trackInvitationMetrics("accepted", event.payload);
        await this.sendWelcomeNotification(event.participant);
    }
    async trackInvitationMetrics(action, payload) {
        console.log(`[Metrics] Invitation ${action}:`, payload);
    }
    async sendWelcomeNotification(participant) {
        console.log(`[Notification] Welcome new participant: ${participant.userId} to room ${participant.roomId}`);
    }
};
exports.InvitationAnalyticsListener = InvitationAnalyticsListener;
__decorate([
    (0, event_emitter_1.OnEvent)("invitation.created"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], InvitationAnalyticsListener.prototype, "handleInvitationCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)("invitation.accepted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], InvitationAnalyticsListener.prototype, "handleInvitationAccepted", null);
exports.InvitationAnalyticsListener = InvitationAnalyticsListener = __decorate([
    (0, common_1.Injectable)()
], InvitationAnalyticsListener);
//# sourceMappingURL=invitation-analytics.listener.js.map