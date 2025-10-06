export declare class BulkAuditDto {
    completionIds: string[];
    action: "flag" | "reverse" | "clear";
    reason: string;
    performedBy: string;
}
