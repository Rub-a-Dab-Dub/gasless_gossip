import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { Achievement } from './entities/achievement.entity';
import { User } from '../users/entities/user.entity';
import { StellarService } from '../stellar/stellar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, User])],
  controllers: [AchievementsController],
  providers: [AchievementsService, StellarService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
