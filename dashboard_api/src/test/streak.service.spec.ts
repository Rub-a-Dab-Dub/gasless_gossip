import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreakService } from '../services/streak.service';
import { StreakEntity } from '../entities/streak.entity';

describe('StreakService', () => {
  let service: StreakService;
  let repository: Repository<StreakEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreakService,
        {
          provide: getRepositoryToken(StreakEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StreakService>(StreakService);
    repository = module.get<Repository<StreakEntity>>(getRepositoryToken(StreakEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new streak', async () => {
      const createDto = { userId: 'test-user' };
      const expectedStreak = {
        id: 'test-id',
        ...createDto,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: expect.any(Date),
      };

      jest.spyOn(repository, 'create').mockReturnValue(expectedStreak as StreakEntity);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedStreak as StreakEntity);

      const result = await service.create(createDto);
      expect(result).toEqual(expectedStreak);
    });
  });

  describe('updateStreak', () => {
    it('should increment streak on consecutive days', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const existingStreak = {
        userId: 'test-user',
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: yesterday,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingStreak as StreakEntity);
      jest.spyOn(repository, 'save').mockImplementation(async (entity) => entity as StreakEntity);

      const result = await service.updateStreak('test-user');
      expect(result.currentStreak).toBe(2);
      expect(result.longestStreak).toBe(2);
    });

    it('should reset streak after missing a day', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const existingStreak = {
        userId: 'test-user',
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: twoDaysAgo,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingStreak as StreakEntity);
      jest.spyOn(repository, 'save').mockImplementation(async (entity) => entity as StreakEntity);

      const result = await service.updateStreak('test-user');
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(5);
    });
  });

  describe('getTopStreaks', () => {
    it('should return top streaks ordered by currentStreak', async () => {
      const mockStreaks = [
        { userId: 'user1', currentStreak: 10 },
        { userId: 'user2', currentStreak: 8 },
        { userId: 'user3', currentStreak: 5 },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockStreaks as StreakEntity[]);

      const result = await service.getTopStreaks(3);
      expect(result).toEqual(mockStreaks);
      expect(result[0].currentStreak).toBeGreaterThan(result[1].currentStreak);
      expect(result[1].currentStreak).toBeGreaterThan(result[2].currentStreak);
    });
  });

  describe('applyBoost', () => {
    it('should apply multiplier to streak', async () => {
      const existingStreak = {
        userId: 'test-user',
        multiplier: 1.0,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingStreak as StreakEntity);
      jest.spyOn(repository, 'save').mockImplementation(async (entity) => entity as StreakEntity);

      const result = await service.applyBoost('test-user', 2.0);
      expect(result.multiplier).toBe(2.0);
    });
  });
});