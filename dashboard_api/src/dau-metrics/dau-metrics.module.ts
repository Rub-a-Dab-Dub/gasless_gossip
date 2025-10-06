import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DauMetricsController } from "./dau-metrics.controller"
import { DauMetricsService } from "./dau-metrics.service"
import { DauMetric } from "./entities/dau-metric.entity"
import { DauAlert } from "./entities/dau-alert.entity"
import { FeatureUsage } from "./entities/feature-usage.entity"
import { DauMetricsGateway } from "./dau-metrics.gateway"

@Module({
  imports: [TypeOrmModule.forFeature([DauMetric, DauAlert, FeatureUsage])],
  controllers: [DauMetricsController],
  providers: [DauMetricsService, DauMetricsGateway],
  exports: [DauMetricsService],
})
export class DauMetricsModule {}
