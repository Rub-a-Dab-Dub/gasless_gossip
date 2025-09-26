import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { Visit } from "./entities/visit.entity"
import { User } from "../users/entities/user.entity"
import { VisitsService } from "./services/visits.service"
import { VisitsController } from "./controllers/visits.controller"
import { VisitAnalyticsListener } from "./listeners/visit-analytics.listener"
import { VisitSampleDataService } from "./test/sample-data.service"

@Module({
  imports: [TypeOrmModule.forFeature([Visit, User]), EventEmitterModule],
  controllers: [VisitsController],
  providers: [VisitsService, VisitAnalyticsListener, VisitSampleDataService],
  exports: [VisitsService, VisitSampleDataService],
})
export class VisitsModule {}
