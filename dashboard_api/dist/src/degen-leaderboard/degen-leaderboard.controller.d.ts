import type { DegenLeaderboardService } from "./degen-leaderboard.service";
import type { ComputeDegenDto } from "./dto/compute-degen.dto";
import type { QueryLeaderboardDto } from "./dto/query-leaderboard.dto";
import type { AwardBadgeDto } from "./dto/award-badge.dto";
import type { ResetCycleDto } from "./dto/reset-cycle.dto";
export declare class DegenLeaderboardController {
    private readonly degenLeaderboardService;
    constructor(degenLeaderboardService: DegenLeaderboardService);
    computeDegen(dto: ComputeDegenDto): Promise<import("./entities/degen-score.entity").DegenScore>;
    getLeaderboard(query: QueryLeaderboardDto): Promise<import("./entities/degen-score.entity").DegenScore[]>;
    getUserRank(userId: string, category: string, cycleId?: string): Promise<import("./entities/degen-score.entity").DegenScore | null>;
    awardBadge(dto: AwardBadgeDto): Promise<import("./entities/leaderboard-badge.entity").LeaderboardBadge>;
    getUserBadges(userId: string): Promise<import("./entities/leaderboard-badge.entity").LeaderboardBadge[]>;
    resetCycle(dto: ResetCycleDto): Promise<{
        archived: number;
        newCycleId: string;
    }>;
    getEvents(userId: string, limit?: number): Promise<import("./entities/leaderboard-event.entity").LeaderboardEvent[]>;
    exportEvents(category: string, startDate: string, endDate: string): Promise<import("./entities/leaderboard-event.entity").LeaderboardEvent[]>;
}
