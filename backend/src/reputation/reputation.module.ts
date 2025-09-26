import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reputation } from './entities/reputation.entity';
import { ReputationService } from './reputation.service';
import { ReputationController } from './reputation.controller';
import { Tip } from '../tips/entities/tip.entity';
import { Message } from '../messages/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reputation, Tip, Message])],
  providers: [ReputationService],
  controllers: [ReputationController],
  exports: [ReputationService],
})
export class ReputationModule {}