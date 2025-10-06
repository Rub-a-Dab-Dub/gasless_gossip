import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardResponseDto } from './dto/leaderboard-response.dto';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { RankType } from './entities/leaderboard.entity';
export declare class LeaderboardsController {
    private readonly leaderboardsService;
    constructor(leaderboardsService: LeaderboardsService);
    getLeaderboard(type: RankType, query: Omit<LeaderboardQueryDto, 'type'>): Promise<LeaderboardResponseDto>;
    getUserRank(userId: string, type: RankType): Promise<{
        rank?: number | undefined;
        score?: number | undefined;
        userId: string;
        type: RankType;
    }>;
    getTopUsers(type: RankType, limit?: number): Promise<import("./dto/leaderboard-response.dto").LeaderboardEntryDto[]>;
    updateUserScore(createLeaderboardDto: CreateLeaderboardDto): Promise<import("./entities/leaderboard.entity").Leaderboard>;
    generateSampleData(): Promise<{
        message: string;
    }>;
}
