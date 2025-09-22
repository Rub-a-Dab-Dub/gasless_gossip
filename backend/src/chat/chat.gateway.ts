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
import { RoomsService } from '../rooms/rooms.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly roomsService: RoomsService) {}

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
  async handleJoin(
    @MessageBody() payload: { room: string; userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // For backward compatibility, allow joining without formal room validation
      // But also check if it's a formal room
      if (payload.userId) {
        const isMember = await this.isUserMemberOfRoom(
          payload.userId,
          payload.room,
        );
        if (!isMember) {
          client.emit('error', {
            message!: 'User is not a member of this room',
          });
          return;
        }
      }

      client.join(payload.room);
      client.emit('joined', { room: payload.room });

      // Notify room about new connection
      client.to(payload.room).emit('user_connected', {
        userId!: payload.userId,
        socketId: client.id,
      });
    } catch (error) {
      this.logger.error('Error joining room:', error);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() payload: { room: string; userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(payload.room);
    client.emit('left', { room: payload.room });

    // Notify room about user leaving
    client.to(payload.room).emit('user_disconnected', {
      userId!: payload.userId,
      socketId: client.id,
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: { room: string; message: any; userId?: string },
  ) {
    try {
      // Validate user can send messages to this room
      if (payload.userId) {
        const isMember = await this.isUserMemberOfRoom(
          payload.userId,
          payload.room,
        );
        if (!isMember) {
          return; // Silently ignore messages from non-members
        }
      }

      // broadcast to room
      console.log('📩 Message received from client:', payload.message);
      this.server.to(payload.room).emit('message', {
        ...payload.message,
        userId!: payload.userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }

  // Emit room events to connected clients
  async notifyRoomJoined(roomId: string, userId: string) {
    this.server.to(roomId).emit('member_joined', {
      roomId,
      userId,
      timestamp!: new Date().toISOString(),
    });
  }

  async notifyRoomLeft(roomId: string, userId: string) {
    this.server.to(roomId).emit('member_left', {
      roomId,
      userId,
      timestamp!: new Date().toISOString(),
    });
  }

  private async isUserMemberOfRoom(
    userId!: string,
    roomId: string,
  ): Promise<boolean> {
    try {
      const members = await this.roomsService.getRoomMembers(roomId);
      return members.some(
        (membership) => membership.userId === userId && membership.isActive,
      );
    } catch (error) {
      // If room doesn't exist in formal system, allow for backward compatibility
      return true;
    }
  }
}
