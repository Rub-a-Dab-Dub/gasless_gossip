import type { ActivityLoggedEvent } from "../events/activity-logged.event";
export declare class ActivityAnalyticsListener {
    handleActivityLogged(event: ActivityLoggedEvent): Promise<void>;
    private handleMessageSent;
    private handleTipSent;
    private handleRoomJoined;
    private handleLevelUp;
    private handleBadgeEarned;
    private handleGenericActivity;
}
