import { RewardVotingService } from './reward-voting.service';
import { CastRewardVoteDto, RewardsResultsQueryDto } from './reward-voting.dto';
export declare class RewardVotingController {
    private readonly service;
    constructor(service: RewardVotingService);
    vote(body: CastRewardVoteDto): Promise<{
        id: string;
        rewardId: string;
        userId: string;
        voteWeight: number;
        stellarTxHash: string | undefined;
    }>;
    results(query: RewardsResultsQueryDto): Promise<import("./reward-voting.dto").RewardResultsDto>;
}
