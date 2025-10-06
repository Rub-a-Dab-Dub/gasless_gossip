import { ActivityAction } from "../entities/activity-log.entity";
export declare class CreateActivityLogDto {
    userId: string;
    action: ActivityAction;
    metadata?: Record<string, any>;
    roomId?: string;
    targetUserId?: string;
    amount?: number;
    ipAddress?: string;
    userAgent?: string;
}
