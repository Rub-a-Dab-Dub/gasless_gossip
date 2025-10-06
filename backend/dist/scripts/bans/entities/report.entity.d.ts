export declare enum ReportStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    RESOLVED = "resolved",
    DISMISSED = "dismissed"
}
export declare enum ReportType {
    HARASSMENT = "harassment",
    SPAM = "spam",
    INAPPROPRIATE_CONTENT = "inappropriate_content",
    HATE_SPEECH = "hate_speech",
    SCAM = "scam",
    OTHER = "other"
}
export declare class Report {
    id: string;
    reporterId: string;
    reportedUserId: string;
    type: ReportType;
    reason: string;
    evidence: string;
    status: ReportStatus;
    reviewedBy: string;
    reviewNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
