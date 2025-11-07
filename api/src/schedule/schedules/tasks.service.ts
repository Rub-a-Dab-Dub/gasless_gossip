import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../../application/users/users.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly usersService: UsersService) {}

  // Run every hour at minute 0
  @Cron('0 * * * *')
  async handleDeleteExpiredTokens() {
    this.logger.log('Starting cleanup of expired verification tokens...');
    try {
      await this.usersService.removeExpiredTokens();
      this.logger.log('Expired tokens cleanup completed');
    } catch (error) {
      this.logger.error('Error cleaning up expired tokens:', error);
    }
  }
}
