export declare enum TwoFactorMethod {
    EMAIL = "email",
    TOTP = "totp"
}
export declare class TwoFactor {
    id: string;
    userId: string;
    method: TwoFactorMethod;
    secret: string;
    isEnabled: boolean;
    lastUsedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
