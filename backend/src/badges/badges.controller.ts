import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { AssignBadgeDto } from './dto/assign-badge.dto';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get(':userId')
  async getBadges(@Param('userId') userId: number) {
    return this.badgesService.getBadgesByUser(userId);
  }

  @Post('assign')
  async assignBadge(@Body() dto: AssignBadgeDto) {
    return this.badgesService.assignBadge(dto);
  }
}
