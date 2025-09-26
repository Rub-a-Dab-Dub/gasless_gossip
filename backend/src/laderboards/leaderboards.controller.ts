import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';
import { LeaderboardResponseDto } from './dto/leaderboard-response.dto';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { RankType } from './entities/leaderboard.entity';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get(':type')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getLeaderboard(
    @Param('type') type: RankType,
    @Query() query: Omit<LeaderboardQueryDto, 'type'>,
  ): Promise<LeaderboardResponseDto> {
    const leaderboardQuery: LeaderboardQueryDto = {
      type,
      ...query,
    };
    return this.leaderboardsService.getLeaderboard(leaderboardQuery);
  }

  @Get('user/:userId/rank/:type')
  async getUserRank(
    @Param('userId') userId: string,
    @Param('type') type: RankType,
  ) {
    const rank = await this.leaderboardsService.getUserRank(userId, type);
    return {
      userId,
      type,
      ...rank,
    };
  }

  @Get('top/:type')
  async getTopUsers(
    @Param('type') type: RankType,
    @Query('limit') limit?: number,
  ) {
    return this.leaderboardsService.getTopUsers(type, limit);
  }

  @Post('score')
  @HttpCode(HttpStatus.CREATED)
  async updateUserScore(@Body() createLeaderboardDto: CreateLeaderboardDto) {
    return this.leaderboardsService.updateUserScore(createLeaderboardDto);
  }

  @Post('generate-sample-data')
  @HttpCode(HttpStatus.CREATED)
  async generateSampleData() {
    await this.leaderboardsService.generateSampleData();
    return { message: 'Sample data generated successfully' };
  }
}

