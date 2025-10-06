import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { CreateVoteDto, VotingResultDto } from './dao-voting.dto';
import { StellarVotingService } from './stellar-voting.service';
export declare class DaoVotingService {
    private voteRepository;
    private stellarVotingService;
    private readonly logger;
    constructor(voteRepository: Repository<Vote>, stellarVotingService: StellarVotingService);
    castVote(createVoteDto: CreateVoteDto): Promise<Vote>;
    getVotingResults(proposalId: string): Promise<VotingResultDto>;
    validateVote(voteId: string): Promise<boolean>;
    getVotesByUser(userId: string): Promise<Vote[]>;
}
