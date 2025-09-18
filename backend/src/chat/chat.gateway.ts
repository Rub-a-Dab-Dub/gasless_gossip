import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('ChatGateway initialized');
  }
  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() payload: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.room);
    client.emit('joined', { room: payload.room });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: { room: string; message: any }) {
    // broadcast to room
    console.log('📩 Message received from client:', payload.message);
    this.server.to(payload.room).emit('message', payload.message);
  }
}
