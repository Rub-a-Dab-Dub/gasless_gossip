import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, req: any): Promise<Message>;
    findByRoom(roomId: string, req: any): Promise<Message[]>;
    private userHasRoomAccess;
    findAllByRoom(roomId: string, query: Omit<GetMessagesDto, 'roomId'>): Promise<PaginatedMessagesDto>;
    findOne(id: string): Promise<Message>;
    update(id: string, updateMessageDto: Partial<CreateMessageDto>): Promise<Message>;
    remove(id: string): Promise<void>;
    getMessageCount(roomId: string): Promise<{
        count: number;
    }>;
    getRecentMessages(roomId: string, cursor?: string, limit?: number): Promise<{
        messages: Message[];
        nextCursor?: string;
    }>;
}
