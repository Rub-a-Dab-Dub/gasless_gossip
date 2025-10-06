import type { ActivityLog } from "../entities/activity-log.entity";
export declare class ActivityLoggedEvent {
    readonly activityLog: ActivityLog;
    constructor(activityLog: ActivityLog);
}
