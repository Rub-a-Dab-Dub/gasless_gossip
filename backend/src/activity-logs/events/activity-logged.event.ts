import type { ActivityLog } from "../entities/activity-log.entity"

export class ActivityLoggedEvent {
  constructor(public readonly activityLog: ActivityLog) {}
}
