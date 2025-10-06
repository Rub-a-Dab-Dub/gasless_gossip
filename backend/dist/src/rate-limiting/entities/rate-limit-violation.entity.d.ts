export declare class RateLimitViolation {
    id: string;
    userId?: string;
    ipAddress: string;
    endpoint: string;
    violationType: 'short' | 'medium' | 'long' | 'custom';
    requestCount: number;
    limit: number;
    userAgent?: string;
    metadata?: Record<string, any>;
    status: string;
    createdAt: Date;
}
