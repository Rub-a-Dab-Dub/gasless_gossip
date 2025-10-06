"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationAcceptedEvent = void 0;
class InvitationAcceptedEvent {
    invitation;
    participant;
    timestamp;
    constructor(invitation, participant, timestamp = new Date()) {
        this.invitation = invitation;
        this.participant = participant;
        this.timestamp = timestamp;
    }
    get eventName() {
        return "invitation.accepted";
    }
    get payload() {
        return {
            invitationId: this.invitation.id,
            roomId: this.invitation.roomId,
            inviterId: this.invitation.inviterId,
            inviteeId: this.invitation.inviteeId,
            participantId: this.participant.id,
            code: this.invitation.code,
            usageCount: this.invitation.usageCount,
            stellarTxId: this.invitation.stellarTxId,
            timestamp: this.timestamp,
        };
    }
}
exports.InvitationAcceptedEvent = InvitationAcceptedEvent;
//# sourceMappingURL=invitation-accepted.event.js.map