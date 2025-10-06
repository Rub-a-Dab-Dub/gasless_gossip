import type { ConfigService } from "@nestjs/config";
export interface InvitationContractData {
    invitationId: string;
    roomId: string;
    inviterId: string;
    inviteeId: string;
    code: string;
    timestamp: number;
}
export declare class StellarInvitationService {
    private configService;
    private readonly logger;
    private readonly server;
    private readonly sourceKeypair;
    private readonly networkPassphrase;
    constructor(configService: ConfigService);
    recordInvitationAcceptance(data: InvitationContractData): Promise<string>;
    verifyInvitationOnChain(invitationId: string): Promise<InvitationContractData | null>;
    verifyRoomAccess(roomId: string, userId: string): Promise<boolean>;
    revokeInvitationOnChain(invitationId: string): Promise<string>;
    getInvitationHistory(invitationId: string): Promise<any[]>;
    private encodeInvitationData;
    private decodeInvitationData;
    getAccountBalance(): Promise<{
        balance: string;
        asset: string;
    }[]>;
    healthCheck(): Promise<{
        status: string;
        network: string;
        account: string;
    }>;
}
