import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(dto);
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.findByUser(userId);
  }
}
