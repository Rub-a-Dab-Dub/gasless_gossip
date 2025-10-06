import { DegenBadgeType } from "../entities/degen-badge.entity";
export declare class AwardBadgeDto {
    userId: string;
    badgeType: DegenBadgeType;
    achievementData?: {
        amount?: number;
        streakLength?: number;
        riskLevel?: number;
        timestamp?: Date;
        metadata?: Record<string, any>;
    };
    mintToken?: boolean;
    customRewardAmount?: number;
}
export declare class BatchAwardBadgeDto {
    userIds: string[];
    badgeType: DegenBadgeType;
    mintTokens?: boolean;
}
