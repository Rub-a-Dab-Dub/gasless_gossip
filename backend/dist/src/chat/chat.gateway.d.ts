import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { PaymasterService } from '../services/paymaster.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomsService;
    private readonly paymasterService;
    server: Server;
    private readonly logger;
    constructor(roomsService: RoomsService, paymasterService: PaymasterService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(payload: {
        room: string;
        userId?: string;
    }, client: Socket): Promise<void>;
    handleLeave(payload: {
        room: string;
        userId?: string;
    }, client: Socket): Promise<void>;
    handleMessage(payload: {
        room: string;
        message: any;
        userId?: string;
    }): Promise<void>;
    handleGaslessMessage(payload: {
        room: string;
        message: any;
        userId?: string;
        privateKey?: string;
    }): Promise<void>;
    notifyRoomJoined(roomId: string, userId: string): Promise<void>;
    notifyRoomLeft(roomId: string, userId: string): Promise<void>;
    private isUserMemberOfRoom;
}
