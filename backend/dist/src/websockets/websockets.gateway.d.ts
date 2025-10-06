import { Server, Socket } from 'socket.io';
import { WebSocketsService } from './websockets.service';
export declare class WebSocketsGateway {
    private readonly wsService;
    server: Server;
    constructor(wsService: WebSocketsService);
    handleChat(data: any, client: Socket): Promise<{
        status: string;
        message: import("./websockets.entity").Message;
    }>;
    handleNotification(data: any, client: Socket): Promise<{
        status: string;
        notification: import("./websockets.entity").Notification;
    }>;
}
