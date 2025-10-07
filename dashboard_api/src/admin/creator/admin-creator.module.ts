import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { EvictionLog } from '../../rooms/entities/eviction-log.entity';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../../entities/transaction.entity';
import { Room } from '../../../entities/room.entity';
import { Participant } from '../../../entities/participant.entity';
import { AdminCreatorService } from './admin-creator.service';
import { AdminCreatorController } from './admin-creator.controller';
import { VoiceModerationQueueService } from '../../../rooms/services/voice-moderation-queue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorProfile,
      EvictionLog,
      User,
      Transaction,
      Room,
      Participant,
    ]),
  ],
  controllers: [AdminCreatorController],
  providers: [AdminCreatorService, VoiceModerationQueueService],
})
export class AdminCreatorModule {}


