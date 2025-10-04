import { Controller, Post, Body, Req } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly logger: LoggerService) {}

  @Post('action')
  async performAction(@Body() data: any, @Req() req: any) {
    try {
      // Log admin action
      this.logger.logAdminAction(
        'user_created',
        req.user.id,
        { userId: data.userId },
      );

      // Your business logic here
      return { success: true };
    } catch (error) {
      // Log error with alert flag
      this.logger.error(
        'Failed to perform admin action',
        error.stack,
        'AdminController',
      );
      throw error;
    }
  }
}