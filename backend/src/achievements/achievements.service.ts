import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementType, AchievementTier } from './entities/achievement.entity';
import { User } from '../users/entities/user.entity';
import { StellarService } from '../stellar/stellar.service';
import { AwardAchievementDto, CheckMilestoneDto } from './dto';

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  // Define milestone thresholds for each achievement type
  private readonly milestoneThresholds = {
    [AchievementType.MESSAGES_SENT]: [10, 50, 100, 500, 1000],
    [AchievementType.ROOMS_JOINED]: [5, 25, 50, 100, 250],
    [AchievementType.PREDICTIONS_MADE]: [5, 25, 50, 100, 200],
    [AchievementType.BETS_PLACED]: [5, 25, 50, 100, 200],
    [AchievementType.GAMBLES_PLAYED]: [5, 25, 50, 100, 200],
    [AchievementType.TRADES_COMPLETED]: [5, 25, 50, 100, 200],
    [AchievementType.VISITS_MADE]: [10, 50, 100, 500, 1000],
    [AchievementType.LEVEL_REACHED]: [5, 10, 20, 30, 50],
    [AchievementType.STREAK_DAYS]: [3, 7, 14, 30, 60],
    [AchievementType.TOKENS_EARNED]: [100, 500, 1000, 5000, 10000],
  };

  // Define reward amounts for each tier
  private readonly tierRewards = {
    [AchievementTier.BRONZE]: 10,
    [AchievementTier.SILVER]: 25,
    [AchievementTier.GOLD]: 50,
    [AchievementTier.PLATINUM]: 100,
    [AchievementTier.DIAMOND]: 250,
  };

  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stellarService: StellarService,
  ) {}

  /**
   * Get all achievements for a specific user
   */
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await this.achievementRepository.find({
      where: { userId },
      order: { awardedAt: 'DESC' },
    });

    return achievements;
  }

  /**
   * Award an achievement to a user
   */
  async awardAchievement(awardDto: AwardAchievementDto): Promise<Achievement> {
    const { userId, type, tier = AchievementTier.BRONZE, milestoneValue, rewardAmount } = awardDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if achievement already exists for this milestone
    const existingAchievement = await this.achievementRepository.findOne({
      where: { userId, type, milestoneValue },
    });

    if (existingAchievement) {
      throw new BadRequestException(
        `Achievement of type ${type} for milestone ${milestoneValue} already exists for user ${userId}`,
      );
    }

    // Calculate reward amount if not provided
    const finalRewardAmount = rewardAmount || this.tierRewards[tier];

    // Create the achievement
    const achievement = this.achievementRepository.create({
      userId,
      type,
      tier,
      milestoneValue,
      rewardAmount: finalRewardAmount,
    });

    const savedAchievement = await this.achievementRepository.save(achievement);

    // Mint Stellar tokens for the reward
    try {
      await this.stellarService.distributeReward(userId, finalRewardAmount);
      this.logger.log(`Awarded achievement ${savedAchievement.id} to user ${userId} with ${finalRewardAmount} tokens`);
    } catch (error) {
      this.logger.error(`Failed to distribute Stellar reward for achievement ${savedAchievement.id}:`, error);
      // Don't throw error here as the achievement is already saved
    }

    return savedAchievement;
  }

  /**
   * Check if a user has reached any new milestones and award achievements
   */
  async checkAndAwardMilestones(checkDto: CheckMilestoneDto): Promise<Achievement[]> {
    const { userId, type, currentValue } = checkDto;

    // Get thresholds for this achievement type
    const thresholds = this.milestoneThresholds[type];
    if (!thresholds) {
      throw new BadRequestException(`Invalid achievement type: ${type}`);
    }

    // Find milestones that the user has reached
    const reachedMilestones = thresholds.filter(threshold => currentValue >= threshold);

    if (reachedMilestones.length === 0) {
      return [];
    }

    // Get existing achievements for this type
    const existingAchievements = await this.achievementRepository.find({
      where: { userId, type },
    });

    const existingMilestones = existingAchievements.map(a => a.milestoneValue);

    // Find new milestones that haven't been awarded yet
    const newMilestones = reachedMilestones.filter(
      milestone => !existingMilestones.includes(milestone),
    );

    const newAchievements: Achievement[] = [];

    // Award achievements for new milestones
    for (const milestone of newMilestones) {
      const tier = this.getTierForMilestone(type, milestone);
      const rewardAmount = this.tierRewards[tier];

      try {
        const achievement = await this.awardAchievement({
          userId,
          type,
          tier,
          milestoneValue: milestone,
          rewardAmount,
        });
        newAchievements.push(achievement);
      } catch (error) {
        this.logger.error(`Failed to award achievement for milestone ${milestone}:`, error);
      }
    }

    return newAchievements;
  }

  /**
   * Get achievement statistics for a user
   */
  async getUserAchievementStats(userId: string): Promise<{
    totalAchievements: number;
    totalRewards: number;
    achievementsByType: Record<AchievementType, number>;
    achievementsByTier: Record<AchievementTier, number>;
  }> {
    const achievements = await this.getUserAchievements(userId);

    const stats = {
      totalAchievements: achievements.length,
      totalRewards: achievements.reduce((sum, a) => sum + Number(a.rewardAmount), 0),
      achievementsByType: {} as Record<AchievementType, number>,
      achievementsByTier: {} as Record<AchievementTier, number>,
    };

    // Initialize counters
    Object.values(AchievementType).forEach(type => {
      stats.achievementsByType[type] = 0;
    });
    Object.values(AchievementTier).forEach(tier => {
      stats.achievementsByTier[tier] = 0;
    });

    // Count achievements
    achievements.forEach(achievement => {
      stats.achievementsByType[achievement.type]++;
      stats.achievementsByTier[achievement.tier]++;
    });

    return stats;
  }

  /**
   * Get the tier for a given milestone value
   */
  private getTierForMilestone(type: AchievementType, milestone: number): AchievementTier {
    const thresholds = this.milestoneThresholds[type];
    const index = thresholds.indexOf(milestone);

    switch (index) {
      case 0:
        return AchievementTier.BRONZE;
      case 1:
        return AchievementTier.SILVER;
      case 2:
        return AchievementTier.GOLD;
      case 3:
        return AchievementTier.PLATINUM;
      case 4:
        return AchievementTier.DIAMOND;
      default:
        return AchievementTier.BRONZE;
    }
  }

  /**
   * Get all available achievement types and their thresholds
   */
  getAchievementTypes(): Record<AchievementType, number[]> {
    return this.milestoneThresholds;
  }
}
