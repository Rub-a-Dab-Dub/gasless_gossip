import { DegenBadgeType, DegenBadgeRarity } from "../entities/degen-badge.entity";
declare class BadgeCriteriaDto {
    minAmount?: number;
    streakLength?: number;
    riskLevel?: number;
    timeframe?: string;
    conditions?: string[];
}
export declare class CreateDegenBadgeDto {
    userId: string;
    badgeType: DegenBadgeType;
    rarity?: DegenBadgeRarity;
    criteria: BadgeCriteriaDto;
    description?: string;
    imageUrl?: string;
    rewardAmount?: number;
    mintStellarToken?: boolean;
}
export {};
