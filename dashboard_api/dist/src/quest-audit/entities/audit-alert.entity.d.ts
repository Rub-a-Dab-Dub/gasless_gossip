export declare class AuditAlert {
    id: string;
    userId: string;
    questId: string;
    alertType: string;
    severity: string;
    description: string;
    evidence: {
        completionIds?: string[];
        timeWindow?: number;
        ipAddresses?: string[];
        metadata?: Record<string, any>;
    };
    status: string;
    resolvedBy: string;
    resolvedAt: Date;
    resolution: string;
    createdAt: Date;
    updatedAt: Date;
}
