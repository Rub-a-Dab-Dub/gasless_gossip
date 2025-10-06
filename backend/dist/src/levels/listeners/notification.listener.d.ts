import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';
import type { BadgeUnlockedEvent } from '../events/badge-unlocked.event';
import type { NotificationService } from '../services/notification.service';
export declare class NotificationListener {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    handleLevelUpEvent(event: LevelUpEvent): Promise<void>;
    handleXpGainedEvent(event: XpGainedEvent): Promise<void>;
    handleBadgeUnlockedEvent(event: BadgeUnlockedEvent): Promise<void>;
}
