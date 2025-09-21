import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ActivityLogsController } from "./controllers/activity-logs.controller"
import { ActivityLogsService } from "./services/activity-logs.service"
import { ActivityLog } from "./entities/activity-log.entity"
import { ActivityAnalyticsListener } from "./listeners/activity-analytics.listener"

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService, ActivityAnalyticsListener],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
