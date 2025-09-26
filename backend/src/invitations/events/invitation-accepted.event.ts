import type { Invitation } from "../entities/invitation.entity"
import type { RoomParticipant } from "../entities/room-participant.entity"

export class InvitationAcceptedEvent {
  constructor(
    public readonly invitation: Invitation,
    public readonly participant: RoomParticipant,
    public readonly timestamp: Date = new Date(),
  ) {}

  get eventName(): string {
    return "invitation.accepted"
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
    }
  }
}
