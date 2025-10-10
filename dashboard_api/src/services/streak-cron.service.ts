import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StreakService } from './streak.service';

@Injectable()
export class StreakCronService {
  private readonly logger = new Logger(StreakCronService.name);

  constructor(private readonly streakService: StreakService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyStreakCheck() {
    this.logger.log('Running daily streak check...');
    try {
      await this.streakService.checkAndResetInactiveStreaks();
      this.logger.log('Daily streak check completed successfully');
    } catch (error) {
      this.logger.error('Error during daily streak check:', error);
    }
  }
}