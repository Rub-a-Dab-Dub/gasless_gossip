import { ActivityAction } from "../entities/activity-log.entity";
export declare class QueryActivityLogsDto {
    action?: ActivityAction;
    roomId?: string;
    targetUserId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
