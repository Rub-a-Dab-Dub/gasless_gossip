import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';
export interface AnalyticsEvent {
    userId: string;
    eventType: string;
    properties: Record<string, any>;
    timestamp: Date;
}
export declare class AnalyticsService {
    private readonly logger;
    trackLevelUp(event: LevelUpEvent): Promise<void>;
    trackXpGained(event: XpGainedEvent): Promise<void>;
    private trackEvent;
}
