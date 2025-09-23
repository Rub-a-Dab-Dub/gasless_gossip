import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardVote } from './reward-vote.entity';
import { CastRewardVoteDto, RewardResultsDto } from './reward-voting.dto';
import { StellarVotingService } from '../dao-voting/stellar-voting.service';

@Injectable()
export class RewardVotingService {
  constructor(
    @InjectRepository(RewardVote)
    private readonly voteRepo: Repository<RewardVote>,
    private readonly stellarVoting: StellarVotingService,
  ) {}

  async castVote(dto: CastRewardVoteDto): Promise<RewardVote> {
    const { rewardId, userId, voteWeight, stellarAccountId } = dto;

    const existing = await this.voteRepo.findOne({ where: { rewardId, userId } });
    if (existing) {
      throw new ConflictException('User has already voted for this reward');
    }

    if (voteWeight <= 0) {
      throw new BadRequestException('voteWeight must be positive');
    }

    let stellarTxHash: string | undefined;
    if (stellarAccountId) {
      // Record on Stellar (mock via StellarVotingService)
      stellarTxHash = await this.stellarVoting.recordVoteOnStellar(
        stellarAccountId,
        rewardId,
        'reward_vote',
        voteWeight,
      );
    }

    const vote = this.voteRepo.create({
      rewardId,
      userId,
      voteWeight: String(voteWeight),
      stellarAccountId,
      stellarTxHash,
    });
    return await this.voteRepo.save(vote);
  }

  async getResults(rewardId: string): Promise<RewardResultsDto> {
    const rows = await this.voteRepo.find({ where: { rewardId } });
    const votes = rows.map((r) => ({
      userId: r.userId,
      voteWeight: Number(r.voteWeight),
      stellarTxHash: r.stellarTxHash,
    }));
    const totalWeight = votes.reduce((sum, v) => sum + v.voteWeight, 0);
    return { rewardId, totalWeight, votes };
  }
}


