import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Level } from '../../levels/entities/level.entity';

export interface LeaderboardEntry {
  userId: string;
  username?: string;
  level: number;
  totalXp: number;
  currentXp: number;
  rank: number;
}

export interface LeaderboardStats {
  totalUsers: number;
  averageXp: number;
  topLevel: number;
  lastUpdated: Date;
}

@Injectable()
export class LeaderboardsService {
  private readonly logger = new Logger(LeaderboardsService.name);
  private readonly CACHE_KEYS = {
    LEADERBOARD: 'leaderboard',
    USER_RANK: 'user_rank',
    STATS: 'leaderboard_stats',
  };

  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const cacheKey = `${this.CACHE_KEYS.LEADERBOARD}:${limit}`;
    
    try {
      // Try to get from cache first
      const cached = await this.cacheManager.get<LeaderboardEntry[]>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for leaderboard with limit ${limit}`);
        return cached;
      }

      this.logger.debug(`Cache miss for leaderboard with limit ${limit}, fetching from database`);
      
      // Fetch from database
      const levels = await this.levelRepository.find({
        order: { totalXp: 'DESC' },
        take: limit,
        relations: ['user'],
      });

      const leaderboard: LeaderboardEntry[] = levels.map((level, index) => ({
        userId: level.userId,
        username: level.user?.username || 'Unknown',
        level: level.level,
        totalXp: level.totalXp,
        currentXp: level.currentXp,
        rank: index + 1,
      }));

      // Cache the result for 5 minutes
      await this.cacheManager.set(cacheKey, leaderboard, 300000);
      
      this.logger.log(`Cached leaderboard with ${leaderboard.length} entries`);
      return leaderboard;
    } catch (error) {
      this.logger.error(`Error fetching leaderboard: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserRank(userId: string): Promise<number> {
    const cacheKey = `${this.CACHE_KEYS.USER_RANK}:${userId}`;
    
    try {
      // Try to get from cache first
      const cached = await this.cacheManager.get<number>(cacheKey);
      if (cached !== undefined) {
        this.logger.debug(`Cache hit for user rank: ${userId}`);
        return cached;
      }

      this.logger.debug(`Cache miss for user rank: ${userId}, fetching from database`);
      
      // Get user's total XP
      const userLevel = await this.levelRepository.findOne({
        where: { userId },
      });

      if (!userLevel) {
        return 0;
      }

      // Count users with higher XP
      const rank = await this.levelRepository
        .createQueryBuilder('level')
        .where('level.totalXp > :userXp', { userXp: userLevel.totalXp })
        .getCount();

      const userRank = rank + 1;

      // Cache the result for 5 minutes
      await this.cacheManager.set(cacheKey, userRank, 300000);
      
      this.logger.debug(`Cached user rank for ${userId}: ${userRank}`);
      return userRank;
    } catch (error) {
      this.logger.error(`Error fetching user rank for ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getLeaderboardStats(): Promise<LeaderboardStats> {
    const cacheKey = this.CACHE_KEYS.STATS;
    
    try {
      // Try to get from cache first
      const cached = await this.cacheManager.get<LeaderboardStats>(cacheKey);
      if (cached) {
        this.logger.debug('Cache hit for leaderboard stats');
        return cached;
      }

      this.logger.debug('Cache miss for leaderboard stats, fetching from database');
      
      // Fetch stats from database
      const [totalUsers, averageResult, topLevelResult] = await Promise.all([
        this.levelRepository.count(),
        this.levelRepository
          .createQueryBuilder('level')
          .select('AVG(level.totalXp)', 'average')
          .getRawOne(),
        this.levelRepository
          .createQueryBuilder('level')
          .select('MAX(level.level)', 'maxLevel')
          .getRawOne(),
      ]);

      const stats: LeaderboardStats = {
        totalUsers,
        averageXp: parseFloat(averageResult?.average || '0'),
        topLevel: parseInt(topLevelResult?.maxLevel || '0'),
        lastUpdated: new Date(),
      };

      // Cache the result for 10 minutes (stats change less frequently)
      await this.cacheManager.set(cacheKey, stats, 600000);
      
      this.logger.log(`Cached leaderboard stats: ${totalUsers} users, avg XP: ${stats.averageXp}`);
      return stats;
    } catch (error) {
      this.logger.error(`Error fetching leaderboard stats: ${error.message}`, error.stack);
      throw error;
    }
  }

  async invalidateLeaderboardCache(): Promise<void> {
    try {
      // Clear all leaderboard-related cache entries
      // Note: In a real Redis implementation, you'd use pattern matching
      // For now, we'll clear the main cache keys
      await this.cacheManager.del(this.CACHE_KEYS.LEADERBOARD);
      await this.cacheManager.del(this.CACHE_KEYS.STATS);
      
      // Note: User rank cache keys are user-specific and will be cleared individually
      this.logger.log('Invalidated leaderboard cache entries');
    } catch (error) {
      this.logger.error(`Error invalidating leaderboard cache: ${error.message}`, error.stack);
    }
  }

  async invalidateUserRankCache(userId: string): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_KEYS.USER_RANK}:${userId}`;
      await this.cacheManager.del(cacheKey);
      this.logger.debug(`Invalidated user rank cache for ${userId}`);
    } catch (error) {
      this.logger.error(`Error invalidating user rank cache for ${userId}: ${error.message}`, error.stack);
    }
  }

  async getCacheStats(): Promise<{
    leaderboardHits: number;
    leaderboardMisses: number;
    userRankHits: number;
    userRankMisses: number;
    statsHits: number;
    statsMisses: number;
  }> {
    // This would require implementing cache hit/miss tracking
    // For now, return mock data
    return {
      leaderboardHits: 0,
      leaderboardMisses: 0,
      userRankHits: 0,
      userRankMisses: 0,
      statsHits: 0,
      statsMisses: 0,
    };
  }
}
