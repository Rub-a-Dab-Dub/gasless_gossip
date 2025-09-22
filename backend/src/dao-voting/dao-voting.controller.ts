import { Controller, Post, Get, Body, Param, Query, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { DaoVotingService } from './dao-voting.service';
import { CreateVoteDto, VotingResultDto } from './dao-voting.dto';
import { Vote } from './vote.entity';

@Controller('dao')
export class DaoVotingController {
  constructor(private readonly daoVotingService: DaoVotingService) {}

  @Post('vote')
  @HttpCode(HttpStatus.CREATED)
  async castVote(@Body(ValidationPipe) createVoteDto: CreateVoteDto): Promise<Vote> {
    return await this.daoVotingService.castVote(createVoteDto);
  }

  @Get('results/:proposalId')
  async getVotingResults(@Param('proposalId') proposalId: string): Promise<VotingResultDto> {
    return await this.daoVotingService.getVotingResults(proposalId);
  }

  @Get('votes/user/:userId')
  async getUserVotes(@Param('userId') userId: string): Promise<Vote[]> {
    return await this.daoVotingService.getVotesByUser(userId);
  }

  @Get('vote/:voteId/validate')
  async validateVote(@Param('voteId') voteId: string): Promise<{ valid: boolean }> {
    const isValid = await this.daoVotingService.validateVote(voteId);
    return { valid: isValid };
  }
}
