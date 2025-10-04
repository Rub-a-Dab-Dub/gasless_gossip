import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SecretRoom } from './entities/secret-room.entity';
import { RoomInvitation } from './entities/room-invitation.entity';
import { RoomMember } from './entities/room-member.entity';
import { SecretRoomsService } from './services/secret-rooms.service';
import { SecretRoomSchedulerService } from './services/secret-room-scheduler.service';
import { FakeNameGeneratorService } from './services/fake-name-generator.service';
import { VoiceModerationQueueService } from './services/voice-moderation-queue.service';
import { SecretRoomsController } from './secret-rooms.controller';
import { SecretRoomsGateway } from './gateways/secret-rooms.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PseudonymsModule } from '../pseudonyms/pseudonyms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecretRoom, RoomInvitation, RoomMember]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PseudonymsModule,
    ConfigModule,
  ],
  controllers: [SecretRoomsController],
  providers: [
    SecretRoomsService,
    SecretRoomSchedulerService,
    FakeNameGeneratorService,
    VoiceModerationQueueService,
    SecretRoomsGateway,
  ],
  exports: [
    SecretRoomsService,
    SecretRoomSchedulerService,
    FakeNameGeneratorService,
    VoiceModerationQueueService,
    SecretRoomsGateway,
  ],
})
export class SecretRoomsModule {}
