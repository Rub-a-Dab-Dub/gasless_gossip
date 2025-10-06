import type { BulkRoomActionService } from "./bulk-room-action.service";
import type { CreateBulkActionDto } from "./dto/create-bulk-action.dto";
import type { ExecuteBulkActionDto } from "./dto/execute-bulk-action.dto";
import type { RollbackBulkActionDto } from "./dto/rollback-bulk-action.dto";
import type { QueryBulkActionsDto } from "./dto/query-bulk-actions.dto";
export declare class BulkRoomActionController {
    private readonly bulkRoomActionService;
    constructor(bulkRoomActionService: BulkRoomActionService);
    createBulkAction(dto: CreateBulkActionDto): Promise<{
        bulkAction: import("./entities/bulk-action.entity").BulkAction;
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
    executeBulkAction(dto: ExecuteBulkActionDto): Promise<import("./entities/bulk-action.entity").BulkAction>;
    rollbackBulkAction(dto: RollbackBulkActionDto): Promise<{
        success: boolean;
        rolledBackCount: number;
        errors: Array<{
            roomId: string;
            error: string;
        }>;
    }>;
    getBulkActions(query: QueryBulkActionsDto): Promise<{
        actions: import("./entities/bulk-action.entity").BulkAction[];
        total: number;
    }>;
    getBulkActionById(id: string): Promise<import("./entities/bulk-action.entity").BulkAction>;
    getRoomActionResults(id: string): Promise<import("./entities/room-action-result.entity").RoomActionResult[]>;
    getNotifications(recipientId: string, isRead?: boolean): Promise<import("./entities/bulk-action-notification.entity").BulkActionNotification[]>;
    markNotificationAsRead(id: string): Promise<{
        message: string;
    }>;
}
