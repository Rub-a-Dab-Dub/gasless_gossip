import type { DegenBadge } from "../entities/degen-badge.entity";
export declare class BadgeAwardedEvent {
    readonly badge: DegenBadge;
    readonly achievementData?: any | undefined;
    readonly timestamp: Date;
    constructor(badge: DegenBadge, achievementData?: any | undefined, timestamp?: Date);
}
export declare class BadgeMintedEvent {
    readonly badgeId: string;
    readonly userId: string;
    readonly transactionId: string;
    readonly assetCode: string;
    readonly amount: string;
    readonly timestamp: Date;
    constructor(badgeId: string, userId: string, transactionId: string, assetCode: string, amount: string, timestamp?: Date);
}
