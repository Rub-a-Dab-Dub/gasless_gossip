import { RateLimitService } from './services/rate-limit.service';
export declare class RateLimitController {
    private readonly rateLimitService;
    constructor(rateLimitService: RateLimitService);
    getViolations(userId?: string, ipAddress?: string, endpoint?: string, hours?: number, limit?: number): Promise<import("./entities/rate-limit-violation.entity").RateLimitViolation[]>;
    getStats(hours?: number): Promise<{
        totalViolations: number;
        uniqueUsers: number;
        uniqueIps: number;
        topEndpoints: Array<{
            endpoint: string;
            count: number;
        }>;
        topUsers: Array<{
            userId: string;
            count: number;
        }>;
        topIps: Array<{
            ipAddress: string;
            count: number;
        }>;
    }>;
    getPerformanceMetrics(): Promise<{
        averageResponseTime: number;
        violationsPerMinute: number;
        successRate: number;
        topViolatingEndpoints: string[];
    }>;
    resolveViolation(violationId: string): Promise<{
        status: string;
        violationId: string;
    }>;
    ignoreViolation(violationId: string): Promise<{
        status: string;
        violationId: string;
    }>;
    cleanupOldViolations(days?: number): Promise<{
        status: string;
        deletedCount: number;
    }>;
    getMyViolations(req: any, limit?: number): Promise<import("./entities/rate-limit-violation.entity").RateLimitViolation[]>;
}
