export declare class LeaderboardEvent {
    id: string;
    userId: string;
    eventType: string;
    category: string;
    data: {
        oldRank?: number;
        newRank?: number;
        badgeType?: string;
        milestone?: string;
        score?: number;
    };
    description: string;
    createdAt: Date;
}
