import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatHistoryQueryDto, ChatHistoryResponseDto, ChatMessageDto } from '../dto/chat-history.dto';
export declare class ChatHistoryService {
    private readonly chatMessageRepo;
    private cacheManager;
    private readonly logger;
    constructor(chatMessageRepo: Repository<ChatMessage>, cacheManager: Cache);
    getChatHistory(query: ChatHistoryQueryDto): Promise<ChatHistoryResponseDto>;
    getRecentMessages(roomId: string, limit?: number): Promise<ChatMessageDto[]>;
    getUserMessageHistory(userId: string, limit?: number): Promise<ChatMessageDto[]>;
    createMessage(roomId: string, senderId: string, content: string, messageType?: string, metadata?: Record<string, any>): Promise<ChatMessageDto>;
    getMessageById(messageId: string): Promise<ChatMessageDto>;
    private generateCacheKey;
    private invalidateRoomCaches;
    private invalidateUserCaches;
    performanceTest(roomId: string, messageCount?: number): Promise<{
        queryTime: number;
        messagesRetrieved: number;
        indexUsed: boolean;
    }>;
}
