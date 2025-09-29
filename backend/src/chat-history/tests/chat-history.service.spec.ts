import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChatHistoryService } from '../services/chat-history.service';
import { ChatMessage } from '../entities/chat-message.entity';

describe('ChatHistoryService', () => {
  let service: ChatHistoryService;
  let mockRepository: any;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockRepository = {
      findAndCount: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatHistoryService,
        {
          provide: getRepositoryToken(ChatMessage),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ChatHistoryService>(ChatHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getChatHistory', () => {
    it('should return cached result when available', async () => {
      const query = {
        roomId: 'room-123',
        limit: 50,
        page: 1,
      };

      const cachedResult = {
        messages: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
        performance: { queryTimeMs: 10, cacheHit: true, indexUsed: true },
      };

      mockCacheManager.get.mockResolvedValue(cachedResult);

      const result = await service.getChatHistory(query);

      expect(result.performance.cacheHit).toBe(true);
      expect(mockRepository.findAndCount).not.toHaveBeenCalled();
    });

    it('should query database when cache miss', async () => {
      const query = {
        roomId: 'room-123',
        limit: 50,
        page: 1,
      };

      const mockMessages = [
        {
          id: 'msg-1',
          roomId: 'room-123',
          senderId: 'user-1',
          content: 'Hello',
          messageType: 'text',
          metadata: null,
          createdAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findAndCount.mockResolvedValue([mockMessages, 1]);

      const result = await service.getChatHistory(query);

      expect(result.messages).toHaveLength(1);
      expect(result.performance.cacheHit).toBe(false);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('createMessage', () => {
    it('should create and save message', async () => {
      const mockMessage = {
        id: 'msg-1',
        roomId: 'room-123',
        senderId: 'user-1',
        content: 'Hello',
        messageType: 'text',
        metadata: null,
        createdAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockMessage);
      mockRepository.save.mockResolvedValue(mockMessage);

      const result = await service.createMessage(
        'room-123',
        'user-1',
        'Hello',
        'text',
      );

      expect(result.content).toBe('Hello');
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('performanceTest', () => {
    it('should measure query performance', async () => {
      const mockMessages = Array.from({ length: 10000 }, (_, i) => ({
        id: `msg-${i}`,
        roomId: 'room-123',
        senderId: 'user-1',
        content: `Message ${i}`,
        messageType: 'text',
        metadata: null,
        createdAt: new Date(),
      }));

      mockRepository.find.mockResolvedValue(mockMessages);

      const result = await service.performanceTest('room-123', 10000);

      expect(result.messagesRetrieved).toBe(10000);
      expect(result.indexUsed).toBe(true);
      expect(result.queryTime).toBeGreaterThan(0);
    });
  });
});
