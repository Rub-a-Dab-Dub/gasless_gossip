import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SocialSharingService } from './social-sharing.service';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareQueryDto } from './dto/share-query.dto';
import { ShareResponseDto } from './dto/create-share.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Social Sharing')
@Controller('shares')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SocialSharingController {
  constructor(private readonly socialSharingService: SocialSharingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new share' })
  @ApiResponse({
    status: 201,
    description: 'Share created successfully',
    type: ShareResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid share data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createShare(
    @Body() createShareDto: CreateShareDto,
    @GetUser() user: User,
  ): Promise<ShareResponseDto> {
    return this.socialSharingService.createShare(createShareDto, user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get shares by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User shares retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getSharesByUser(
    @Param('userId') userId: string,
    @Query() query: ShareQueryDto,
  ): Promise<{ shares: ShareResponseDto[]; total: number }> {
    return this.socialSharingService.getSharesByUser(userId, query);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user shares' })
  @ApiResponse({
    status: 200,
    description: 'User shares retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMyShares(
    @GetUser() user: User,
    @Query() query: ShareQueryDto,
  ): Promise<{ shares: ShareResponseDto[]; total: number }> {
    return this.socialSharingService.getSharesByUser(user.id, query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shares with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Shares retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'contentType', required: false, description: 'Filter by content type' })
  @ApiQuery({ name: 'platform', required: false, description: 'Filter by platform' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (ISO string)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results to return (max 100)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of results to skip' })
  async getAllShares(
    @Query() query: ShareQueryDto,
  ): Promise<{ shares: ShareResponseDto[]; total: number }> {
    return this.socialSharingService.getAllShares(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get share by ID' })
  @ApiResponse({
    status: 200,
    description: 'Share retrieved successfully',
    type: ShareResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Share not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getShareById(@Param('id') id: string): Promise<ShareResponseDto> {
    return this.socialSharingService.getShareById(id);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get overall sharing statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getShareStats(): Promise<{
    totalShares: number;
    totalXpAwarded: number;
    platformBreakdown: Record<string, number>;
    contentTypeBreakdown: Record<string, number>;
  }> {
    return this.socialSharingService.getShareStats();
  }

  @Get('stats/my')
  @ApiOperation({ summary: 'Get current user sharing statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMyShareStats(
    @GetUser() user: User,
  ): Promise<{
    totalShares: number;
    totalXpAwarded: number;
    platformBreakdown: Record<string, number>;
    contentTypeBreakdown: Record<string, number>;
  }> {
    return this.socialSharingService.getShareStats(user.id);
  }

  @Post('mock/:contentType')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate mock share content for testing' })
  @ApiResponse({
    status: 201,
    description: 'Mock share content generated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async generateMockShare(
    @Param('contentType') contentType: string,
    @GetUser() user: User,
  ): Promise<{
    shareText: string;
    metadata: Record<string, any>;
    suggestedPlatforms: string[];
  }> {
    const mockContent = await this.socialSharingService.generateMockShareContent(
      contentType as any,
      user.id,
    );

    return {
      ...mockContent,
      suggestedPlatforms: ['x', 'facebook', 'linkedin', 'discord'],
    };
  }
}
