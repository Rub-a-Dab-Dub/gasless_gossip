import { Repository } from 'typeorm';
import { Message, Notification } from './websockets.entity';
import { Socket } from 'socket.io';
export declare class WebSocketsService {
    private readonly messageRepo;
    private readonly notificationRepo;
    constructor(messageRepo: Repository<Message>, notificationRepo: Repository<Notification>);
    handleChat(data: any, client: Socket): Promise<{
        status: string;
        message: Message;
    }>;
    handleNotification(data: any, client: Socket): Promise<{
        status: string;
        notification: Notification;
    }>;
}
