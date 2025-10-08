import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsOverviewController } from './analytics-overview.controller';
import { AnalyticsOverviewService } from './analytics-overview.service';
import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyticsSnapshot]),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: 'redis',
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        ttl: 60, // 1 minute cache
        max: 100,
      }),
    }),
    ScheduleModule.forRoot(), // For @Cron jobs
  ],
  controllers: [AnalyticsOverviewController],
  providers: [AnalyticsOverviewService],
  exports: [AnalyticsOverviewService],
})
export class AnalyticsOverviewModule {}