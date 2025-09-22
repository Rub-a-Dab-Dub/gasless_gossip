import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AchievementsService } from '../achievements.service';
import { Achievement, AchievementType, AchievementTier } from '../entities/achievement.entity';
import { User } from '../../users/entities/user.entity';
import { StellarService } from '../../stellar/stellar.service';
import { AwardAchievementDto, CheckMilestoneDto } from '../dto';

describe('AchievementsService', () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserAchievements', () => {
    it('should return user achievements', async () => {
      const mockAchievements = [mockAchievement];
      jest.spyOn(achievementRepository, 'find').mockResolvedValue(mockAchievements);

      const result = await service.getUserAchievements('user-123');

      expect(result).toEqual(mockAchievements);
      expect(achievementRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        order: { awardedAt: 'DESC' },
      });
    });
  });

  describe('awardAchievement', () => {
    const awardDto: AwardAchievementDto = {
      userId: 'user-123',
      type: AchievementType.MESSAGES_SENT,
      tier: AchievementTier.BRONZE,
      milestoneValue: 10,
      rewardAmount: 10,
    };

    it('should award an achievement successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(achievementRepository, 'create').mockReturnValue(mockAchievement);
      jest.spyOn(achievementRepository, 'save').mockResolvedValue(mockAchievement);
      jest.spyOn(stellarService, 'distributeReward').mockResolvedValue();

      const result = await service.awardAchievement(awardDto);

      expect(result).toEqual(mockAchievement);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'user-123' } });
      expect(achievementRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-123', type: AchievementType.MESSAGES_SENT, milestoneValue: 10 },
      });
      expect(stellarService.distributeReward).toHaveBeenCalledWith('user-123', 10);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.awardAchievement(awardDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if achievement already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(mockAchievement);

      await expect(service.awardAchievement(awardDto)).rejects.toThrow(BadRequestException);
    });

    it('should use default reward amount if not provided', async () => {
      const awardDtoWithoutReward = { ...awardDto, rewardAmount: undefined };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(achievementRepository, 'create').mockReturnValue(mockAchievement);
      jest.spyOn(achievementRepository, 'save').mockResolvedValue(mockAchievement);
      jest.spyOn(stellarService, 'distributeReward').mockResolvedValue();

      await service.awardAchievement(awardDtoWithoutReward);

      expect(achievementRepository.create).toHaveBeenCalledWith({
        userId: 'user-123',
        type: AchievementType.MESSAGES_SENT,
        tier: AchievementTier.BRONZE,
        milestoneValue: 10,
        rewardAmount: 10, // Default bronze tier reward
      });
    });
  });

  describe('checkAndAwardMilestones', () => {
    const checkDto: CheckMilestoneDto = {
      userId: 'user-123',
      type: AchievementType.MESSAGES_SENT,
      currentValue: 50,
    };

    it('should award new milestones', async () => {
      const existingAchievements = [
        { ...mockAchievement, milestoneValue: 10 },
      ];
      
      jest.spyOn(achievementRepository, 'find').mockResolvedValue(existingAchievements);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(achievementRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(achievementRepository, 'create').mockReturnValue(mockAchievement);
      jest.spyOn(achievementRepository, 'save').mockResolvedValue(mockAchievement);
      jest.spyOn(stellarService, 'distributeReward').mockResolvedValue();

      const result = await service.checkAndAwardMilestones(checkDto);

      expect(result).toHaveLength(1); // Should award milestone for 50 messages
      expect(result[0].milestoneValue).toBe(50);
    });

    it('should not award already existing milestones', async () => {
      const existingAchievements = [
        { ...mockAchievement, milestoneValue: 10 },
        { ...mockAchievement, milestoneValue: 50 },
      ];
      
      jest.spyOn(achievementRepository, 'find').mockResolvedValue(existingAchievements);

      const result = await service.checkAndAwardMilestones(checkDto);

      expect(result).toHaveLength(0); // No new achievements should be awarded
    });

    it('should throw BadRequestException for invalid achievement type', async () => {
      const invalidCheckDto = { ...checkDto, type: 'invalid_type' as AchievementType };

      await expect(service.checkAndAwardMilestones(invalidCheckDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserAchievementStats', () => {
    it('should return correct statistics', async () => {
      const mockAchievements = [
        { ...mockAchievement, type: AchievementType.MESSAGES_SENT, tier: AchievementTier.BRONZE, rewardAmount: 10 },
        { ...mockAchievement, type: AchievementType.ROOMS_JOINED, tier: AchievementTier.SILVER, rewardAmount: 25 },
      ];
      
      jest.spyOn(achievementRepository, 'find').mockResolvedValue(mockAchievements);

      const result = await service.getUserAchievementStats('user-123');

      expect(result.totalAchievements).toBe(2);
      expect(result.totalRewards).toBe(35);
      expect(result.achievementsByType[AchievementType.MESSAGES_SENT]).toBe(1);
      expect(result.achievementsByType[AchievementType.ROOMS_JOINED]).toBe(1);
      expect(result.achievementsByTier[AchievementTier.BRONZE]).toBe(1);
      expect(result.achievementsByTier[AchievementTier.SILVER]).toBe(1);
    });
  });

  describe('getAchievementTypes', () => {
    it('should return all achievement types and thresholds', () => {
      const result = service.getAchievementTypes();

      expect(result).toHaveProperty(AchievementType.MESSAGES_SENT);
      expect(result).toHaveProperty(AchievementType.ROOMS_JOINED);
      expect(result[AchievementType.MESSAGES_SENT]).toEqual([10, 50, 100, 500, 1000]);
    });
  });
});
