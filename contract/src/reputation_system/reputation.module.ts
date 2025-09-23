import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, ReputationHistoryEntity]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [ReputationController],
  providers: [ReputationService, ReputationEventListener],
  exports: [ReputationService],
})
export class ReputationModule {}