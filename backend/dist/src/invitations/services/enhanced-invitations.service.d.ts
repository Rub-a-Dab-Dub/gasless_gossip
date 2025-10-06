import { InvitationsService } from "./invitations.service";
import type { StellarInvitationService, InvitationContractData } from "./stellar-invitation.service";
import type { AcceptInvitationDto } from "../dto/accept-invitation.dto";
import type { Invitation } from "../entities/invitation.entity";
import type { RoomParticipant } from "../entities/room-participant.entity";
export declare class EnhancedInvitationsService extends InvitationsService {
    private readonly stellarService;
    private readonly logger;
    constructor(stellarService: StellarInvitationService);
    acceptInvitationWithStellarVerification(acceptDto: AcceptInvitationDto, userId: string): Promise<{
        invitation: Invitation;
        participant: RoomParticipant;
        stellarTxId: string;
    }>;
    verifyInvitationIntegrity(invitationId: string): Promise<{
        databaseRecord: Invitation | null;
        stellarRecord: InvitationContractData | null;
        isConsistent: boolean;
        discrepancies: string[];
    }>;
    verifyRoomAccessOnChain(roomId: string, userId: string): Promise<boolean>;
    revokeInvitationWithStellarUpdate(invitationId: string, userId: string): Promise<{
        invitation: Invitation;
        stellarTxId: string | null;
    }>;
    getInvitationAuditTrail(invitationId: string): Promise<{
        databaseEvents: any[];
        stellarEvents: any[];
        combinedTimeline: any[];
    }>;
}
