import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChallengesService } from './services/challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { ChallengeResponseDto, ChallengeParticipationResponseDto, ChallengeStatsDto } from './dto/challenge-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('challenges')
@Controller('challenges')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new challenge' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Challenge created successfully',
    type: ChallengeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid challenge data',
  })
  async createChallenge(
    @Request() req: any,
    @Body() createChallengeDto: CreateChallengeDto
  ): Promise<ChallengeResponseDto> {
    const createdBy = req.user.sub;
    return await this.challengesService.createChallenge(createChallengeDto, createdBy);
  }

  @Get()
  @ApiOperation({ summary: 'Get challenges' })
  @ApiQuery({ name: 'active', required: false, description: 'Filter active challenges only' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Challenges retrieved successfully',
    type: [ChallengeResponseDto],
  })
  async getChallenges(
    @Query('active') activeOnly?: string
  ): Promise<ChallengeResponseDto[]> {
    if (activeOnly === 'true') {
      return await this.challengesService.getActiveChallenges();
    }
    return await this.challengesService.getAllChallenges();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get challenge statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Challenge stats retrieved successfully',
    type: ChallengeStatsDto,
  })
  async getChallengeStats(): Promise<ChallengeStatsDto> {
    return await this.challengesService.getChallengeStats();
  }

  @Get('my-challenges')
  @ApiOperation({ summary: 'Get user challenges' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User challenges retrieved successfully',
  })
  async getUserChallenges(@Request() req: any) {
    const userId = req.user.sub;
    return await this.challengesService.getUserChallenges(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific challenge details' })
  @ApiParam({ name: 'id', description: 'Challenge ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Challenge details retrieved successfully',
    type: ChallengeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Challenge not found',
  })
  async getChallengeById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ChallengeResponseDto> {
    return await this.challengesService.getChallengeById(id);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a challenge' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully joined challenge',
    type: ChallengeParticipationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Challenge is no longer active or invalid data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User has already joined this challenge',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Challenge not found',
  })
  async joinChallenge(
    @Request() req: any,
    @Body() joinChallengeDto: JoinChallengeDto
  ): Promise<ChallengeParticipationResponseDto> {
    const userId = req.user.sub;
    return await this.challengesService.joinChallenge(userId, joinChallengeDto);
  }

  @Post('progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update challenge progress' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Progress updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid progress data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participation not found',
  })
  async updateProgress(
    @Request() req: any,
    @Body() progressUpdate: {
      challengeId: string;
      progress: number;
      progressData?: Record<string, any>;
    }
  ) {
    const userId = req.user.sub;
    return await this.challengesService.updateProgress({
      userId,
      challengeId: progressUpdate.challengeId,
      progress: progressUpdate.progress,
      progressData: progressUpdate.progressData
    });
  }
}
