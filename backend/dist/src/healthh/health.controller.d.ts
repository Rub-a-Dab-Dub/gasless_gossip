import { HealthCheckService, TypeOrmHealthIndicator, HealthCheckResult } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
import { Repository } from 'typeorm';
import { UptimeLog } from '../entities/uptime-log.entity';
export declare class HealthController {
    private health;
    private db;
    private redis;
    private uptimeRepo;
    constructor(health: HealthCheckService, db: TypeOrmHealthIndicator, redis: RedisHealthIndicator, uptimeRepo: Repository<UptimeLog>);
    check(): Promise<HealthCheckResult>;
}
