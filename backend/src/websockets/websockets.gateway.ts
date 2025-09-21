import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketsService } from './websockets.service';

@WebSocketGateway({
  cors: true,
})
export class WebSocketsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsService: WebSocketsService) {}

  @SubscribeMessage('chat')
  handleChat(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // Save message to DB, broadcast to room
    return this.wsService.handleChat(data, client);
  }

  @SubscribeMessage('notification')
  handleNotification(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // Broadcast notification
    return this.wsService.handleNotification(data, client);
  }
}
