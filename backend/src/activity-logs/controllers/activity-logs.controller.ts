import { Controller, Get, Post, Param, Query, ParseUUIDPipe, Req, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import type { Request } from "express"
import type { ActivityLogsService } from "../services/activity-logs.service"
import type { CreateActivityLogDto } from "../dto/create-activity-log.dto"
import type { QueryActivityLogsDto } from "../dto/query-activity-logs.dto"
import { ActivityLogResponseDto } from "../dto/activity-log-response.dto"
import { ActivityStatsDto } from "../dto/activity-stats.dto"
import { ActivityAction } from "../entities/activity-log.entity"

@ApiTags("Activity Logs")
@Controller("activity")
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post("log")
  @ApiOperation({ summary: "Log a user activity" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Activity logged successfully",
    type: ActivityLogResponseDto,
  })
  async logActivity(createActivityLogDto: CreateActivityLogDto, @Req() req: Request): Promise<ActivityLogResponseDto> {
    // Automatically capture IP and user agent if not provided
    if (!createActivityLogDto.ipAddress) {
      createActivityLogDto.ipAddress = req.ip || req.connection.remoteAddress
    }
    if (!createActivityLogDto.userAgent) {
      createActivityLogDto.userAgent = req.get("User-Agent")
    }

    const activity = await this.activityLogsService.logActivity(createActivityLogDto)
    return activity
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get user activity history" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User activities retrieved successfully",
    type: [ActivityLogResponseDto],
  })
  async getUserActivities(@Param('userId', ParseUUIDPipe) userId: string, @Query() queryDto: QueryActivityLogsDto) {
    return this.activityLogsService.getUserActivities(userId, queryDto)
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get user activity statistics' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User activity statistics retrieved successfully',
    type: ActivityStatsDto,
  })
  async getUserActivityStats(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ActivityStatsDto> {
    return this.activityLogsService.getUserActivityStats(userId);
  }

  @Get('recent/:limit')
  @ApiOperation({ summary: 'Get recent activities across all users' })
  @ApiParam({ name: 'limit', description: 'Number of activities to retrieve' })
  @ApiResponse({
    status!: HttpStatus.OK,
    description!: 'Recent activities retrieved successfully',
    type: [ActivityLogResponseDto],
  })
  async getRecentActivities(@Param('limit') limit: string) {
    const limitNum = Number.parseInt(limit) || 50;
    return this.activityLogsService.getRecentActivities(limitNum);
  }

  @Get("action/:action")
  @ApiOperation({ summary: "Get activities by action type" })
  @ApiParam({ name: "action", enum: ActivityAction, description: "Activity action type" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Activities by action retrieved successfully",
    type: [ActivityLogResponseDto],
  })
  async getActivitiesByAction(@Param('action') action: ActivityAction, @Query('limit') limit?: string) {
    const limitNum = Number.parseInt(limit) || 50
    return this.activityLogsService.getActivitiesByAction(action, limitNum)
  }

  @Get("aggregates/summary")
  @ApiOperation({ summary: "Get activity aggregates and analytics" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Activity aggregates retrieved successfully",
  })
  async getActivityAggregates(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.activityLogsService.getActivityAggregates(start, end)
  }
}
