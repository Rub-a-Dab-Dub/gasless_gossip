import { ActivityAction } from "../entities/activity-log.entity";
export declare class ActivityLogResponseDto {
    id: string;
    userId: string;
    action: ActivityAction;
    metadata?: Record<string, any>;
    roomId?: string;
    targetUserId?: string;
    amount?: number;
    createdAt: Date;
    user?: {
        id: string;
        username: string;
        pseudonym?: string;
    };
    targetUser?: {
        id: string;
        username: string;
        pseudonym?: string;
    };
}
