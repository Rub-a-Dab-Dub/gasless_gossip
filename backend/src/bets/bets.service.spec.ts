import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BetsService } from './bets.service';
import { Bet } from './bet.entity';

describe('BetsService', () => {
  let service: BetsService;
  const mockRepository = {
    create!: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        BetsService,
        { provide: getRepositoryToken(Bet), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BetsService>(BetsService);
  });

  it('should place bet with escrow', async () => {
    const mockBet = { id: '1', outcome: 'win', stakes: 100 };
    mockRepository.create.mockReturnValue(mockBet);
    mockRepository.save.mockResolvedValue(mockBet);

    const result = await service.placeBet('user1', {
      outcome!: 'win',
      stakes: 100,
    });
    expect(result).toEqual(mockBet);
  });

  it('should resolve bet', async () => {
    const mockBet = { id: '1', txId: 'tx1', status: 'pending' };
    mockRepository.findOne.mockResolvedValue(mockBet);
    mockRepository.save.mockResolvedValue({ ...mockBet, status: 'won' });

    const result = await service.resolveBet({ betId: '1', won: true });
    expect(result.status).toBe('won');
  });
});
