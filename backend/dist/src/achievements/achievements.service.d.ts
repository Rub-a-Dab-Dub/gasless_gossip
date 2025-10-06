import { Repository } from 'typeorm';
import { Achievement, AchievementType, AchievementTier } from './entities/achievement.entity';
import { User } from '../users/entities/user.entity';
import { StellarService } from '../stellar/stellar.service';
import { AwardAchievementDto, CheckMilestoneDto } from './dto';
export declare class AchievementsService {
    private readonly achievementRepository;
    private readonly userRepository;
    private readonly stellarService;
    private readonly logger;
    private readonly milestoneThresholds;
    private readonly tierRewards;
    constructor(achievementRepository: Repository<Achievement>, userRepository: Repository<User>, stellarService: StellarService);
    getUserAchievements(userId: string): Promise<Achievement[]>;
    awardAchievement(awardDto: AwardAchievementDto): Promise<Achievement>;
    checkAndAwardMilestones(checkDto: CheckMilestoneDto): Promise<Achievement[]>;
    getUserAchievementStats(userId: string): Promise<{
        totalAchievements: number;
        totalRewards: number;
        achievementsByType: Record<AchievementType, number>;
        achievementsByTier: Record<AchievementTier, number>;
    }>;
    private getTierForMilestone;
    getAchievementTypes(): Record<AchievementType, number[]>;
}
