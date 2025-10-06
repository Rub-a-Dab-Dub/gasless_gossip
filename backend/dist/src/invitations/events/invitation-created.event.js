"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationCreatedEvent = void 0;
class InvitationCreatedEvent {
    invitation;
    timestamp;
    constructor(invitation, timestamp = new Date()) {
        this.invitation = invitation;
        this.timestamp = timestamp;
    }
    get eventName() {
        return "invitation.created";
    }
    get payload() {
        return {
            invitationId: this.invitation.id,
            roomId: this.invitation.roomId,
            inviterId: this.invitation.inviterId,
            code: this.invitation.code,
            expiresAt: this.invitation.expiresAt,
            maxUsage: this.invitation.maxUsage,
            timestamp: this.timestamp,
        };
    }
}
exports.InvitationCreatedEvent = InvitationCreatedEvent;
//# sourceMappingURL=invitation-created.event.js.map