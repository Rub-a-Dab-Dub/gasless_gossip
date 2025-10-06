import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Leaderboard, RankType } from './entities/leaderboard.entity';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardResponseDto, LeaderboardEntryDto } from './dto/leaderboard-response.dto';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
export declare class LeaderboardsService {
    private readonly leaderboardRepository;
    private readonly redis;
    private readonly logger;
    private readonly CACHE_TTL;
    private readonly CACHE_PREFIX;
    constructor(leaderboardRepository: Repository<Leaderboard>, redis: Redis);
    getLeaderboard(query: LeaderboardQueryDto): Promise<LeaderboardResponseDto>;
    updateUserScore(createLeaderboardDto: CreateLeaderboardDto): Promise<Leaderboard>;
    getUserRank(userId: string, rankType: RankType): Promise<{
        rank: number;
        score: number;
    } | null>;
    getTopUsers(rankType: RankType, limit?: number): Promise<LeaderboardEntryDto[]>;
    private invalidateLeaderboardCache;
    generateSampleData(): Promise<void>;
}
