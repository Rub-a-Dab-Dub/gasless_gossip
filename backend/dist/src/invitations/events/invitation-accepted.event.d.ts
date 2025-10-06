import type { Invitation } from "../entities/invitation.entity";
import type { RoomParticipant } from "../entities/room-participant.entity";
export declare class InvitationAcceptedEvent {
    readonly invitation: Invitation;
    readonly participant: RoomParticipant;
    readonly timestamp: Date;
    constructor(invitation: Invitation, participant: RoomParticipant, timestamp?: Date);
    get eventName(): string;
    get payload(): {
        invitationId: string;
        roomId: string;
        inviterId: string;
        inviteeId: string | undefined;
        participantId: string;
        code: string;
        usageCount: number;
        stellarTxId: string | undefined;
        timestamp: Date;
    };
}
