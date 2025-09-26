import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Leaderboard, RankType } from './entities/leaderboard.entity';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardResponseDto, LeaderboardEntryDto } from './dto/leaderboard-response.dto';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';

@Injectable()
export class LeaderboardsService {
  private readonly logger = new Logger(LeaderboardsService.name);
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'leaderboard:';

  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async getLeaderboard(query: LeaderboardQueryDto): Promise<LeaderboardResponseDto> {
    const { type, limit, offset } = query;
    const cacheKey = `${this.CACHE_PREFIX}${type}:${limit}:${offset}`;

    try {
      // Try to get from cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for leaderboard: ${type}`);
        const cachedData = JSON.parse(cached);
        return {
          ...cachedData,
          cached: true,
        };
      }

      this.logger.debug(`Cache miss for leaderboard: ${type}, fetching from DB`);
      
      // Get data from PostgreSQL
      const [entries, total] = await this.leaderboardRepository
        .createQueryBuilder('leaderboard')
        .where('leaderboard.rankType = :type', { type })
        .orderBy('leaderboard.score', 'DESC')
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      // Transform to response format with rankings
      const leaderboardEntries: LeaderboardEntryDto[] = entries.map((entry, index) => ({
        rank: offset + index + 1,
        userId: entry.userId,
        score: entry.score,
      }));

      const response: LeaderboardResponseDto = {
        type,
        entries: leaderboardEntries,
        total,
        cached: false,
        generatedAt: new Date(),
      };

      // Cache the result
      await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(response));
      this.logger.debug(`Cached leaderboard: ${type}`);

      return response;
    } catch (error) {
      this.logger.error(`Error fetching leaderboard ${type}:`, error);
      throw error;
    }
  }

  async updateUserScore(createLeaderboardDto: CreateLeaderboardDto): Promise<Leaderboard> {
    const { rankType, userId, score } = createLeaderboardDto;

    // Upsert user score
    const existingEntry = await this.leaderboardRepository.findOne({
      where: { rankType, userId },
    });

    let leaderboard: Leaderboard;

    if (existingEntry) {
      existingEntry.score = score;
      leaderboard = await this.leaderboardRepository.save(existingEntry);
    } else {
      leaderboard = this.leaderboardRepository.create(createLeaderboardDto);
      leaderboard = await this.leaderboardRepository.save(leaderboard);
    }

    // Invalidate cache for this rank type
    await this.invalidateLeaderboardCache(rankType);

    return leaderboard;
  }

  async getUserRank(userId: string, rankType: RankType): Promise<{ rank: number; score: number } | null> {
    const userEntry = await this.leaderboardRepository.findOne({
      where: { userId, rankType },
    });

    if (!userEntry) {
      return null;
    }

    // Count users with higher scores
    const rank = await this.leaderboardRepository
      .createQueryBuilder('leaderboard')
      .where('leaderboard.rankType = :rankType', { rankType })
      .andWhere('leaderboard.score > :score', { score: userEntry.score })
      .getCount();

    return {
      rank: rank + 1, // Add 1 because rank starts from 1
      score: userEntry.score,
    };
  }

  async getTopUsers(rankType: RankType, limit: number = 10): Promise<LeaderboardEntryDto[]> {
    const entries = await this.leaderboardRepository
      .createQueryBuilder('leaderboard')
      .where('leaderboard.rankType = :rankType', { rankType })
      .orderBy('leaderboard.score', 'DESC')
      .limit(limit)
      .getMany();

    return entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      score: entry.score,
    }));
  }

  private async invalidateLeaderboardCache(rankType: RankType): Promise<void> {
    try {
      const pattern = `${this.CACHE_PREFIX}${rankType}:*`;
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.debug(`Invalidated cache for ${rankType}, removed ${keys.length} keys`);
      }
    } catch (error) {
      this.logger.error(`Error invalidating cache for ${rankType}:`, error);
    }
  }

  // Method for generating sample data (testing purposes)
  async generateSampleData(): Promise<void> {
    const sampleData = [
      // XP Leaderboard
      { rankType: RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440001', score: 15000 },
      { rankType: RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440002', score: 12500 },
      { rankType: RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440003', score: 10000 },
      { rankType: RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440004', score: 8500 },
      { rankType: RankType.XP, userId: '550e8400-e29b-41d4-a716-446655440005', score: 7000 },
      
      // Tips Leaderboard
      { rankType: RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440001', score: 500 },
      { rankType: RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440003', score: 450 },
      { rankType: RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440002', score: 400 },
      { rankType: RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440006', score: 350 },
      { rankType: RankType.TIPS, userId: '550e8400-e29b-41d4-a716-446655440007', score: 300 },
      
      // Gifts Leaderboard
      { rankType: RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440002', score: 200 },
      { rankType: RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440001', score: 180 },
      { rankType: RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440008', score: 160 },
      { rankType: RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440004', score: 140 },
      { rankType: RankType.GIFTS, userId: '550e8400-e29b-41d4-a716-446655440009', score: 120 },
    ];

    for (const data of sampleData) {
      await this.updateUserScore(data as CreateLeaderboardDto);
    }

    this.logger.log('Sample leaderboard data generated successfully');
  }
}

