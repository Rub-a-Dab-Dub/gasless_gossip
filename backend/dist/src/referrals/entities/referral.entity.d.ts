export declare enum ReferralStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Referral {
    id: string;
    referrerId: string;
    refereeId: string;
    reward: number;
    referralCode: string;
    status: ReferralStatus;
    stellarTransactionId?: string;
    createdAt: Date;
    completedAt?: Date;
}
