import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './services/challenges.service';
import { Challenge } from './entities/challenge.entity';
import { ChallengeParticipation } from './entities/challenge-participation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, ChallengeParticipation]),
    ConfigModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
