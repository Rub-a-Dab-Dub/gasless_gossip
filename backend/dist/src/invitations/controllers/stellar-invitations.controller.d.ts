import type { StellarInvitationService } from "../services/stellar-invitation.service";
import type { EnhancedInvitationsService } from "../services/enhanced-invitations.service";
export declare class StellarInvitationsController {
    private readonly stellarService;
    private readonly enhancedInvitationsService;
    constructor(stellarService: StellarInvitationService, enhancedInvitationsService: EnhancedInvitationsService);
    getStellarHealth(): Promise<{
        status: string;
        network: string;
        account: string;
    }>;
    getAccountBalance(): Promise<{
        balance: string;
        asset: string;
    }[]>;
    verifyInvitationIntegrity(invitationId: string): Promise<{
        databaseRecord: import("../entities/invitation.entity").Invitation | null;
        stellarRecord: import("../services/stellar-invitation.service").InvitationContractData | null;
        isConsistent: boolean;
        discrepancies: string[];
    }>;
    getInvitationAuditTrail(invitationId: string): Promise<{
        databaseEvents: any[];
        stellarEvents: any[];
        combinedTimeline: any[];
    }>;
    verifyRoomAccess(roomId: string, userId: string): Promise<{
        hasAccess: boolean;
        roomId: string;
        userId: string;
    }>;
    getInvitationHistory(invitationId: string): Promise<any[]>;
}
