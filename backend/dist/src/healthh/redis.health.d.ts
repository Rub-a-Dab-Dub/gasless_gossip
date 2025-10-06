import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
export declare class RedisHealthIndicator extends HealthIndicator {
    private client;
    constructor();
    isHealthy(key: string): Promise<HealthIndicatorResult>;
}
