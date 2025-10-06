import { LeaderboardsService, LeaderboardEntry, LeaderboardStats } from '../services/leaderboards.service';
export declare class LeaderboardsController {
    private readonly leaderboardsService;
    constructor(leaderboardsService: LeaderboardsService);
    getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
    getLeaderboardStats(): Promise<LeaderboardStats>;
    getUserRank(userId: string): Promise<{
        userId: string;
        rank: number;
    }>;
    getCacheStats(): Promise<{
        leaderboardHits: number;
        leaderboardMisses: number;
        userRankHits: number;
        userRankMisses: number;
        statsHits: number;
        statsMisses: number;
    }>;
    invalidateCache(): Promise<{
        message: string;
    }>;
}
