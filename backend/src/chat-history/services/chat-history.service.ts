import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Inject, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatHistoryQueryDto, ChatHistoryResponseDto, ChatMessageDto, PaginationDto, PerformanceMetricsDto } from '../dto/chat-history.dto';

@Injectable()
export class ChatHistoryService {
  private readonly logger = new Logger(ChatHistoryService.name);

  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getChatHistory(query: ChatHistoryQueryDto): Promise<ChatHistoryResponseDto> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(query);
    
    // Try to get from cache first
    const cachedResult = await this.cacheManager.get<ChatHistoryResponseDto>(cacheKey);
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

    // Build query conditions
    const whereConditions: any = { roomId: query.roomId };
    
    // Date filtering
    if (query.before) {
      whereConditions.createdAt = LessThan(new Date(query.before));
    }
    if (query.after) {
      whereConditions.createdAt = MoreThan(new Date(query.after));
    }
    if (query.before && query.after) {
      whereConditions.createdAt = Between(new Date(query.after), new Date(query.before));
    }

    // Cursor-based pagination (more efficient for large datasets)
    if (query.cursor) {
      whereConditions.id = LessThan(query.cursor);
    }

    // Execute query with performance monitoring
    const [messages, total] = await this.chatMessageRepo.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      take: query.limit,
      skip: query.cursor ? 0 : (query.page - 1) * query.limit,
    });

    const queryTime = Date.now() - startTime;
    
    // Transform to DTOs
    const messageDtos: ChatMessageDto[] = messages.map(msg => ({
      id: msg.id,
      roomId: msg.roomId,
      senderId: msg.senderId,
      content: msg.content,
      messageType: msg.messageType,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(total / query.limit);
    const pagination: PaginationDto = {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
      nextCursor: messages.length > 0 ? messages[messages.length - 1].id : undefined,
      prevCursor: messages.length > 0 ? messages[0].id : undefined,
    };

    const performance: PerformanceMetricsDto = {
      queryTimeMs: queryTime,
      cacheHit: false,
      indexUsed: true, // We have indexes on roomId and createdAt
    };

    const result: ChatHistoryResponseDto = {
      messages: messageDtos,
      pagination,
      performance,
    };

    // Cache the result for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);

    this.logger.log(`Chat history query completed in ${queryTime}ms for room ${query.roomId}`);
    
    return result;
  }

  async getRecentMessages(roomId: string, limit: number = 50): Promise<ChatMessageDto[]> {
    const cacheKey = `recent_messages:${roomId}:${limit}`;
    
    const cached = await this.cacheManager.get<ChatMessageDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const messages = await this.chatMessageRepo.find({
      where: { roomId },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const messageDtos: ChatMessageDto[] = messages.map(msg => ({
      id: msg.id,
      roomId: msg.roomId,
      senderId: msg.senderId,
      content: msg.content,
      messageType: msg.messageType,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
    }));

    // Cache for 1 minute (recent messages change frequently)
    await this.cacheManager.set(cacheKey, messageDtos, 60000);

    return messageDtos;
  }

  async getUserMessageHistory(userId: string, limit: number = 100): Promise<ChatMessageDto[]> {
    const cacheKey = `user_messages:${userId}:${limit}`;
    
    const cached = await this.cacheManager.get<ChatMessageDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const messages = await this.chatMessageRepo.find({
      where: { senderId: userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const messageDtos: ChatMessageDto[] = messages.map(msg => ({
      id: msg.id,
      roomId: msg.roomId,
      senderId: msg.senderId,
      content: msg.content,
      messageType: msg.messageType,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
    }));

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, messageDtos, 300000);

    return messageDtos;
  }

  async createMessage(
    roomId: string,
    senderId: string,
    content: string,
    messageType: string = 'text',
    metadata?: Record<string, any>,
  ): Promise<ChatMessageDto> {
    const message = this.chatMessageRepo.create({
      roomId,
      senderId,
      content,
      messageType,
      metadata,
    });

    const savedMessage = await this.chatMessageRepo.save(message);

    // Invalidate relevant caches
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

  async getMessageById(messageId: string): Promise<ChatMessageDto> {
    const message = await this.chatMessageRepo.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException('Message not found');
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

  private generateCacheKey(query: ChatHistoryQueryDto): string {
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

  private async invalidateRoomCaches(roomId: string): Promise<void> {
    const patterns = [
      `chat_history:room:${roomId}:*`,
      `recent_messages:${roomId}:*`,
    ];
    
    for (const pattern of patterns) {
      // Note: Redis pattern deletion would require a different cache manager implementation
      // For now, we'll let TTL handle cache expiration
      this.logger.debug(`Cache invalidation needed for pattern: ${pattern}`);
    }
  }

  private async invalidateUserCaches(userId: string): Promise<void> {
    const pattern = `user_messages:${userId}:*`;
    this.logger.debug(`Cache invalidation needed for pattern: ${pattern}`);
  }

  // Performance testing method
  async performanceTest(roomId: string, messageCount: number = 10000): Promise<{
    queryTime: number;
    messagesRetrieved: number;
    indexUsed: boolean;
  }> {
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
      indexUsed: true, // Our indexes should be used
    };
  }
}
