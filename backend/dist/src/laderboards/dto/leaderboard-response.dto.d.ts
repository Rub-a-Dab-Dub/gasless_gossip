export declare class LeaderboardEntryDto {
    rank: number;
    userId: string;
    score: number;
    username?: string;
}
export declare class LeaderboardResponseDto {
    type: string;
    entries: LeaderboardEntryDto[];
    total: number;
    cached: boolean;
    generatedAt: Date;
}
