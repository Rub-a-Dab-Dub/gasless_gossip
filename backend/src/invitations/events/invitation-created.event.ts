import type { Invitation } from "../entities/invitation.entity"

export class InvitationCreatedEvent {
  constructor(
    public readonly invitation: Invitation,
    public readonly timestamp: Date = new Date(),
  ) {}

  get eventName(): string {
    return "invitation.created"
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
    }
  }
}
