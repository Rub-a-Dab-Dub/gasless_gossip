import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';
import type { BadgeUnlockedEvent } from '../events/badge-unlocked.event';
export interface NotificationPayload {
    userId: string;
    type: 'level_up' | 'xp_gained' | 'badge_unlocked';
    title: string;
    message: string;
    data?: Record<string, any>;
    timestamp: Date;
}
export declare class NotificationService {
    private readonly logger;
    sendLevelUpNotification(event: LevelUpEvent): Promise<void>;
    sendXpGainedNotification(event: XpGainedEvent): Promise<void>;
    sendBadgeUnlockedNotification(event: BadgeUnlockedEvent): Promise<void>;
    private sendNotification;
}
