import { OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class RoomEventsGateway implements OnGatewayInit {
    server: Server;
    private redisSubscriber;
    private redisPublisher;
    afterInit(): void;
    publishRoomUpdate(roomId: string, event: string, data: any): Promise<void>;
    notifyParticipants(roomId: string, message: string): Promise<void>;
}
