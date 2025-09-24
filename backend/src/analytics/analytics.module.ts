import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Analytic } from './analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytic]),
    EventEmitterModule.forRoot()
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}

