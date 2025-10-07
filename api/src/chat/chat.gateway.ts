import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // change to your frontend domain in production
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const user = this.jwtService.verify(token);
      (socket as any).user = user;
      socket.join(`user_${user.id}`);
      console.log(`✅ ${user.username} connected`);
    } catch {
      socket.disconnect();
    }
  }

  @SubscribeMessage('private_message')
  async handlePrivateMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { receiverId: number; content: string },
  ) {
    const sender = (socket as any).user;
    const message = await this.chatService.sendMessage(
      sender.id,
      data.receiverId,
      data.content,
    );

    // Emit to both participants
    this.server.to(`user_${sender.id}`).emit('new_message', message);
    this.server.to(`user_${data.receiverId}`).emit('new_message', message);
  }
}
