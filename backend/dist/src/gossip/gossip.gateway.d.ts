import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GossipService } from './services/gossip.service';
import { CreateGossipIntentDto, UpdateGossipIntentDto, VoteGossipDto, CommentGossipDto } from './dto/gossip.dto';
export declare class GossipGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly gossipService;
    server: Server;
    private readonly logger;
    private readonly connectedUsers;
    private readonly socketToUser;
    private readonly roomSubscriptions;
    private readonly performanceMetrics;
    constructor(gossipService: GossipService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAuthenticate(data: {
        token: string;
        userId: string;
    }, client: Socket): Promise<{
        status: string;
        userId: string;
        message?: undefined;
    } | {
        status: string;
        message: string;
        userId?: undefined;
    }>;
    handleJoinRoom(data: {
        roomId: string;
    }, client: Socket): Promise<{
        status: string;
        message: string;
        roomId?: undefined;
    } | {
        status: string;
        roomId: string;
        message?: undefined;
    }>;
    handleLeaveRoom(data: {
        roomId: string;
    }, client: Socket): Promise<{
        status: string;
        message: string;
        roomId?: undefined;
    } | {
        status: string;
        roomId: string;
        message?: undefined;
    }>;
    handleNewGossip(data: CreateGossipIntentDto, client: Socket): Promise<{
        status: string;
        message: string;
        intent?: undefined;
    } | {
        status: string;
        intent: import("./dto/gossip.dto").GossipIntentDto;
        message?: undefined;
    }>;
    handleUpdateGossip(data: UpdateGossipIntentDto, client: Socket): Promise<{
        status: string;
        message: string;
        intent?: undefined;
    } | {
        status: string;
        intent: import("./dto/gossip.dto").GossipIntentDto;
        message?: undefined;
    }>;
    handleVoteGossip(data: VoteGossipDto, client: Socket): Promise<{
        status: string;
        message: string;
        intent?: undefined;
    } | {
        status: string;
        intent: import("./dto/gossip.dto").GossipIntentDto;
        message?: undefined;
    }>;
    handleCommentGossip(data: CommentGossipDto, client: Socket): Promise<{
        status: string;
        message: string;
        update?: undefined;
    } | {
        status: string;
        update: import("./dto/gossip.dto").GossipUpdateDto;
        message?: undefined;
    }>;
    broadcastToRoom(roomId: string, event: string, data: any): Promise<void>;
    broadcastToUser(userId: string, event: string, data: any): Promise<void>;
    broadcastToAll(event: string, data: any): Promise<void>;
    private updatePerformanceMetrics;
    private logPerformanceMetrics;
    getConnectionStats(): {
        activeConnections: number;
        totalConnections: number;
        roomsSubscribed: number;
        usersConnected: number;
        averageLatency: number;
    };
}
