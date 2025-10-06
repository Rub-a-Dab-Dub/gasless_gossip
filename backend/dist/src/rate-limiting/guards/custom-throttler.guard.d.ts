import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RateLimitService } from '../services/rate-limit.service';
export declare class CustomThrottlerGuard extends ThrottlerGuard {
    private readonly rateLimitService;
    private readonly logger;
    constructor(rateLimitService: RateLimitService);
    handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: string): Promise<boolean>;
    private logViolation;
    private getClientIp;
    private getEndpoint;
    private sanitizeHeaders;
}
