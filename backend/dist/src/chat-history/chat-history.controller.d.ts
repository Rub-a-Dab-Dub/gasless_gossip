import { ChatHistoryService } from './services/chat-history.service';
import { ChatHistoryQueryDto, ChatHistoryResponseDto, ChatMessageDto } from './dto/chat-history.dto';
export declare class ChatHistoryController {
    private readonly chatHistoryService;
    constructor(chatHistoryService: ChatHistoryService);
    getChatHistory(query: ChatHistoryQueryDto, req: any): Promise<ChatHistoryResponseDto>;
    getRecentMessages(roomId: string, limit?: number, req: any): Promise<ChatMessageDto[]>;
    getUserMessageHistory(userId: string, limit?: number, req: any): Promise<ChatMessageDto[]>;
    createMessage(createMessageDto: {
        roomId: string;
        content: string;
        messageType?: string;
        metadata?: Record<string, any>;
    }, req: any): Promise<ChatMessageDto>;
    getMessage(messageId: string, req: any): Promise<ChatMessageDto>;
    performanceTest(roomId: string, messageCount?: number, req: any): Promise<{
        queryTime: number;
        messagesRetrieved: number;
        indexUsed: boolean;
    }>;
}
