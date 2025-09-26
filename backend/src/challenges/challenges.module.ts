import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Challenge } from './entities/challenge.entity';
import { ChallengeProgress } from './entities/challenge-progress.entity';

import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, ChallengeProgress]),
    forwardRef(() => UsersModule),   
    forwardRef(() => AuthModule),    
    StellarModule,                   
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
