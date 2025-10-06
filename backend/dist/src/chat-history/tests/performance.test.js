"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const chat_history_service_1 = require("../services/chat-history.service");
const chat_message_entity_1 = require("../entities/chat-message.entity");
describe('ChatHistoryService Performance Tests', () => {
    let service;
    let mockRepository;
    let mockCacheManager;
    beforeEach(async () => {
        mockRepository = {
            findAndCount: jest.fn(),
            find: jest.fn(),
        };
        mockCacheManager = {
            get: jest.fn(),
            set: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chat_history_service_1.ChatHistoryService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(chat_message_entity_1.ChatMessage),
                    useValue: mockRepository,
                },
                {
                    provide: cache_manager_1.CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();
        service = module.get(chat_history_service_1.ChatHistoryService);
    });
    describe('Performance with 10,000 messages', () => {
        it('should query 10,000 messages in under 100ms', async () => {
            const mockMessages = Array.from({ length: 10000 }, (_, i) => ({
                id: `msg-${i}`,
                roomId: 'room-123',
                senderId: `user-${i % 100}`,
                content: `Message content ${i}`,
                messageType: 'text',
                metadata: null,
                createdAt: new Date(Date.now() - i * 1000),
            }));
            mockRepository.find.mockResolvedValue(mockMessages);
            mockCacheManager.get.mockResolvedValue(null);
            const startTime = Date.now();
            const result = await service.performanceTest('room-123', 10000);
            const endTime = Date.now();
            expect(result.messagesRetrieved).toBe(10000);
            expect(result.queryTime).toBeLessThan(100);
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
            expect(endTime - startTime).toBeLessThan(10);
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
            mockCacheManager.get.mockResolvedValueOnce(null);
            mockRepository.findAndCount.mockResolvedValueOnce([[], 0]);
            await service.getChatHistory(query);
            expect(mockRepository.findAndCount).toHaveBeenCalledTimes(1);
            const cachedResult = {
                messages: [],
                pagination: { page: 1, limit: 50, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
                performance: { queryTimeMs: 1, cacheHit: true, indexUsed: true },
            };
            mockCacheManager.get.mockResolvedValueOnce(cachedResult);
            await service.getChatHistory(query);
            expect(mockRepository.findAndCount).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=performance.test.js.map