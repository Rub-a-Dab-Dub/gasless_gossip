import type { Repository, DataSource } from "typeorm";
import type { BulkAction } from "./entities/bulk-action.entity";
import type { RoomActionResult } from "./entities/room-action-result.entity";
import type { BulkActionNotification } from "./entities/bulk-action-notification.entity";
import type { CreateBulkActionDto } from "./dto/create-bulk-action.dto";
import type { ExecuteBulkActionDto } from "./dto/execute-bulk-action.dto";
import type { RollbackBulkActionDto } from "./dto/rollback-bulk-action.dto";
import type { QueryBulkActionsDto } from "./dto/query-bulk-actions.dto";
export declare class BulkRoomActionService {
    private bulkActionRepo;
    private roomActionResultRepo;
    private notificationRepo;
    private dataSource;
    constructor(bulkActionRepo: Repository<BulkAction>, roomActionResultRepo: Repository<RoomActionResult>, notificationRepo: Repository<BulkActionNotification>, dataSource: DataSource);
    createBulkAction(dto: CreateBulkActionDto): Promise<{
        bulkAction: BulkAction;
        preview: {
            totalRooms: number;
            estimatedTime: string;
            affectedRooms: string[];
            validationErrors: Array<{
                roomId: string;
                error: string;
            }>;
        };
    }>;
    executeBulkAction(dto: ExecuteBulkActionDto): Promise<BulkAction>;
    private executeInBackground;
    private executeRoomAction;
    rollbackBulkAction(dto: RollbackBulkActionDto): Promise<{
        success: boolean;
        rolledBackCount: number;
        errors: Array<{
            roomId: string;
            error: string;
        }>;
    }>;
    createNotification(bulkActionId: string, recipientId: string, notificationType: "started" | "completed" | "failed" | "partial_success", message: string, metadata?: Record<string, any>): Promise<BulkActionNotification>;
    getNotifications(recipientId: string, isRead?: boolean): Promise<BulkActionNotification[]>;
    markNotificationAsRead(notificationId: string): Promise<void>;
    getBulkActions(query: QueryBulkActionsDto): Promise<{
        actions: BulkAction[];
        total: number;
    }>;
    getBulkActionById(id: string): Promise<BulkAction>;
    getRoomActionResults(bulkActionId: string): Promise<RoomActionResult[]>;
    private validateRooms;
    private chunkArray;
    private formatExecutionTime;
}
