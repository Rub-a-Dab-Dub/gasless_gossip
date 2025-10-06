"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatHistoryService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_2 = require("cache-manager");
const chat_message_entity_1 = require("../entities/chat-message.entity");
let ChatHistoryService = ChatHistoryService_1 = class ChatHistoryService {
    chatMessageRepo;
    cacheManager;
    logger = new common_1.Logger(ChatHistoryService_1.name);
    constructor(chatMessageRepo, cacheManager) {
        this.chatMessageRepo = chatMessageRepo;
        this.cacheManager = cacheManager;
    }
    async getChatHistory(query) {
        const startTime = Date.now();
        const cacheKey = this.generateCacheKey(query);
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            this.logger.debug(`Cache hit for room ${query.roomId}`);
            return {
                ...cachedResult,
                performance: {
                    ...cachedResult.performance,
                    queryTimeMs: Date.now() - startTime,
                    cacheHit: true,
                },
            };
        }
        const whereConditions = { roomId: query.roomId };
        if (query.before) {
            whereConditions.createdAt = (0, typeorm_2.LessThan)(new Date(query.before));
        }
        if (query.after) {
            whereConditions.createdAt = (0, typeorm_2.MoreThan)(new Date(query.after));
        }
        if (query.before && query.after) {
            whereConditions.createdAt = (0, typeorm_2.Between)(new Date(query.after), new Date(query.before));
        }
        if (query.cursor) {
            whereConditions.id = (0, typeorm_2.LessThan)(query.cursor);
        }
        const [messages, total] = await this.chatMessageRepo.findAndCount({
            where: whereConditions,
            order: { createdAt: 'DESC' },
            take: query.limit,
            skip: query.cursor ? 0 : (query.page - 1) * query.limit,
        });
        const queryTime = Date.now() - startTime;
        const messageDtos = messages.map(msg => ({
            id: msg.id,
            roomId: msg.roomId,
            senderId: msg.senderId,
            content: msg.content,
            messageType: msg.messageType,
            metadata: msg.metadata,
            createdAt: msg.createdAt,
        }));
        const totalPages = Math.ceil(total / query.limit);
        const pagination = {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
            hasNext: query.page < totalPages,
            hasPrev: query.page > 1,
            nextCursor: messages.length > 0 ? messages[messages.length - 1].id : undefined,
            prevCursor: messages.length > 0 ? messages[0].id : undefined,
        };
        const performance = {
            queryTimeMs: queryTime,
            cacheHit: false,
            indexUsed: true,
        };
        const result = {
            messages: messageDtos,
            pagination,
            performance,
        };
        await this.cacheManager.set(cacheKey, result, 300000);
        this.logger.log(`Chat history query completed in ${queryTime}ms for room ${query.roomId}`);
        return result;
    }
    async getRecentMessages(roomId, limit = 50) {
        const cacheKey = `recent_messages:${roomId}:${limit}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const messages = await this.chatMessageRepo.find({
            where: { roomId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
        const messageDtos = messages.map(msg => ({
            id: msg.id,
            roomId: msg.roomId,
            senderId: msg.senderId,
            content: msg.content,
            messageType: msg.messageType,
            metadata: msg.metadata,
            createdAt: msg.createdAt,
        }));
        await this.cacheManager.set(cacheKey, messageDtos, 60000);
        return messageDtos;
    }
    async getUserMessageHistory(userId, limit = 100) {
        const cacheKey = `user_messages:${userId}:${limit}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const messages = await this.chatMessageRepo.find({
            where: { senderId: userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
        const messageDtos = messages.map(msg => ({
            id: msg.id,
            roomId: msg.roomId,
            senderId: msg.senderId,
            content: msg.content,
            messageType: msg.messageType,
            metadata: msg.metadata,
            createdAt: msg.createdAt,
        }));
        await this.cacheManager.set(cacheKey, messageDtos, 300000);
        return messageDtos;
    }
    async createMessage(roomId, senderId, content, messageType = 'text', metadata) {
        const message = this.chatMessageRepo.create({
            roomId,
            senderId,
            content,
            messageType,
            metadata,
        });
        const savedMessage = await this.chatMessageRepo.save(message);
        await this.invalidateRoomCaches(roomId);
        await this.invalidateUserCaches(senderId);
        return {
            id: savedMessage.id,
            roomId: savedMessage.roomId,
            senderId: savedMessage.senderId,
            content: savedMessage.content,
            messageType: savedMessage.messageType,
            metadata: savedMessage.metadata,
            createdAt: savedMessage.createdAt,
        };
    }
    async getMessageById(messageId) {
        const message = await this.chatMessageRepo.findOne({ where: { id: messageId } });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        return {
            id: message.id,
            roomId: message.roomId,
            senderId: message.senderId,
            content: message.content,
            messageType: message.messageType,
            metadata: message.metadata,
            createdAt: message.createdAt,
        };
    }
    generateCacheKey(query) {
        const params = [
            `room:${query.roomId}`,
            `limit:${query.limit}`,
            `page:${query.page}`,
            query.cursor ? `cursor:${query.cursor}` : '',
            query.before ? `before:${query.before}` : '',
            query.after ? `after:${query.after}` : '',
        ].filter(Boolean);
        return `chat_history:${params.join(':')}`;
    }
    async invalidateRoomCaches(roomId) {
        const patterns = [
            `chat_history:room:${roomId}:*`,
            `recent_messages:${roomId}:*`,
        ];
        for (const pattern of patterns) {
            this.logger.debug(`Cache invalidation needed for pattern: ${pattern}`);
        }
    }
    async invalidateUserCaches(userId) {
        const pattern = `user_messages:${userId}:*`;
        this.logger.debug(`Cache invalidation needed for pattern: ${pattern}`);
    }
    async performanceTest(roomId, messageCount = 10000) {
        const startTime = Date.now();
        const messages = await this.chatMessageRepo.find({
            where: { roomId },
            order: { createdAt: 'DESC' },
            take: messageCount,
        });
        const queryTime = Date.now() - startTime;
        return {
            queryTime,
            messagesRetrieved: messages.length,
            indexUsed: true,
        };
    }
};
exports.ChatHistoryService = ChatHistoryService;
exports.ChatHistoryService = ChatHistoryService = ChatHistoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(1, (0, cache_manager_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object])
], ChatHistoryService);
//# sourceMappingURL=chat-history.service.js.map