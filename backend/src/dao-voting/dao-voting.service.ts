import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { CreateVoteDto, VotingResultDto, VoteDetailDto } from './dao-voting.dto';
import { StellarVotingService } from './stellar-voting.service';

@Injectable()
export class DaoVotingService {
  private readonly logger = new Logger(DaoVotingService.name);

  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    private stellarVotingService: StellarVotingService,
  ) {}

  async castVote(createVoteDto: CreateVoteDto): Promise<Vote> {
    const { proposalId, userId, choice, weight, stellarAccountId } = createVoteDto;

    // Check if user already voted on this proposal
    const existingVote = await this.voteRepository.findOne({
      where: { proposalId, userId }
    });

    if (existingVote) {
      throw new ConflictException('User has already voted on this proposal');
    }

    // Validate weight against Stellar account balance
    const accountBalance = await this.stellarVotingService.getAccountBalance(stellarAccountId);
    if (weight > accountBalance) {
      throw new BadRequestException('Vote weight exceeds account balance');
    }

    // Record vote on Stellar blockchain
    const stellarTransactionHash = await this.stellarVotingService.recordVoteOnStellar(
      stellarAccountId,
      proposalId,
      choice,
      weight
    );

    // Create and save vote record
    const vote = this.voteRepository.create({
      proposalId,
      userId,
      choice,
      weight,
      stellarTransactionHash,
      stellarAccountId,
    });

    const savedVote = await this.voteRepository.save(vote);
    this.logger.log(`Vote recorded: ${savedVote.id} for proposal ${proposalId}`);

    return savedVote;
  }

  async getVotingResults(proposalId: string): Promise<VotingResultDto> {
    const votes = await this.voteRepository.find({
      where: { proposalId },
      order: { createdAt: 'DESC' }
    });

    if (votes.length === 0) {
      throw new NotFoundException('No votes found for this proposal');
    }

    // Calculate voting statistics
    const totalVotes = votes.length;
    const totalWeight = votes.reduce((sum, vote) => sum + Number(vote.weight), 0);
    
    const yesVotes = votes.filter(v => v.choice === 'yes').length;
    const noVotes = votes.filter(v => v.choice === 'no').length;
    const abstainVotes = votes.filter(v => v.choice === 'abstain').length;
    
    const yesWeight = votes
      .filter(v => v.choice === 'yes')
      .reduce((sum, vote) => sum + Number(vote.weight), 0);
    
    const noWeight = votes
      .filter(v => v.choice === 'no')
      .reduce((sum, vote) => sum + Number(vote.weight), 0);
    
    const abstainWeight = votes
      .filter(v => v.choice === 'abstain')
      .reduce((sum, vote) => sum + Number(vote.weight), 0);

    const participationRate = totalVotes > 0 ? (totalVotes / 1000) * 100 : 0; // Assuming 1000 eligible voters
    const weightedApprovalRate = totalWeight > 0 ? (yesWeight / totalWeight) * 100 : 0;

    const voteDetails: VoteDetailDto[] = votes.map(vote => ({
      id: vote.id,
      userId: vote.userId,
      choice: vote.choice,
      weight: Number(vote.weight),
      stellarTransactionHash: vote.stellarTransactionHash,
      createdAt: vote.createdAt,
    }));

    return {
      proposalId,
      totalVotes,
      totalWeight,
      yesVotes,
      noVotes,
      abstainVotes,
      yesWeight,
      noWeight,
      abstainWeight,
      participationRate,
      weightedApprovalRate,
      votes: voteDetails,
    };
  }

  async validateVote(voteId: string): Promise<boolean> {
    const vote = await this.voteRepository.findOne({ where: { id: voteId } });
    if (!vote) {
      return false;
    }

    return await this.stellarVotingService.validateStellarTransaction(vote.stellarTransactionHash);
  }

  async getVotesByUser(userId: string): Promise<Vote[]> {
    return await this.voteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
}