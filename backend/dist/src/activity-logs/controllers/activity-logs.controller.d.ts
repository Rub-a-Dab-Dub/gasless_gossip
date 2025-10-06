import type { Request } from "express";
import type { ActivityLogsService } from "../services/activity-logs.service";
import type { CreateActivityLogDto } from "../dto/create-activity-log.dto";
import type { QueryActivityLogsDto } from "../dto/query-activity-logs.dto";
import { ActivityLogResponseDto } from "../dto/activity-log-response.dto";
import { ActivityStatsDto } from "../dto/activity-stats.dto";
import { ActivityAction } from "../entities/activity-log.entity";
export declare class ActivityLogsController {
    private readonly activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
    logActivity(createActivityLogDto: CreateActivityLogDto, req: Request): Promise<ActivityLogResponseDto>;
    getUserActivities(userId: string, queryDto: QueryActivityLogsDto): Promise<{
        activities: import("../entities/activity-log.entity").ActivityLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserActivityStats(userId: string): Promise<ActivityStatsDto>;
    getRecentActivities(limit: string): Promise<import("../entities/activity-log.entity").ActivityLog[]>;
    getActivitiesByAction(action: ActivityAction, limit?: string): Promise<import("../entities/activity-log.entity").ActivityLog[]>;
    getActivityAggregates(startDate?: string, endDate?: string): Promise<{
        totalActivities: number;
        uniqueUsers: number;
        actionBreakdown: Record<ActivityAction, number>;
        hourlyDistribution: Record<string, number>;
    }>;
}
