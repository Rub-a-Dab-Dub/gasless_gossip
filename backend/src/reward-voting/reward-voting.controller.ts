import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RewardVotingService } from './reward-voting.service';
import { CastRewardVoteDto, RewardsResultsQueryDto } from './reward-voting.dto';

@Controller('rewards')
export class RewardVotingController {
  constructor(private readonly service: RewardVotingService) {}

  @Post('vote')
  async vote(@Body() body: CastRewardVoteDto) {
    const v = await this.service.castVote(body);
    return {
      id: v.id,
      rewardId: v.rewardId,
      userId: v.userId,
      voteWeight: Number(v.voteWeight),
      stellarTxHash: v.stellarTxHash,
    };
  }

  @Get('results')
  async results(@Query() query: RewardsResultsQueryDto) {
    return await this.service.getResults(query.rewardId);
  }
}


