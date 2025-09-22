import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { AwardAchievementDto, CheckMilestoneDto, AchievementResponseDto } from './dto';
import { Achievement } from './entities/achievement.entity';

@ApiTags('achievements')
@Controller('achievements')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get all achievements for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of user achievements',
    type: [AchievementResponseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserAchievements(@Param('userId') userId: string): Promise<Achievement[]> {
    return this.achievementsService.getUserAchievements(userId);
  }

  @Post('award')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Award an achievement to a user' })
  @ApiResponse({
    status: 201,
    description: 'Achievement awarded successfully',
    type: AchievementResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - achievement already exists or invalid data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async awardAchievement(@Body() awardDto: AwardAchievementDto): Promise<Achievement> {
    return this.achievementsService.awardAchievement(awardDto);
  }

  @Post('check-milestones')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check and award milestones for a user' })
  @ApiResponse({
    status: 200,
    description: 'Milestones checked and new achievements awarded',
    type: [AchievementResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
  async checkAndAwardMilestones(@Body() checkDto: CheckMilestoneDto): Promise<Achievement[]> {
    return this.achievementsService.checkAndAwardMilestones(checkDto);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get achievement statistics for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User achievement statistics',
    schema: {
      type: 'object',
      properties: {
        totalAchievements: { type: 'number' },
        totalRewards: { type: 'number' },
        achievementsByType: { type: 'object' },
        achievementsByTier: { type: 'object' },
      },
    },
  })
  async getUserAchievementStats(@Param('userId') userId: string) {
    return this.achievementsService.getUserAchievementStats(userId);
  }

  @Get('types/available')
  @ApiOperation({ summary: 'Get all available achievement types and their thresholds' })
  @ApiResponse({
    status: 200,
    description: 'Available achievement types and thresholds',
    type: 'object',
  })
  getAchievementTypes() {
    return this.achievementsService.getAchievementTypes();
  }
}
