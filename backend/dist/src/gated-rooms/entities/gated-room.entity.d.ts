export interface GateRule {
    type: 'token' | 'nft';
    assetCode: string;
    issuer: string;
    minAmount?: number;
    requiredNftId?: string;
}
export declare class GatedRoom {
    id: string;
    roomId: string;
    gateRules: GateRule[];
    roomName?: string;
    description?: string;
    createdBy: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
