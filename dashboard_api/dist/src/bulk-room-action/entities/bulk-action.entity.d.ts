export declare class BulkAction {
    id: string;
    actionType: "update" | "delete" | "archive" | "restore" | "configure";
    targetRoomIds: string[];
    actionPayload: Record<string, any>;
    status: "pending" | "preview" | "executing" | "completed" | "failed" | "partial";
    totalRooms: number;
    successCount: number;
    failureCount: number;
    errors: Array<{
        roomId: string;
        error: string;
    }>;
    executedBy: string;
    executedAt: Date;
    executionTimeMs: number;
    isDryRun: boolean;
    createdAt: Date;
    updatedAt: Date;
}
