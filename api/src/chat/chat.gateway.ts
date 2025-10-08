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
import { User } from '../users/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // change this to your frontend domain in production
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
      console.log(`${user.username} connected`);
    } catch {
      socket.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { receiver_id: number; content: string },
  ) {
    const sender = (socket as any).user;
    const message = await this.chatService.sendMessage(
      sender.id,
      data.receiver_id,
      data.content,
    );

    this.server.to(`user_${sender.id}`).emit('new_message', message);
    this.server.to(`user_${data.receiver_id}`).emit('new_message', message);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody()
    data: {
      name: string;
      type: 'public' | 'paid';
      fee?: number;
    },
  ) {
    const room = await this.chatService.createRoom(
      data.name,
      data.type,
      data.fee,
    );
    this.server.emit('roomCreated', room);
    return room;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = (socket as any).user as User;
    await this.chatService.joinRoom(user.id, data.roomId);
    socket.join(`room_${data.roomId}`);
    this.server
      .to(`room_${data.roomId}`)
      .emit('userJoined', { user, roomId: data.roomId });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = (socket as any).user as User;
    await this.chatService.leaveRoom(user.id, data.roomId);
    socket.leave(`room_${data.roomId}`);
    this.server
      .to(`room_${data.roomId}`)
      .emit('userLeft', { user, roomId: data.roomId });
  }

  @SubscribeMessage('sendRoomMessage')
  async sendRoomMessage(
    @MessageBody() data: { roomId: number; content: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = (socket as any).user as User;
    const msg = await this.chatService.sendRoomMessage(
      user.id,
      data.roomId,
      data.content,
    );
    this.server.to(`room_${data.roomId}`).emit('newRoomMessage', msg);
  }

  @SubscribeMessage('getMessages')
  async getMessages(
    @MessageBody() data: { roomId: number; page?: number; limit?: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = (socket as any).user as User;
    const messages = await this.chatService.getMessages(
      data.roomId,
      user.id,
      data.page,
      data.limit,
    );
    return messages;
  }

  @SubscribeMessage('markAsRead')
  async markAsRead(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const user = (socket as any).user as User;
    await this.chatService.markAsRead(data.roomId, user.id);
    this.server
      .to(`room_${data.roomId}`)
      .emit('messagesRead', { userId: user.id });
  }

  @SubscribeMessage('getMembers')
  async getMembers(@MessageBody() data: { roomId: number }) {
    return this.chatService.getRoomMembers(data.roomId);
  }
}
