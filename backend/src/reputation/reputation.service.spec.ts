import { Test, TestingModule } from '@nestjs/testing';
import { ReputationService } from './reputation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reputation } from './entities/reputation.entity';
import { Tip } from '../tips/entities/tip.entity';
import { Message } from '../messages/message.entity';

describe('ReputationService', () => {
  let service: ReputationService;
  let reputationRepo: any;
  let tipRepo: any;
  let messageRepo: any;

  beforeEach(async () => {
    reputationRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    tipRepo = { find: jest.fn() };
    messageRepo = { count: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReputationService,
        { provide: getRepositoryToken(Reputation), useValue: reputationRepo },
        { provide: getRepositoryToken(Tip), useValue: tipRepo },
        { provide: getRepositoryToken(Message), useValue: messageRepo },
      ],
    }).compile();

    service = module.get<ReputationService>(ReputationService);
  });

  it('gets reputation for existing user', async () => {
    const reputation = { id: 1, userId: 1, score: 10 };
    reputationRepo.findOne.mockResolvedValue(reputation);
    const result = await service.getReputation(1);
    expect(result).toEqual(reputation);
  });

  it('creates reputation for new user', async () => {
    reputationRepo.findOne.mockResolvedValue(null);
    reputationRepo.create.mockReturnValue({ userId: 1, score: 0 });
    reputationRepo.save.mockResolvedValue({ id: 1, userId: 1, score: 0 });
    const result = await service.getReputation(1);
    expect(result).toEqual({ id: 1, userId: 1, score: 0 });
  });

  it('updates reputation score', async () => {
    const reputation = { id: 1, userId: 1, score: 10 };
    reputationRepo.findOne.mockResolvedValue(reputation);
    reputationRepo.save.mockResolvedValue({ ...reputation, score: 15 });
    const result = await service.updateReputation({ userId: 1, scoreChange: 5 });
    expect(result.score).toBe(15);
  });

  it('calculates reputation from actions', async () => {
    reputationRepo.findOne.mockResolvedValue({ id: 1, userId: 1, score: 0 });
    tipRepo.find.mockResolvedValue([
      { amount: '10.5' },
      { amount: '5.0' },
    ]);
    messageRepo.count.mockResolvedValue(20);
    reputationRepo.save.mockResolvedValue({ id: 1, userId: 1, score: 17.0 });
    const result = await service.calculateReputationFromActions(1);
    expect(result.score).toBe(17.0); // 10.5 + 5.0 + 20 * 0.1 = 17.0
  });
});