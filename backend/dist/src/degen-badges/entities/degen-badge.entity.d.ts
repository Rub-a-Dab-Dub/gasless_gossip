import { User } from "../../users/entities/user.entity";
export declare enum DegenBadgeType {
    HIGH_ROLLER = "high_roller",
    RISK_TAKER = "risk_taker",
    STREAK_MASTER = "streak_master",
    WHALE_HUNTER = "whale_hunter",
    DIAMOND_HANDS = "diamond_hands",
    DEGEN_LEGEND = "degen_legend"
}
export declare enum DegenBadgeRarity {
    COMMON = "common",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary"
}
export declare class DegenBadge {
    id: string;
    userId: string;
    user: User;
    badgeType: DegenBadgeType;
    rarity: DegenBadgeRarity;
    criteria: {
        minAmount?: number;
        streakLength?: number;
        riskLevel?: number;
        timeframe?: string;
        conditions?: string[];
    };
    txId: string;
    stellarAssetCode: string;
    stellarAssetIssuer: string;
    description: string;
    imageUrl: string;
    rewardAmount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
