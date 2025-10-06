import { Repository } from 'typeorm';
import { RateLimitViolation } from '../entities/rate-limit-violation.entity';
export declare class RateLimitService {
    private readonly violationRepo;
    private readonly logger;
    constructor(violationRepo: Repository<RateLimitViolation>);
    logViolation(data: {
        userId?: string;
        ipAddress: string;
        endpoint: string;
        violationType: 'short' | 'medium' | 'long' | 'custom';
        requestCount: number;
        limit: number;
        userAgent?: string;
        metadata?: Record<string, any>;
    }): Promise<RateLimitViolation>;
    getViolationsByUser(userId: string, limit?: number): Promise<RateLimitViolation[]>;
    getViolationsByIp(ipAddress: string, limit?: number): Promise<RateLimitViolation[]>;
    getViolationsByEndpoint(endpoint: string, limit?: number): Promise<RateLimitViolation[]>;
    getRecentViolations(hours?: number, limit?: number): Promise<RateLimitViolation[]>;
    getViolationStats(hours?: number): Promise<{
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
    resolveViolation(violationId: string): Promise<void>;
    ignoreViolation(violationId: string): Promise<void>;
    cleanupOldViolations(days?: number): Promise<number>;
    getPerformanceMetrics(): Promise<{
        averageResponseTime: number;
        violationsPerMinute: number;
        successRate: number;
        topViolatingEndpoints: string[];
    }>;
}
