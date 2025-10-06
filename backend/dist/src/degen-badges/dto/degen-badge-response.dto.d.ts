import { DegenBadgeType, DegenBadgeRarity } from "../entities/degen-badge.entity";
export declare class DegenBadgeResponseDto {
    id: string;
    userId: string;
    badgeType: DegenBadgeType;
    rarity: DegenBadgeRarity;
    criteria: object;
    txId?: string;
    stellarAssetCode?: string;
    stellarAssetIssuer?: string;
    description?: string;
    imageUrl?: string;
    rewardAmount?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DegenBadgeStatsDto {
    totalBadges: number;
    badgesByType: Record<DegenBadgeType, number>;
    badgesByRarity: Record<DegenBadgeRarity, number>;
    totalRewards: number;
    latestBadge?: DegenBadgeResponseDto;
    rarestBadge?: DegenBadgeResponseDto;
}
