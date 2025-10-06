export declare class BulkActionNotification {
    id: string;
    bulkActionId: string;
    recipientId: string;
    notificationType: "started" | "completed" | "failed" | "partial_success";
    message: string;
    metadata: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
}
