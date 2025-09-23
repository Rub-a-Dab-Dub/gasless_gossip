import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardVote } from './reward-vote.entity';
import { RewardVotingService } from './reward-voting.service';
import { RewardVotingController } from './reward-voting.controller';
import { StellarVotingService } from '../dao-voting/stellar-voting.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardVote])],
  controllers: [RewardVotingController],
  providers: [RewardVotingService, StellarVotingService],
  exports: [RewardVotingService],
})
export class RewardVotingModule {}


