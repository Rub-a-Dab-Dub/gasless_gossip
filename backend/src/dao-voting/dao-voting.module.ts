import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DaoVotingController } from './dao-voting.controller';
import { DaoVotingService } from './dao-voting.service';
import { StellarVotingService } from './stellar-voting.service';
import { Vote } from './vote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    ConfigModule,
  ],
  controllers: [DaoVotingController],
  providers: [DaoVotingService, StellarVotingService],
  exports: [DaoVotingService, StellarVotingService],
})
export class DaoVotingModule {}

