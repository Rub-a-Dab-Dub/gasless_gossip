export declare class BadgeUnlockedEvent {
    readonly userId: string;
    readonly badgeId: string;
    readonly level: number;
    readonly stellarTransactionId?: string | undefined;
    constructor(userId: string, badgeId: string, level: number, stellarTransactionId?: string | undefined);
}
