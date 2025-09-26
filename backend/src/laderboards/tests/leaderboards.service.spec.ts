import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { LeaderboardsService } from '../src/leaderboards/leaderboards.service';
import { Leaderboard, RankType } from '../src/leaderboards/entities/leaderboard.entity';

describe('LeaderboardsService', () => {
  let service: LeaderboardsService;
  let repository: Repository<Leaderboard>;
  let redis: Redis;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockRedis = {
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardsService,
        {
          provide: getRepositoryToken(Leaderboard),
          useValue: mockRepository,
        },
        {
          provide: getRedisToken(),
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<LeaderboardsService>(LeaderboardsService);
    repository = module.get<Repository<Leaderboard>>(getRepositoryToken(Leaderboard));
    redis = module.get<Redis>(getRedisToken());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLeaderboard', () => {
    it('should return cached leaderboard if available', async () => {
      const cachedData = {
        type: 'xp',
        entries: [{ rank: 1, userId: 'user1', score: 1000 }],
        total: 1,
        generatedAt: new Date(),
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await service.getLeaderboard({
        type: RankType.XP,
        limit: 10,
        offset: 0,
      });

      expect(result.cached).toBe(true);
      expect(result.entries).toEqual(cachedData.entries);
      expect(mockRedis.get).toHaveBeenCalledWith('leaderboard:xp:10:0');
    });

    it('should fetch from database and cache when cache miss', async () => {
      const dbEntries = [
        { id: '1', userId: 'user1', score: 1000, rankType: RankType.XP },
        { id: '2', userId: 'user2', score: 800, rankType: RankType.XP },
      ];

      mockRedis.get.mockResolvedValue(null);
      
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([dbEntries, 2]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockRedis.setex.mockResolvedValue('OK');

      const result = await service.getLeaderboard({
        type: RankType.XP,
        limit: 10,
        offset: 0,
      });

      expect(result.cached).toBe(false);
      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].rank).toBe(1);
      expect(result.entries[1].rank).toBe(2);
      expect(mockRedis.setex).toHaveBeenCalled();
    });
  });

  describe('updateUserScore', () => {
    it('should create new entry if user does not exist', async () => {
      const createDto = {
        rankType: RankType.XP,
        userId: 'user1',
        score: 1000,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockResolvedValue({ id: '1', ...createDto });
      mockRedis.keys.mockResolvedValue(['leaderboard:xp:10:0']);
      mockRedis.del.mockResolvedValue(1);

      const result = await service.updateUserScore(createDto);

      expect(result.userId).toBe('user1');
      expect(result.score).toBe(1000);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update existing entry', async () => {
      const existingEntry = {
        id: '1',
        rankType: RankType.XP,
        userId: 'user1',
        score: 800,
      };

      const updateDto = {
        rankType: RankType.XP,
        userId: 'user1',
        score: 1000,
      };

      mockRepository.findOne.mockResolvedValue(existingEntry);
      mockRepository.save.mockResolvedValue({ ...existingEntry, score: 1000 });
      mockRedis.keys.mockResolvedValue([]);

      const result = await service.updateUserScore(updateDto);

      expect(result.score).toBe(1000);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existingEntry,
        score: 1000,
      });
    });
  });
});

