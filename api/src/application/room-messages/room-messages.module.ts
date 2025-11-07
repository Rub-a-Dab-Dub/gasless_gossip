import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMessage } from './entities/room-message.entity';
import { RoomMessagesService } from './room-messages.service';
import { RoomMessagesController } from './room-messages.controller';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomMessage, Room, User])],
  controllers: [RoomMessagesController],
  providers: [RoomMessagesService],
  exports: [RoomMessagesService],
})
export class RoomMessagesModule {}
