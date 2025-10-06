import type { ActivityAction } from "../entities/activity-log.entity";
export declare class ActivityStatsDto {
    totalActivities: number;
    actionCounts: Record<ActivityAction, number>;
    last24Hours: number;
    last7Days: number;
    last30Days: number;
    mostActiveDay: {
        date: string;
        count: number;
    };
    averagePerDay: number;
    mostCommonAction: {
        action: ActivityAction;
        count: number;
        percentage: number;
    };
}
