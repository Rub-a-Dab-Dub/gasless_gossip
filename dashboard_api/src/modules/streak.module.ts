import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { StreakEntity } from '../entities/streak.entity';
import { StreakService } from '../services/streak.service';
import { StreakController } from '../controllers/streak.controller';
import { StreakCronService } from '../services/streak-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreakEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [StreakController],
  providers: [StreakService, StreakCronService],
  exports: [StreakService],
})
export class StreakModule {}