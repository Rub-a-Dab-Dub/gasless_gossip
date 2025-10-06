import { DegenScore } from "./entities/degen-score.entity";
import { LeaderboardBadge } from "./entities/leaderboard-badge.entity";
import { LeaderboardEvent } from "./entities/leaderboard-event.entity";
import type { ComputeDegenDto } from "./dto/compute-degen.dto";
import type { QueryLeaderboardDto } from "./dto/query-leaderboard.dto";
import type { AwardBadgeDto } from "./dto/award-badge.dto";
import type { ResetCycleDto } from "./dto/reset-cycle.dto";
export declare class DegenLeaderboardService {
    private degenScoreRepo;
    private badgeRepo;
    private eventRepo;
    private redisClient;
    constructor(repoFactory: any, redisClient?: any);
    computeDegen(dto: ComputeDegenDto): Promise<DegenScore>;
    getLeaderboard(query: QueryLeaderboardDto): Promise<DegenScore[]>;
    getUserRank(userId: string, category: string, cycleId?: string): Promise<DegenScore | null>;
    awardBadge(dto: AwardBadgeDto): Promise<LeaderboardBadge>;
    resetCycle(dto: ResetCycleDto): Promise<{
        archived: number;
        newCycleId: string;
    }>;
    getUserBadges(userId: string): Promise<LeaderboardBadge[]>;
    getEvents(userId: string, limit?: number): Promise<LeaderboardEvent[]>;
    exportEvents(category: string, startDate: Date, endDate: Date): Promise<LeaderboardEvent[]>;
    private calculateRiskScore;
    private calculateDegenScore;
    private updateRanks;
    private invalidateCache;
    private getBadgeName;
    private getBadgeDescription;
    private createEvent;
}
