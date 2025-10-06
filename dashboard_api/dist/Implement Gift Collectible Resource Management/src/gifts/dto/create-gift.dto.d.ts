import { GiftType, GiftRarity } from "../entities/gift.entity";
export declare class CreateGiftDto {
    name: string;
    type: GiftType;
    description?: string;
    rarity?: GiftRarity;
    maxSupply?: number;
    minLevelRequired?: number;
    animationConfig?: {
        url?: string;
        duration?: number;
        loop?: boolean;
        effects?: string[];
    };
    metadata?: {
        imageUrl?: string;
        thumbnailUrl?: string;
        tags?: string[];
        createdBy?: string;
    };
    isBattleReward?: boolean;
    battleTier?: number;
}
