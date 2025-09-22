import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsController } from '../achievements.controller';
import { AchievementsService } from '../achievements.service';
import { Achievement, AchievementType, AchievementTier } from '../entities/achievement.entity';
import { AwardAchievementDto, CheckMilestoneDto } from '../dto';

describe('AchievementsController', () => {
  let controller: AchievementsController;
  let service: AchievementsService;

  const mockAchievement: Achievement = {
    id: 'achievement-123',
    userId: 'user-123',
    type: AchievementType.MESSAGES_SENT,
    tier: AchievementTier.BRONZE,
    milestoneValue: 10,
    rewardAmount: 10,
    isClaimed: false,
    awardedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementsController],
      providers: [
        {
          provide: AchievementsService,
          useValue: {
            getUserAchievements: jest.fn(),
            awardAchievement: jest.fn(),
            checkAndAwardMilestones: jest.fn(),
            getUserAchievementStats: jest.fn(),
            getAchievementTypes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AchievementsController>(AchievementsController);
    service = module.get<AchievementsService>(AchievementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserAchievements', () => {
    it('should return user achievements', async () => {
      const mockAchievements = [mockAchievement];
      jest.spyOn(service, 'getUserAchievements').mockResolvedValue(mockAchievements);

      const result = await controller.getUserAchievements('user-123');

      expect(result).toEqual(mockAchievements);
      expect(service.getUserAchievements).toHaveBeenCalledWith('user-123');
    });
  });

  describe('awardAchievement', () => {
    it('should award an achievement', async () => {
      const awardDto: AwardAchievementDto = {
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        tier: AchievementTier.BRONZE,
        milestoneValue: 10,
        rewardAmount: 10,
      };

      jest.spyOn(service, 'awardAchievement').mockResolvedValue(mockAchievement);

      const result = await controller.awardAchievement(awardDto);

      expect(result).toEqual(mockAchievement);
      expect(service.awardAchievement).toHaveBeenCalledWith(awardDto);
    });
  });

  describe('checkAndAwardMilestones', () => {
    it('should check and award milestones', async () => {
      const checkDto: CheckMilestoneDto = {
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        currentValue: 50,
      };

      const mockNewAchievements = [mockAchievement];
      jest.spyOn(service, 'checkAndAwardMilestones').mockResolvedValue(mockNewAchievements);

      const result = await controller.checkAndAwardMilestones(checkDto);

      expect(result).toEqual(mockNewAchievements);
      expect(service.checkAndAwardMilestones).toHaveBeenCalledWith(checkDto);
    });
  });

  describe('getUserAchievementStats', () => {
    it('should return user achievement statistics', async () => {
      const mockStats = {
        totalAchievements: 5,
        totalRewards: 150,
        achievementsByType: {
          [AchievementType.MESSAGES_SENT]: 2,
          [AchievementType.ROOMS_JOINED]: 1,
          [AchievementType.PREDICTIONS_MADE]: 1,
          [AchievementType.BETS_PLACED]: 1,
          [AchievementType.GAMBLES_PLAYED]: 0,
          [AchievementType.TRADES_COMPLETED]: 0,
          [AchievementType.VISITS_MADE]: 0,
          [AchievementType.LEVEL_REACHED]: 0,
          [AchievementType.STREAK_DAYS]: 0,
          [AchievementType.TOKENS_EARNED]: 0,
        },
        achievementsByTier: {
          [AchievementTier.BRONZE]: 2,
          [AchievementTier.SILVER]: 2,
          [AchievementTier.GOLD]: 1,
          [AchievementTier.PLATINUM]: 0,
          [AchievementTier.DIAMOND]: 0,
        },
      };

      jest.spyOn(service, 'getUserAchievementStats').mockResolvedValue(mockStats);

      const result = await controller.getUserAchievementStats('user-123');

      expect(result).toEqual(mockStats);
      expect(service.getUserAchievementStats).toHaveBeenCalledWith('user-123');
    });
  });

  describe('getAchievementTypes', () => {
    it('should return available achievement types', async () => {
      const mockTypes = {
        [AchievementType.MESSAGES_SENT]: [10, 50, 100, 500, 1000],
        [AchievementType.ROOMS_JOINED]: [5, 25, 50, 100, 250],
      };

      jest.spyOn(service, 'getAchievementTypes').mockReturnValue(mockTypes);

      const result = controller.getAchievementTypes();

      expect(result).toEqual(mockTypes);
      expect(service.getAchievementTypes).toHaveBeenCalled();
    });
  });
});
