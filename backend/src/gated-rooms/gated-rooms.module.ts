import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatedRoomsController } from './gated-rooms.controller';
import { GatedRoomsService } from './gated-rooms.service';
import { GatedRoom } from './entities/gated-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GatedRoom])],
  controllers: [GatedRoomsController],
  providers: [GatedRoomsService],
  exports: [GatedRoomsService],
})
export class GatedRoomsModule {}