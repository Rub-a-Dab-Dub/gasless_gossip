import { Repository } from 'typeorm';
import { RewardVote } from './reward-vote.entity';
import { CastRewardVoteDto, RewardResultsDto } from './reward-voting.dto';
import { StellarVotingService } from '../dao-voting/stellar-voting.service';
export declare class RewardVotingService {
    private readonly voteRepo;
    private readonly stellarVoting;
    constructor(voteRepo: Repository<RewardVote>, stellarVoting: StellarVotingService);
    castVote(dto: CastRewardVoteDto): Promise<RewardVote>;
    getResults(rewardId: string): Promise<RewardResultsDto>;
}
