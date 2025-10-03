import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UptimeLog } from '../entities/uptime-log.entity';

@Controller('api/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
    @InjectRepository(UptimeLog) private uptimeRepo: Repository<UptimeLog>
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const result = await this.health.check([
      async (): Promise<HealthIndicatorResult> => this.db.pingCheck('db'),
      async (): Promise<HealthIndicatorResult> => this.redis.isHealthy('redis'),
    ]);

    return {
      status: result.status,
      db: result.info?.db?.status || 'down',
      redis: result.info?.redis?.status || 'down',
    };
  }
}
