export declare class LeaderboardBadge {
    id: string;
    userId: string;
    badgeType: string;
    badgeName: string;
    description: string;
    tier: string;
    iconUrl: string;
    awardedAt: Date;
    awardedBy: string;
    criteria: {
        minScore?: number;
        minWagered?: number;
        minBets?: number;
        minRank?: number;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
