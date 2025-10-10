import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
// Base controllers and services
import { RoomsController } from './rooms.controller';
import { RoomsService } from './services/rooms.service';
import { RoomExpiryService } from './services/room-expiry.service';
import { RoomExportService } from './services/room-export.service';
import { RoomExpiryProcessor } from './processors/room-expiry.processor';
import { RoomEventsGateway } from './events/room-events.gateway';
import { ModeratorGuard } from './guards/moderator.guard';
// Enhanced Secret Rooms imports
import { SecretRoomsController } from './controllers/secret-rooms.controller';
import { FakeNameGeneratorService } from './services/fake-name-generator.service';
import { VoiceModerationQueueService } from './services/voice-moderation-queue.service';
import { RoomSchedulerService } from './services/room-scheduler.service';
import { SecretRoomsGateway } from './gateways/secret-rooms.gateway';
// Entities
import { Room } from '../entities/room.entity';
import { RoomAudit } from '../entities/room-audit.entity';
import { Participant } from '../entities/participant.entity';
import { Message } from '../entities/message.entity';
import { Transaction } from '../entities/transaction.entity';

// Import Room Audit components
import { RoomAuditController } from './controllers/room-audit.controller';
import { RoomAuditService } from './services/room-audit.service';
import { ExportService } from './services/export.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomAudit, Participant, Message, Transaction]),
    BullModule.registerQueue({
      name: 'room-expiry',
    }),
    // Enhanced Secret Rooms modules
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute per user
      },
    ]),
  ],
  controllers: [
    RoomsController,
    RoomAuditController,
    SecretRoomsController, // Enhanced secret rooms controller
  ],
  providers: [
    // Existing providers
    RoomsService,
    RoomAuditService,
    RoomExpiryService,
    RoomExportService,
    ExportService,
    RoomExpiryProcessor,
    RoomEventsGateway,
    ModeratorGuard,
    // Enhanced Secret Rooms providers
    FakeNameGeneratorService,
    VoiceModerationQueueService,
    RoomSchedulerService,
    SecretRoomsGateway,
  ],
  exports: [
    RoomsService,
    RoomAuditService,
    FakeNameGeneratorService,
    VoiceModerationQueueService,
    RoomSchedulerService,
  ],
})
export class RoomsModule {}
