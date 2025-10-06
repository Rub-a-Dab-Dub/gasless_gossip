import { User } from '../../users/entities/user.entity';
export declare enum ContentType {
    SECRET = "secret",
    GIFT = "gift",
    ACHIEVEMENT = "achievement",
    NFT = "nft",
    LEVEL_UP = "level_up",
    BADGE = "badge"
}
export declare enum Platform {
    TWITTER = "twitter",
    X = "x",
    FACEBOOK = "facebook",
    LINKEDIN = "linkedin",
    DISCORD = "discord",
    TELEGRAM = "telegram",
    REDDIT = "reddit",
    OTHER = "other"
}
export declare class Share {
    id: string;
    userId: string;
    user: User;
    contentType: ContentType;
    contentId?: string;
    platform: Platform;
    shareUrl?: string;
    externalUrl?: string;
    shareText?: string;
    metadata?: Record<string, any>;
    xpAwarded: number;
    stellarTxId?: string;
    isSuccessful: boolean;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
