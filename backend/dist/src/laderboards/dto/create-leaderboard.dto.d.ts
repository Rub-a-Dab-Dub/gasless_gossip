import { RankType } from '../entities/leaderboard.entity';
export declare class CreateLeaderboardDto {
    rankType: RankType;
    userId: string;
    score: number;
}
