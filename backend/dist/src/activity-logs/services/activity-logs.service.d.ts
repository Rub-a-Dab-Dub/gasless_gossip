import type { Repository } from "typeorm";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import { type ActivityLog, ActivityAction } from "../entities/activity-log.entity";
import type { CreateActivityLogDto } from "../dto/create-activity-log.dto";
import type { QueryActivityLogsDto } from "../dto/query-activity-logs.dto";
import type { ActivityStatsDto } from "../dto/activity-stats.dto";
export declare class ActivityLogsService {
    private readonly activityLogRepository;
    private readonly eventEmitter;
    constructor(activityLogRepository: Repository<ActivityLog>, eventEmitter: EventEmitter2);
    logActivity(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog>;
    getUserActivities(userId: string, queryDto: QueryActivityLogsDto): Promise<{
        activities: ActivityLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserActivityStats(userId: string): Promise<ActivityStatsDto>;
    getActivityById(id: string): Promise<ActivityLog>;
    getRecentActivities(limit?: number): Promise<ActivityLog[]>;
    getActivitiesByAction(action: ActivityAction, limit?: number): Promise<ActivityLog[]>;
    deleteUserActivities(userId: string): Promise<void>;
    getActivityAggregates(startDate?: Date, endDate?: Date): Promise<{
        totalActivities: number;
        uniqueUsers: number;
        actionBreakdown: Record<ActivityAction, number>;
        hourlyDistribution: Record<string, number>;
    }>;
}
