import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Hook } from '../entities/hook.entity';
export declare class HooksGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeToEvents(data: {
        eventTypes?: string[];
    }, client: Socket): void;
    handleUnsubscribeFromEvents(data: {
        eventTypes?: string[];
    }, client: Socket): void;
    broadcastHookCreated(hook: Hook): void;
    broadcastHookProcessed(hook: Hook): void;
    broadcastStats(stats: any): void;
    getConnectedClientsCount(): number;
}
