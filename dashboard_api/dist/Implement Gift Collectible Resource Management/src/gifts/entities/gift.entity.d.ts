import { UserGift } from "./user-gift.entity";
export declare enum GiftType {
    BADGE = "badge",
    EMOJI = "emoji",
    STICKER = "sticker",
    ANIMATION = "animation"
}
export declare enum GiftRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary"
}
export declare class Gift {
    id: string;
    name: string;
    type: GiftType;
    description: string;
    rarity: GiftRarity;
    totalMinted: number;
    maxSupply: number;
    minLevelRequired: number;
    animationConfig: {
        url?: string;
        duration?: number;
        loop?: boolean;
        effects?: string[];
    };
    metadata: {
        imageUrl?: string;
        thumbnailUrl?: string;
        tags?: string[];
        createdBy?: string;
    };
    isActive: boolean;
    isBattleReward: boolean;
    battleTier: number;
    createdAt: Date;
    updatedAt: Date;
    userGifts: UserGift[];
}
