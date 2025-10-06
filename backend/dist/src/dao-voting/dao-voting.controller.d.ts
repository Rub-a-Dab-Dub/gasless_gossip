import { DaoVotingService } from './dao-voting.service';
import { CreateVoteDto, VotingResultDto } from './dao-voting.dto';
import { Vote } from './vote.entity';
export declare class DaoVotingController {
    private readonly daoVotingService;
    constructor(daoVotingService: DaoVotingService);
    castVote(createVoteDto: CreateVoteDto): Promise<Vote>;
    getVotingResults(proposalId: string): Promise<VotingResultDto>;
    getUserVotes(userId: string): Promise<Vote[]>;
    validateVote(voteId: string): Promise<{
        valid: boolean;
    }>;
}
