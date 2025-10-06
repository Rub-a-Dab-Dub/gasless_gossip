import { GiftGivenEvent } from '../events/gift-given.event';
import { GiftAnalyticsEvent } from '../events/gift-analytics.event';
export declare class GiftAnalyticsListener {
    private readonly logger;
    handleGiftGiven(event: GiftGivenEvent): void;
    handleGiftAnalytics(event: GiftAnalyticsEvent): void;
    private trackEngagement;
    private processAnalytics;
}
