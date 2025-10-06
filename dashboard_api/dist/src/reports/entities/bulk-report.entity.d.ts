export declare enum ReportStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum ReportFormat {
    JSON = "json",
    CSV = "csv"
}
export declare class BulkReport {
    id: string;
    adminId: string;
    resources: string[];
    filters: Record<string, any>;
    format: ReportFormat;
    status: ReportStatus;
    progress: number;
    fileSizeBytes: number;
    downloadUrl: string;
    errorMessage: string;
    createdAt: Date;
    updatedAt: Date;
}
