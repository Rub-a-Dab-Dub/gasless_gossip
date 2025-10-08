import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { StreakService } from '../services/streak.service';
import { CreateStreakDto, UpdateStreakDto } from '../dto/streak.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('streaks')
@Controller('streaks')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new streak' })
  async createStreak(@Body() createStreakDto: CreateStreakDto) {
    return this.streakService.create(createStreakDto);
  }

  @Put(':userId/update')
  @ApiOperation({ summary: 'Update user streak' })
  async updateStreak(@Param('userId') userId: string) {
    return this.streakService.updateStreak(userId);
  }

  @Put(':userId/reset')
  @ApiOperation({ summary: 'Reset user streak' })
  async resetStreak(@Param('userId') userId: string) {
    return this.streakService.resetStreak(userId);
  }

  @Put(':userId/boost')
  @ApiOperation({ summary: 'Apply multiplier boost to streak' })
  async applyBoost(
    @Param('userId') userId: string,
    @Query('multiplier') multiplier: number,
  ) {
    return this.streakService.applyBoost(userId, multiplier);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top streaks' })
  async getTopStreaks(@Query('limit') limit: number) {
    return this.streakService.getTopStreaks(limit);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user streak' })
  async getUserStreak(@Param('userId') userId: string) {
    return this.streakService.getUserStreak(userId);
  }
}