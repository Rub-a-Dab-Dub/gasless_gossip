export declare class CheckAccessDto {
    roomId: string;
    stellarAccountId: string;
}
export declare class AccessStatusDto {
    hasAccess: boolean;
    roomId: string;
    stellarAccountId: string;
    gateRules: any[];
    verificationResults: any[];
}
