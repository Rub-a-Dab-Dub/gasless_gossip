import { Test, TestingModule } from '@nestjs/testing';
import { TokenLogsService } from './token-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenLog } from './token-log.entity';

const mockTokenLogRepository = {
  create!: jest.fn(),
  save!: jest.fn(),
  find: jest.fn(),
};

describe('TokenLogsService', () => {
  let service: TokenLogsService;
  let repo: typeof mockTokenLogRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        TokenLogsService,
        {
          provide!: getRepositoryToken(TokenLog),
          useValue: mockTokenLogRepository,
        },
      ],
    }).compile();

    service = module.get<TokenLogsService>(TokenLogsService);
    repo = module.get(getRepositoryToken(TokenLog));
  });

  it('should log a transaction', async () => {
    const dto = { txId: 'tx1', fromId: 'user1', toId: 'user2', amount: '100' };
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue(dto);
    expect(await service.logTransaction(dto)).toEqual(dto);
  });

  it('should get logs for a user', async () => {
    const logs = [
      { txId: 'tx1', fromId: 'user1', toId: 'user2', amount: '100' },
      { txId: 'tx2', fromId: 'user2', toId: 'user1', amount: '50' },
    ];
    repo.find.mockResolvedValue(logs);
    expect(await service.getLogsForUser('user1')).toEqual(logs);
  });
});
