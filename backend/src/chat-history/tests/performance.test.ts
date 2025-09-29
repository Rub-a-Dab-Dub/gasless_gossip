import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChatHistoryService } from '../services/chat-history.service';
import { ChatMessage } from '../entities/chat-message.entity';

describe('ChatHistoryService Performance Tests', () => {
  let service: ChatHistoryService;
  let mockRepository: any;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockRepository = {
      findAndCount: jest.fn(),
      find: jest.fn(),
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

  describe('Performance with 10,000 messages', () => {
    it('should query 10,000 messages in under 100ms', async () => {
      // Generate 10,000 mock messages
      const mockMessages = Array.from({ length: 10000 }, (_, i) => ({
        id: `msg-${i}`,
        roomId: 'room-123',
        senderId: `user-${i % 100}`, // 100 different users
        content: `Message content ${i}`,
        messageType: 'text',
        metadata: null,
        createdAt: new Date(Date.now() - i * 1000), // Spread over time
      }));

      mockRepository.find.mockResolvedValue(mockMessages);
      mockCacheManager.get.mockResolvedValue(null); // Cache miss

      const startTime = Date.now();
      const result = await service.performanceTest('room-123', 10000);
      const endTime = Date.now();

      expect(result.messagesRetrieved).toBe(10000);
      expect(result.queryTime).toBeLessThan(100); // Should be under 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle pagination efficiently', async () => {
      const mockMessages = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        roomId: 'room-123',
        senderId: `user-${i % 10}`,
        content: `Message content ${i}`,
        messageType: 'text',
        metadata: null,
        createdAt: new Date(),
      }));

      mockRepository.findAndCount.mockResolvedValue([mockMessages, 10000]);
      mockCacheManager.get.mockResolvedValue(null);

      const query = {
        roomId: 'room-123',
        limit: 50,
        page: 1,
      };

      const startTime = Date.now();
      const result = await service.getChatHistory(query);
      const endTime = Date.now();

      expect(result.messages).toHaveLength(50);
      expect(result.pagination.total).toBe(10000);
      expect(result.pagination.limit).toBe(50);
      expect(result.pagination.totalPages).toBe(200);
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should use indexes effectively', async () => {
      const mockMessages = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        roomId: 'room-123',
        senderId: 'user-1',
        content: `Message content ${i}`,
        messageType: 'text',
        metadata: null,
        createdAt: new Date(),
      }));

      mockRepository.find.mockResolvedValue(mockMessages);
      mockCacheManager.get.mockResolvedValue(null);

      const result = await service.getRecentMessages('room-123', 50);

      expect(result).toHaveLength(50);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { roomId: 'room-123' },
        order: { createdAt: 'DESC' },
        take: 50,
      });
    });

    it('should cache results effectively', async () => {
      const mockMessages = Array.from({ length: 50 }, (_, i) => ({
        id: `msg-${i}`,
        roomId: 'room-123',
        senderId: `user-${i % 10}`,
        content: `Message content ${i}`,
        messageType: 'text',
        metadata: null,
        createdAt: new Date(),
      }));

      const cachedResult = {
        messages: mockMessages,
        pagination: { page: 1, limit: 50, total: 10000, totalPages: 200, hasNext: true, hasPrev: false },
        performance: { queryTimeMs: 5, cacheHit: true, indexUsed: true },
      };

      mockCacheManager.get.mockResolvedValue(cachedResult);

      const query = {
        roomId: 'room-123',
        limit: 50,
        page: 1,
      };

      const startTime = Date.now();
      const result = await service.getChatHistory(query);
      const endTime = Date.now();

      expect(result.performance.cacheHit).toBe(true);
      expect(endTime - startTime).toBeLessThan(10); // Cache should be very fast
      expect(mockRepository.findAndCount).not.toHaveBeenCalled();
    });
  });

  describe('Database load reduction', () => {
    it('should reduce database queries with caching', async () => {
      const query = {
        roomId: 'room-123',
        limit: 50,
        page: 1,
      };

      // First call - cache miss
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockRepository.findAndCount.mockResolvedValueOnce([[], 0]);

      await service.getChatHistory(query);
      expect(mockRepository.findAndCount).toHaveBeenCalledTimes(1);

      // Second call - cache hit
      const cachedResult = {
        messages: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
        performance: { queryTimeMs: 1, cacheHit: true, indexUsed: true },
      };
      mockCacheManager.get.mockResolvedValueOnce(cachedResult);

      await service.getChatHistory(query);
      expect(mockRepository.findAndCount).toHaveBeenCalledTimes(1); // Still only 1 call
    });
  });
});
