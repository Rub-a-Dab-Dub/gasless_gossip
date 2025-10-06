import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceMetricsController } from './finance-metrics.controller';
import { FinanceMetricsService } from './finance-metrics.service';
import { DailyAggregate } from './entities/daily-aggregate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyAggregate])],
  controllers: [FinanceMetricsController],
  providers: [FinanceMetricsService],
  exports: [FinanceMetricsService],
})
export class FinanceMetricsModule {}