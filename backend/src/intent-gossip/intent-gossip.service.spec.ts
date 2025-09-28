import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntentGossipService } from './intent-gossip.service';
import { IntentLog } from './entities/intent-log.entity';
import { BroadcastIntentDto } from './dto/broadcast-intent.dto';

describe('IntentGossipService', () => {
  let service: IntentGossipService;
  let intentLogRepository: Repository<IntentLog>;

  const mockIntentLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntentGossipService,
        {
          provide: getRepositoryToken(IntentLog),
          useValue: mockIntentLogRepository,
        },
      ],
    }).compile();

    service = module.get<IntentGossipService>(IntentGossipService);
    intentLogRepository = module.get<Repository<IntentLog>>(getRepositoryToken(IntentLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('broadcastIntent', () => {
    it('should broadcast intent and save to database', async () => {
      const userId = 'test-user-id';
      const broadcastIntentDto: BroadcastIntentDto = {
        type: 'chat_message',
        payload: { message: 'Hello World' },
        chains: ['base', 'stellar'],
      };

      const intentLog = {
        id: 'log-id',
        type: broadcastIntentDto.type,
        payload: broadcastIntentDto.payload,
        chains: broadcastIntentDto.chains,
        user: { id: userId },
        createdAt: new Date(),
      };

      mockIntentLogRepository.create.mockReturnValue(intentLog);
      mockIntentLogRepository.save.mockResolvedValue(intentLog);

      await service.broadcastIntent(userId, broadcastIntentDto);

      expect(intentLogRepository.create).toHaveBeenCalledWith({
        type: broadcastIntentDto.type,
        payload: broadcastIntentDto.payload,
        chains: broadcastIntentDto.chains,
        user: { id: userId },
      });
      expect(intentLogRepository.save).toHaveBeenCalledWith(intentLog);
    });
  });

  describe('getIntentLogsByUser', () => {
    it('should retrieve intent logs for a user', async () => {
      const userId = 'test-user-id';
      const intentLogs = [
        {
          id: 'log-1',
          type: 'chat_message',
          payload: { message: 'Hello' },
          chains: ['base'],
          user: { id: userId },
          createdAt: new Date(),
        },
      ];

      mockIntentLogRepository.find.mockResolvedValue(intentLogs);

      const result = await service.getIntentLogsByUser(userId);

      expect(intentLogRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual(intentLogs);
    });
  });
});