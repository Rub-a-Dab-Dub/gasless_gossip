import { AchievementType } from '../entities/achievement.entity';
export declare class CheckMilestoneDto {
    userId: string;
    type: AchievementType;
    currentValue: number;
}
