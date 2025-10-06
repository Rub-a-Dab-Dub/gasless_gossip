import { AchievementsService } from './achievements.service';
import { AwardAchievementDto, CheckMilestoneDto } from './dto';
import { Achievement } from './entities/achievement.entity';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    getUserAchievements(userId: string): Promise<Achievement[]>;
    awardAchievement(awardDto: AwardAchievementDto): Promise<Achievement>;
    checkAndAwardMilestones(checkDto: CheckMilestoneDto): Promise<Achievement[]>;
    getUserAchievementStats(userId: string): Promise<{
        totalAchievements: number;
        totalRewards: number;
        achievementsByType: Record<import("./entities/achievement.entity").AchievementType, number>;
        achievementsByTier: Record<import("./entities/achievement.entity").AchievementTier, number>;
    }>;
    getAchievementTypes(): Record<import("./entities/achievement.entity").AchievementType, number[]>;
}
