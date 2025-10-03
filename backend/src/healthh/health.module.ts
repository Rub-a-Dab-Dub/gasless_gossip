import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from '../controllers/health.controller';
import { RedisHealthIndicator } from './redis.health';
import { UptimeLoggerService } from './uptime-logger.service';
import { UptimeLog } from '../entities/uptime-log.entity';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forFeature([UptimeLog]),
    ScheduleModule.forRoot()
  ],
  controllers: [HealthController],
  providers: [RedisHealthIndicator, UptimeLoggerService],
})
export class HealthModule {}
