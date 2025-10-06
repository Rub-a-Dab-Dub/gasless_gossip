import { RankType } from '../entities/leaderboard.entity';
export declare class LeaderboardQueryDto {
    type: RankType;
    limit?: number;
    offset?: number;
}
