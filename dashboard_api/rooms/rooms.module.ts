import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './services/rooms.service';
import { RoomExpiryService } from './services/room-expiry.service';
import { RoomExportService } from './services/room-export.service';
import { RoomExpiryProcessor } from './processors/room-expiry.processor';
import { RoomEventsGateway } from './events/room-events.gateway';
import { ModeratorGuard } from './guards/moderator.guard';
import { Room } from './entities/room.entity';
import { Participant } from './entities/participant.entity';
import { Message } from './entities/message.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Participant, Message, Transaction]),
    BullModule.registerQueue({
      name: 'room-expiry',
    }),
  ],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    RoomExpiryService,
    RoomExportService,
    RoomExpiryProcessor,
    RoomEventsGateway,
    ModeratorGuard,
  ],
  exports: [RoomsService],
})
export class RoomsModule {}