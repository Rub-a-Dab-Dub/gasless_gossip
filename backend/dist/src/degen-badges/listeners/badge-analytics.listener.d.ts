import type { BadgeAwardedEvent, BadgeMintedEvent } from "../events/badge-awarded.event";
export declare class BadgeAnalyticsListener {
    private readonly logger;
    handleBadgeAwarded(event: BadgeAwardedEvent): Promise<void>;
    handleBadgeMinted(event: BadgeMintedEvent): Promise<void>;
    private trackBadgeAward;
    private sendBadgeNotification;
    private updateUserAchievements;
    private trackStellarMinting;
}
