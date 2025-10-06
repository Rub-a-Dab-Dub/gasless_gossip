import type { BulkAction } from "./bulk-action.entity";
export declare class RoomActionResult {
    id: string;
    bulkActionId: string;
    bulkAction: BulkAction;
    roomId: string;
    status: "success" | "failed" | "skipped" | "rolled_back";
    previousState: Record<string, any>;
    newState: Record<string, any>;
    errorMessage: string;
    executionTimeMs: number;
    createdAt: Date;
}
