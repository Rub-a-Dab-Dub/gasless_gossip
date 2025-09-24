import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto, CreateAnalyticDto, AnalyticsResponseDto } from './analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analytics record' })
  @ApiResponse({ status: 201, description: 'Analytics record created successfully' })
  async createAnalytic(@Body(ValidationPipe) createAnalyticDto: CreateAnalyticDto) {
    return this.analyticsService.createAnalytic(createAnalyticDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get analytics for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User analytics retrieved successfully', type: AnalyticsResponseDto })
  async getUserAnalytics(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query(ValidationPipe) query: AnalyticsQueryDto
  ): Promise<AnalyticsResponseDto> {
    return this.analyticsService.getUserAnalytics(userId, query);
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get analytics for a specific room' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room analytics retrieved successfully', type: AnalyticsResponseDto })
  async getRoomAnalytics(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query(ValidationPipe) query: AnalyticsQueryDto
  ): Promise<AnalyticsResponseDto> {
    return this.analyticsService.getRoomAnalytics(roomId, query);
  }

  // Convenience endpoints for common tracking operations
  @Post('track/visit')
  @ApiOperation({ summary: 'Track a visit' })
  async trackVisit(@Body() body: { userId: string; roomId?: string; metadata?: Record<string, any> }) {
    return this.analyticsService.trackVisit(body.userId, body.roomId, body.metadata);
  }

  @Post('track/tip')
  @ApiOperation({ summary: 'Track a tip' })
  async trackTip(@Body() body: { userId: string; amount: number; roomId?: string; metadata?: Record<string, any> }) {
    return this.analyticsService.trackTip(body.userId, body.amount, body.roomId, body.metadata);
  }

  @Post('track/reaction')
  @ApiOperation({ summary: 'Track a reaction' })
  async trackReaction(@Body() body: { userId: string; roomId?: string; reactionType?: string }) {
    return this.analyticsService.trackReaction(body.userId, body.roomId, body.reactionType);
  }
}
