export declare class CreateAuditLogDto {
    userId: string;
    action: string | undefined;
    details?: Record<string, any>;
}
