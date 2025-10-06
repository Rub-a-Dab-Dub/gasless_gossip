import { AchievementType, AchievementTier } from '../entities/achievement.entity';
export declare class AwardAchievementDto {
    userId: string;
    type: AchievementType;
    tier?: AchievementTier;
    milestoneValue: number;
    rewardAmount?: number;
}
