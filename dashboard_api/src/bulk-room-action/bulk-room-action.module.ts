import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BulkRoomActionController } from "./bulk-room-action.controller"
import { BulkRoomActionService } from "./bulk-room-action.service"
import { BulkAction } from "./entities/bulk-action.entity"
import { RoomActionResult } from "./entities/room-action-result.entity"
import { BulkActionNotification } from "./entities/bulk-action-notification.entity"

@Module({
  imports: [TypeOrmModule.forFeature([BulkAction, RoomActionResult, BulkActionNotification])],
  controllers: [BulkRoomActionController],
  providers: [BulkRoomActionService],
  exports: [BulkRoomActionService],
})
export class BulkRoomActionModule {}
