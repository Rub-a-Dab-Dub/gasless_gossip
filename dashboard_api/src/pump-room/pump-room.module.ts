import { Module } from "@nestjs/common"
import { PumpRoomController } from "./pump-room.controller"
import { PumpRoomService } from "./pump-room.service"

@Module({
  controllers: [PumpRoomController],
  providers: [PumpRoomService],
  exports: [PumpRoomService],
})
export class PumpRoomModule {}
