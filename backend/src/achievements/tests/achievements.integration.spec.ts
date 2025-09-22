import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementsService } from '../achievements.service';
import { Achievement, AchievementType, AchievementTier } from '../entities/achievement.entity';
import { User } from '../../users/entities/user.entity';
import { StellarService } from '../../stellar/stellar.service';

describe('Achievements Integration Tests', () => {
  let service: AchievementsService;
  let achievementRepository: Repository<Achievement>;
  let userRepository: Repository<User>;
  let stellarService: StellarService;

  const mockUser: User = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    pseudonym: 'Test User',
    stellarAccountId: 'stellar-123',
    badges: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        {
          provide: getRepositoryToken(Achievement),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: StellarService,
          useValue: {
            distributeReward: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    achievementRepository = module.get<Repository<Achievement>>(getRepositoryToken(Achievement));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    stellarService = module.get<StellarService>(StellarService);
  });

  describe('Mock User Actions - Achievement Flow', () => {
    it('should award achievements for user sending messages', async () => {
      // Mock user exists
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      
      // Mock no existing achievements
      jest.spyOn(achievementRepository, 'find').mockResolvedValue([]);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(null);
      
      // Mock achievement creation and saving
      const mockAchievement = {
        id: 'achievement-123',
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        tier: AchievementTier.BRONZE,
        milestoneValue: 10,
        rewardAmount: 10,
        isClaimed: false,
        awardedAt: new Date(),
      };
      
      jest.spyOn(achievementRepository, 'create').mockReturnValue(mockAchievement as Achievement);
      jest.spyOn(achievementRepository, 'save').mockResolvedValue(mockAchievement as Achievement);
      jest.spyOn(stellarService, 'distributeReward').mockResolvedValue();

      // Simulate user sending 10 messages
      const newAchievements = await service.checkAndAwardMilestones({
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        currentValue: 10,
      });

      expect(newAchievements).toHaveLength(1);
      expect(newAchievements[0].type).toBe(AchievementType.MESSAGES_SENT);
      expect(newAchievements[0].milestoneValue).toBe(10);
      expect(newAchievements[0].tier).toBe(AchievementTier.BRONZE);
      expect(newAchievements[0].rewardAmount).toBe(10);
      expect(stellarService.distributeReward).toHaveBeenCalledWith('user-123', 10);
    });

    it('should award multiple achievements for user reaching higher milestones', async () => {
      // Mock user exists
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      
      // Mock existing bronze achievement
      const existingAchievement = {
        id: 'achievement-123',
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        tier: AchievementTier.BRONZE,
        milestoneValue: 10,
        rewardAmount: 10,
        isClaimed: false,
        awardedAt: new Date(),
      };
      
      jest.spyOn(achievementRepository, 'find').mockResolvedValue([existingAchievement as Achievement]);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(null);
      
      // Mock new achievement creation
      const newAchievement = {
        id: 'achievement-456',
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        tier: AchievementTier.SILVER,
        milestoneValue: 50,
        rewardAmount: 25,
        isClaimed: false,
        awardedAt: new Date(),
      };
      
      jest.spyOn(achievementRepository, 'create').mockReturnValue(newAchievement as Achievement);
      jest.spyOn(achievementRepository, 'save').mockResolvedValue(newAchievement as Achievement);
      jest.spyOn(stellarService, 'distributeReward').mockResolvedValue();

      // Simulate user sending 50 messages (should get silver achievement)
      const newAchievements = await service.checkAndAwardMilestones({
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        currentValue: 50,
      });

      expect(newAchievements).toHaveLength(1);
      expect(newAchievements[0].type).toBe(AchievementType.MESSAGES_SENT);
      expect(newAchievements[0].milestoneValue).toBe(50);
      expect(newAchievements[0].tier).toBe(AchievementTier.SILVER);
      expect(newAchievements[0].rewardAmount).toBe(25);
      expect(stellarService.distributeReward).toHaveBeenCalledWith('user-123', 25);
    });

    it('should award achievements for user joining rooms', async () => {
      // Mock user exists
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      
      // Mock no existing achievements
      jest.spyOn(achievementRepository, 'find').mockResolvedValue([]);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(null);
      
      // Mock achievement creation
      const mockAchievement = {
        id: 'achievement-789',
        userId: 'user-123',
        type: AchievementType.ROOMS_JOINED,
        tier: AchievementTier.BRONZE,
        milestoneValue: 5,
        rewardAmount: 10,
        isClaimed: false,
        awardedAt: new Date(),
      };
      
      jest.spyOn(achievementRepository, 'create').mockReturnValue(mockAchievement as Achievement);
      jest.spyOn(achievementRepository, 'save').mockResolvedValue(mockAchievement as Achievement);
      jest.spyOn(stellarService, 'distributeReward').mockResolvedValue();

      // Simulate user joining 5 rooms
      const newAchievements = await service.checkAndAwardMilestones({
        userId: 'user-123',
        type: AchievementType.ROOMS_JOINED,
        currentValue: 5,
      });

      expect(newAchievements).toHaveLength(1);
      expect(newAchievements[0].type).toBe(AchievementType.ROOMS_JOINED);
      expect(newAchievements[0].milestoneValue).toBe(5);
      expect(newAchievements[0].tier).toBe(AchievementTier.BRONZE);
      expect(stellarService.distributeReward).toHaveBeenCalledWith('user-123', 10);
    });

    it('should calculate correct achievement statistics', async () => {
      // Mock multiple achievements
      const mockAchievements = [
        {
          id: 'achievement-1',
          userId: 'user-123',
          type: AchievementType.MESSAGES_SENT,
          tier: AchievementTier.BRONZE,
          milestoneValue: 10,
          rewardAmount: 10,
          isClaimed: false,
          awardedAt: new Date(),
        },
        {
          id: 'achievement-2',
          userId: 'user-123',
          type: AchievementType.MESSAGES_SENT,
          tier: AchievementTier.SILVER,
          milestoneValue: 50,
          rewardAmount: 25,
          isClaimed: false,
          awardedAt: new Date(),
        },
        {
          id: 'achievement-3',
          userId: 'user-123',
          type: AchievementType.ROOMS_JOINED,
          tier: AchievementTier.BRONZE,
          milestoneValue: 5,
          rewardAmount: 10,
          isClaimed: false,
          awardedAt: new Date(),
        },
      ];
      
      jest.spyOn(achievementRepository, 'find').mockResolvedValue(mockAchievements as Achievement[]);

      const stats = await service.getUserAchievementStats('user-123');

      expect(stats.totalAchievements).toBe(3);
      expect(stats.totalRewards).toBe(45); // 10 + 25 + 10
      expect(stats.achievementsByType[AchievementType.MESSAGES_SENT]).toBe(2);
      expect(stats.achievementsByType[AchievementType.ROOMS_JOINED]).toBe(1);
      expect(stats.achievementsByTier[AchievementTier.BRONZE]).toBe(2);
      expect(stats.achievementsByTier[AchievementTier.SILVER]).toBe(1);
    });
  });
});
