export declare class GateRuleDto {
    type: 'token' | 'nft';
    assetCode: string;
    issuer: string;
    minAmount?: number;
    requiredNftId?: string;
}
export declare class CreateGatedRoomDto {
    roomId: string;
    gateRules: GateRuleDto[];
    roomName?: string;
    description?: string;
    createdBy: string;
    isActive?: boolean;
}
