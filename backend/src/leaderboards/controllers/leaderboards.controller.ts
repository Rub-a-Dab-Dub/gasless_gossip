import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardsService, LeaderboardEntry, LeaderboardStats } from '../services/leaderboards.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('leaderboards')
@Controller('leaderboards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get cached leaderboard of top users by XP',
    description: 'Returns the top users by total XP with Redis caching for improved performance'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of users to return (default: 10, max: 100)',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leaderboard retrieved successfully from cache or database',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'User ID' },
          username: { type: 'string', description: 'Username' },
          level: { type: 'number', description: 'User level' },
          totalXp: { type: 'number', description: 'Total XP earned' },
          currentXp: { type: 'number', description: 'Current level XP' },
          rank: { type: 'number', description: 'User rank in leaderboard' },
        },
      },
    },
  })
  async getLeaderboard(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<LeaderboardEntry[]> {
    const safeLimit = Math.min(limit || 10, 100); // Cap at 100 users
    return this.leaderboardsService.getLeaderboard(safeLimit);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get cached leaderboard statistics',
    description: 'Returns overall leaderboard statistics with Redis caching'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leaderboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', description: 'Total number of users' },
        averageXp: { type: 'number', description: 'Average XP across all users' },
        topLevel: { type: 'number', description: 'Highest level achieved' },
        lastUpdated: { type: 'string', format: 'date-time', description: 'Last cache update time' },
      },
    },
  })
  async getLeaderboardStats(): Promise<LeaderboardStats> {
    return this.leaderboardsService.getLeaderboardStats();
  }

  @Get('user/:userId/rank')
  @ApiOperation({ 
    summary: 'Get cached user rank by XP',
    description: 'Returns the rank of a specific user in the XP leaderboard with Redis caching'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User rank retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        rank: { type: 'number', description: 'User rank (0 if not found)' },
      },
    },
  })
  async getUserRank(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ userId: string; rank: number }> {
    const rank = await this.leaderboardsService.getUserRank(userId);
    return { userId, rank };
  }

  @Get('cache/stats')
  @ApiOperation({ 
    summary: 'Get cache performance statistics',
    description: 'Returns cache hit/miss statistics for monitoring performance'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cache statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        leaderboardHits: { type: 'number', description: 'Number of leaderboard cache hits' },
        leaderboardMisses: { type: 'number', description: 'Number of leaderboard cache misses' },
        userRankHits: { type: 'number', description: 'Number of user rank cache hits' },
        userRankMisses: { type: 'number', description: 'Number of user rank cache misses' },
        statsHits: { type: 'number', description: 'Number of stats cache hits' },
        statsMisses: { type: 'number', description: 'Number of stats cache misses' },
      },
    },
  })
  async getCacheStats() {
    return this.leaderboardsService.getCacheStats();
  }

  @Get('cache/invalidate')
  @ApiOperation({ 
    summary: 'Invalidate all leaderboard cache',
    description: 'Manually invalidate all leaderboard cache entries (admin endpoint)'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cache invalidated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Success message' },
      },
    },
  })
  async invalidateCache() {
    await this.leaderboardsService.invalidateLeaderboardCache();
    return { message: 'Leaderboard cache invalidated successfully' };
  }
}
