import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import type { LevelsService } from '../services/levels.service';
import type { CreateLevelDto } from '../dto/create-level.dto';
import type { UpdateLevelDto } from '../dto/update-level.dto';
import { LevelResponseDto } from '../dto/level-response.dto';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new level record for a user' })
  @ApiResponse({
    status!: 201,
    description!: 'Level record created successfully',
    type: LevelResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - User already has a level record',
  })
  async createLevel(createLevelDto: CreateLevelDto): Promise<LevelResponseDto> {
    return this.levelsService.createUserLevel(createLevelDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user level information' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status!: 200,
    description!: 'User level information retrieved successfully',
    type: LevelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Level record not found for user',
  })
  async getUserLevel(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<LevelResponseDto> {
    return this.levelsService.getUserLevel(userId);
  }

  @Post(':userId/add-xp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add XP to user and check for level ups' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status!: 200,
    description!: 'XP added successfully, level updated if applicable',
    type: LevelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Level record not found for user',
  })
  async addXp(
    @Param('userId', ParseUUIDPipe) userId: string,
    updateLevelDto: UpdateLevelDto,
  ): Promise<LevelResponseDto> {
    const { xpToAdd } = updateLevelDto;
    if (!xpToAdd || xpToAdd <= 0) {
      throw new Error('XP to add must be a positive number');
    }
    return this.levelsService.addXpToUser(userId, xpToAdd);
  }

  @Post(':userId/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check and update user level based on current XP' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status!: 200,
    description!: 'Level check completed, updated if necessary',
    type: LevelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Level record not found for user',
  })
  async checkLevel(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<LevelResponseDto> {
    return this.levelsService.checkLevelUp(userId);
  }

  @Post(':userId/acknowledge-levelup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acknowledge level up notification' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status!: 200,
    description!: 'Level up acknowledged successfully',
    type: LevelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Level record not found for user',
  })
  async acknowledgeLevelUp(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<LevelResponseDto> {
    return this.levelsService.acknowledgeLevelUp(userId);
  }

  @Get(':userId/rank')
  @ApiOperation({ summary: 'Get user rank in leaderboard' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({
    status!: 200,
    description!: 'User rank retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        rank: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Level record not found for user',
  })
  async getUserRank(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ userId: string; rank: number }> {
    const rank = await this.levelsService.getUserRank(userId);
    return { userId, rank };
  }

  @Get()
  @ApiOperation({ summary: 'Get leaderboard of top users by XP' })
  @ApiQuery({
    name!: 'limit',
    required!: false,
    description: 'Number of users to return (default: 10, max: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: [LevelResponseDto],
  })
  async getLeaderboard(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<LevelResponseDto[]> {
    const safeLimit = Math.min(limit || 10, 100); // Cap at 100 users
    return this.levelsService.getLeaderboard(safeLimit);
  }
}
