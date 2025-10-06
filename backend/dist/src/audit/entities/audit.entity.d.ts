export declare class AuditLog {
    id: string;
    userId: string;
    action: string;
    details: Record<string, any>;
    createdAt: Date;
}
