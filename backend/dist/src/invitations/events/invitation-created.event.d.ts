import type { Invitation } from "../entities/invitation.entity";
export declare class InvitationCreatedEvent {
    readonly invitation: Invitation;
    readonly timestamp: Date;
    constructor(invitation: Invitation, timestamp?: Date);
    get eventName(): string;
    get payload(): {
        invitationId: string;
        roomId: string;
        inviterId: string;
        code: string;
        expiresAt: Date;
        maxUsage: number;
        timestamp: Date;
    };
}
