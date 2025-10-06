import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GrowthAnalyticsController } from "./growth-analytics.controller"
import { GrowthAnalyticsService } from "./growth-analytics.service"
import { GrowthMetric } from "./entities/growth-metric.entity"
import { Cohort } from "./entities/cohort.entity"

@Module({
  imports: [TypeOrmModule.forFeature([GrowthMetric, Cohort])],
  controllers: [GrowthAnalyticsController],
  providers: [GrowthAnalyticsService],
  exports: [GrowthAnalyticsService],
})
export class GrowthAnalyticsModule {}
