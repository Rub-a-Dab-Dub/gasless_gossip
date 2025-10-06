import { Repository } from 'typeorm';
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
export declare class LeaderboardsService {
    private levelRepository;
    private cacheManager;
    private readonly logger;
    private readonly CACHE_KEYS;
    constructor(levelRepository: Repository<Level>, cacheManager: Cache);
    getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
    getUserRank(userId: string): Promise<number>;
    getLeaderboardStats(): Promise<LeaderboardStats>;
    invalidateLeaderboardCache(): Promise<void>;
    invalidateUserRankCache(userId: string): Promise<void>;
    getCacheStats(): Promise<{
        leaderboardHits: number;
        leaderboardMisses: number;
        userRankHits: number;
        userRankMisses: number;
        statsHits: number;
        statsMisses: number;
    }>;
}
