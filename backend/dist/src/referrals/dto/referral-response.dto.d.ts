import { ReferralStatus } from '../entities/referral.entity';
export declare class ReferralResponseDto {
    id: string;
    referrerId: string;
    refereeId: string;
    reward: number;
    referralCode: string;
    status: ReferralStatus;
    createdAt: Date;
    completedAt?: Date;
    stellarTransactionId?: string;
}
