import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DaoVotingService } from './dao-voting.service';
import { StellarVotingService } from './stellar-voting.service';
import { Vote } from './vote.entity';
import { CreateVoteDto, VoteChoice } from './dao-voting.dto';

describe('DaoVotingService', () => {
  let service: DaoVotingService;
  let stellarService: StellarVotingService;
  let voteRepository: Repository<Vote>;

  const mockVoteRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockStellarService = {
    getAccountBalance: jest.fn(),
    recordVoteOnStellar: jest.fn(),
    validateStellarTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DaoVotingService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
        {
          provide: StellarVotingService,
          useValue: mockStellarService,
        },
      ],
    }).compile();

    service = module.get<DaoVotingService>(DaoVotingService);
    stellarService = module.get<StellarVotingService>(StellarVotingService);
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
  });

  describe('castVote', () => {
    const mockCreateVoteDto: CreateVoteDto = {
      proposalId: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      choice: VoteChoice.YES,
      weight: 100,
      stellarAccountId: 'GCKFBEIYTKP6RCZNVXPBKAC',
    };

    it('should successfully cast a vote', async () => {
      mockVoteRepository.findOne.mockResolvedValue(null);
      mockStellarService.getAccountBalance.mockResolvedValue(1000);
      mockStellarService.recordVoteOnStellar.mockResolvedValue('stellar_tx_123');
      
      const mockVote = { ...mockCreateVoteDto, id: 'vote-id', stellarTransactionHash: 'stellar_tx_123' };
      mockVoteRepository.create.mockReturnValue(mockVote);
      mockVoteRepository.save.mockResolvedValue(mockVote);

      const result = await service.castVote(mockCreateVoteDto);

      expect(result).toEqual(mockVote);
      expect(mockVoteRepository.findOne).toHaveBeenCalledWith({
        where: { proposalId: mockCreateVoteDto.proposalId, userId: mockCreateVoteDto.userId }
      });
    });

    it('should throw ConflictException if user already voted', async () => {
      mockVoteRepository.findOne.mockResolvedValue({ id: 'existing-vote' });

      await expect(service.castVote(mockCreateVoteDto)).rejects.toThrow('User has already voted on this proposal');
    });

    it('should throw BadRequestException if weight exceeds balance', async () => {
      mockVoteRepository.findOne.mockResolvedValue(null);
      mockStellarService.getAccountBalance.mockResolvedValue(50); // Less than vote weight

      await expect(service.castVote(mockCreateVoteDto)).rejects.toThrow('Vote weight exceeds account balance');
    });
  });

  describe('getVotingResults', () => {
    it('should return voting results', async () => {
      const mockVotes = [
        { choice: 'yes', weight: 100, userId: 'user1', stellarTransactionHash: 'tx1', createdAt: new Date() },
        { choice: 'no', weight: 50, userId: 'user2', stellarTransactionHash: 'tx2', createdAt: new Date() },
      ];
      mockVoteRepository.find.mockResolvedValue(mockVotes);

      const result = await service.getVotingResults('proposal-id');

      expect(result.totalVotes).toBe(2);
      expect(result.totalWeight).toBe(150);
      expect(result.yesVotes).toBe(1);
      expect(result.noVotes).toBe(1);
    });

    it('should throw NotFoundException if no votes found', async () => {
      mockVoteRepository.find.mockResolvedValue([]);

      await expect(service.getVotingResults('proposal-id')).rejects.toThrow('No votes found for this proposal');
    });
  });
});
