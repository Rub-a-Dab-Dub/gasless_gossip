import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardsService } from '../services/leaderboards.service';
import { Level } from '../../levels/entities/level.entity';

describe('LeaderboardsService Cache', () => {
  let service: LeaderboardsService;
  let mockRepository: jest.Mocked<Repository<Level>>;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardsService,
        {
          provide: getRepositoryToken(Level),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<LeaderboardsService>(LeaderboardsService);
  });

  describe('getLeaderboard', () => {
    it('should return cached data when available', async () => {
      const cachedData = [
        {
          userId: 'user1',
          username: 'testuser1',
          level: 5,
          totalXp: 1000,
          currentXp: 200,
          rank: 1,
        },
      ];

      mockCacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getLeaderboard(10);

      expect(result).toEqual(cachedData);
      expect(mockCacheManager.get).toHaveBeenCalledWith('leaderboard:10');
      expect(mockRepository.find).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache when cache miss', async () => {
      const mockLevels = [
        {
          id: '1',
          userId: 'user1',
          level: 5,
          totalXp: 1000,
          currentXp: 200,
          user: { username: 'testuser1' },
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.find.mockResolvedValue(mockLevels as any);

      const result = await service.getLeaderboard(10);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user1');
      expect(result[0].rank).toBe(1);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { totalXp: 'DESC' },
        take: 10,
        relations: ['user'],
      });
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'leaderboard:10',
        expect.any(Array),
        300000,
      );
    });
  });

  describe('getUserRank', () => {
    it('should return cached rank when available', async () => {
      mockCacheManager.get.mockResolvedValue(5);

      const result = await service.getUserRank('user1');

      expect(result).toBe(5);
      expect(mockCacheManager.get).toHaveBeenCalledWith('user_rank:user1');
    });

    it('should fetch from database and cache when cache miss', async () => {
      const mockUserLevel = {
        id: '1',
        userId: 'user1',
        totalXp: 500,
      };

      mockCacheManager.get.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(mockUserLevel as any);
      
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(4),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.getUserRank('user1');

      expect(result).toBe(5); // rank = count + 1
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'user_rank:user1',
        5,
        300000,
      );
    });
  });

  describe('cache invalidation', () => {
    it('should invalidate leaderboard cache', async () => {
      await service.invalidateLeaderboardCache();

      expect(mockCacheManager.del).toHaveBeenCalledWith('leaderboard');
      expect(mockCacheManager.del).toHaveBeenCalledWith('leaderboard_stats');
    });

    it('should invalidate user rank cache', async () => {
      await service.invalidateUserRankCache('user1');

      expect(mockCacheManager.del).toHaveBeenCalledWith('user_rank:user1');
    });
  });
});
