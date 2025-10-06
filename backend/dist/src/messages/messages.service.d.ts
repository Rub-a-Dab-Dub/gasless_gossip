import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private readonly messageRepository;
    constructor(messageRepository: Repository<Message>);
    create(createMessageDto: CreateMessageDto): Promise<Message>;
    findByRoom(roomId: string): Promise<Message[]>;
    private hashMessageContent;
    findAllByRoom(getMessagesDto: GetMessagesDto): Promise<PaginatedMessagesDto>;
    findOne(id: string): Promise<Message>;
    update(id: string, updateData: Partial<CreateMessageDto>): Promise<Message>;
    remove(id: string): Promise<void>;
    getMessageCountByRoom(roomId: string): Promise<number>;
    findRecentMessages(roomId: string, cursor?: string, limit?: number): Promise<{
        messages: Message[];
        nextCursor?: string;
    }>;
}
