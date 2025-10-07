import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { RewardConfig } from './entities/reward-config.entity';
import { RewardExecution } from './entities/reward-execution.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardConfig, RewardExecution]),
    ScheduleModule.forRoot(),
    BlockchainModule,
    LeaderboardModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}