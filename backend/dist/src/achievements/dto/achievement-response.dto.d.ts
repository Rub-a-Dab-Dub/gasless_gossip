import { AchievementType, AchievementTier } from '../entities/achievement.entity';
export declare class AchievementResponseDto {
    id: string;
    userId: string;
    type: AchievementType;
    tier: AchievementTier;
    milestoneValue: number;
    rewardAmount: number;
    stellarTransactionHash?: string;
    isClaimed: boolean;
    awardedAt: Date;
}
