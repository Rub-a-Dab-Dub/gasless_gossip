export declare enum RankType {
    XP = "xp",
    TIPS = "tips",
    GIFTS = "gifts"
}
export declare class Leaderboard {
    id: string;
    rankType: RankType;
    userId: string;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}
