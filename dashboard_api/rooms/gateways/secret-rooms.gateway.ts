import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { FakeNameGeneratorService, FakeNameTheme } from '../services/fake-name-generator.service';
import { VoiceModerationQueueService } from '../services/voice-moderation-queue.service';

interface ConnectedUser {
  userId: string;
  roomId: string;
  pseudonym?: string;
  joinedAt: Date;
}

interface ReactionData {
  messageId: string;
  roomId: string;
  emoji: string;
  userId: string;
  pseudonym?: string;
}

interface VoiceNoteData {
  roomId: string;
  userId: string;
  voiceNoteUrl: string;
  duration: number;
  pseudonym?: string;
}

interface TokenTipData {
  roomId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  token: string;
  message?: string;
  fromPseudonym?: string;
  toPseudonym?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/rooms',
})
@Injectable()
export class SecretRoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SecretRoomsGateway.name);
  private connectedUsers = new Map<string, ConnectedUser>();
  private roomParticipants = new Map<string, Set<string>>(); // roomId -> Set of socketIds

  constructor(
    private fakeNameGenerator: FakeNameGeneratorService,
    private voiceModerationQueue: VoiceModerationQueueService,
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    
    if (user) {
      // Remove from room participants
      const roomParticipants = this.roomParticipants.get(user.roomId);
      if (roomParticipants) {
        roomParticipants.delete(client.id);
        if (roomParticipants.size === 0) {
          this.roomParticipants.delete(user.roomId);
        }
      }

      // Release pseudonym
      if (user.pseudonym) {
        this.fakeNameGenerator.releaseFakeName(user.pseudonym, user.roomId);
      }

      // Notify room about user leaving
      client.to(user.roomId).emit('userLeft', {
        pseudonym: user.pseudonym,
        timestamp: new Date(),
      });

      this.connectedUsers.delete(client.id);
      this.logger.log(`User disconnected: ${client.id} from room: ${user.roomId}`);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; enablePseudonym?: boolean; fakeNameTheme?: FakeNameTheme }
  ) {
    try {
      const { roomId, userId, enablePseudonym = true, fakeNameTheme = 'default' } = data;

      // Generate pseudonym if enabled
      let pseudonym: string | undefined;
      if (enablePseudonym) {
        pseudonym = this.fakeNameGenerator.generateFakeName(fakeNameTheme, roomId);
      }

      // Store user connection info
      const user: ConnectedUser = {
        userId,
        roomId,
        pseudonym,
        joinedAt: new Date(),
      };
      
      this.connectedUsers.set(client.id, user);

      // Add to room participants
      if (!this.roomParticipants.has(roomId)) {
        this.roomParticipants.set(roomId, new Set());
      }
      this.roomParticipants.get(roomId)!.add(client.id);

      // Join the room
      await client.join(roomId);

      // Notify others about new user
      client.to(roomId).emit('userJoined', {
        pseudonym,
        timestamp: new Date(),
      });

      // Send confirmation to joining user
      client.emit('joinedRoom', {
        roomId,
        pseudonym,
        participantCount: this.roomParticipants.get(roomId)?.size || 0,
      });

      this.logger.log(`User ${userId} joined room ${roomId} as ${pseudonym || 'themselves'}`);
    } catch (error) {
      this.logger.error('Error joining room:', error);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const user = this.connectedUsers.get(client.id);
    
    if (user) {
      await client.leave(user.roomId);
      await this.handleDisconnect(client);
    }
  }

  @SubscribeMessage('sendReaction')
  async handleReaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ReactionData
  ) {
    try {
      const user = this.connectedUsers.get(client.id);
      
      if (!user || user.roomId !== data.roomId) {
        client.emit('error', { message: 'Not authorized for this room' });
        return;
      }

      const reactionEvent = {
        ...data,
        pseudonym: user.pseudonym,
        timestamp: new Date(),
      };

      // Broadcast reaction to all room participants
      this.server.to(data.roomId).emit('reactionAdded', reactionEvent);

      this.logger.debug(`Reaction sent: ${data.emoji} by ${user.pseudonym || user.userId} in room ${data.roomId}`);
    } catch (error) {
      this.logger.error('Error handling reaction:', error);
      client.emit('error', { message: 'Failed to send reaction' });
    }
  }

  @SubscribeMessage('sendVoiceNote')
  async handleVoiceNote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: VoiceNoteData
  ) {
    try {
      const user = this.connectedUsers.get(client.id);
      
      if (!user || user.roomId !== data.roomId) {
        client.emit('error', { message: 'Not authorized for this room' });
        return;
      }

      // Add to moderation queue
      const queuePosition = await this.voiceModerationQueue.addToQueue({
        roomId: data.roomId,
        userId: user.userId,
        voiceNoteUrl: data.voiceNoteUrl,
        priority: 'medium'
      });

      // Notify sender about queue status
      client.emit('voiceNoteQueued', {
        queuePosition,
        estimatedWaitTime: queuePosition * 30, // Rough estimate in seconds
      });

      // For demo purposes, immediately broadcast (in production, wait for moderation)
      const voiceNoteEvent = {
        ...data,
        pseudonym: user.pseudonym,
        timestamp: new Date(),
      };

      this.server.to(data.roomId).emit('voiceNoteReceived', voiceNoteEvent);

      this.logger.debug(`Voice note queued: ${user.pseudonym || user.userId} in room ${data.roomId}`);
    } catch (error) {
      this.logger.error('Error handling voice note:', error);
      client.emit('error', { message: 'Failed to send voice note' });
    }
  }

  @SubscribeMessage('sendTokenTip')
  async handleTokenTip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TokenTipData
  ) {
    try {
      const user = this.connectedUsers.get(client.id);
      
      if (!user || user.roomId !== data.roomId || user.userId !== data.fromUserId) {
        client.emit('error', { message: 'Not authorized for this action' });
        return;
      }

      // Find recipient's pseudonym
      const recipientSocket = Array.from(this.connectedUsers.entries())
        .find(([_, connectedUser]) => 
          connectedUser.userId === data.toUserId && connectedUser.roomId === data.roomId
        );

      const tokenTipEvent = {
        ...data,
        fromPseudonym: user.pseudonym,
        toPseudonym: recipientSocket?.[1].pseudonym,
        timestamp: new Date(),
      };

      // Broadcast token tip to room
      this.server.to(data.roomId).emit('tokenTipReceived', tokenTipEvent);

      // Send specific notifications to sender and recipient
      client.emit('tokenTipSent', {
        amount: data.amount,
        token: data.token,
        recipient: tokenTipEvent.toPseudonym || 'User',
      });

      if (recipientSocket) {
        this.server.to(recipientSocket[0]).emit('tokenTipReceived', {
          amount: data.amount,
          token: data.token,
          sender: user.pseudonym || 'User',
          message: data.message,
        });
      }

      this.logger.log(`Token tip: ${data.amount} ${data.token} from ${user.pseudonym} to ${tokenTipEvent.toPseudonym} in room ${data.roomId}`);
    } catch (error) {
      this.logger.error('Error handling token tip:', error);
      client.emit('error', { message: 'Failed to send token tip' });
    }
  }

  @SubscribeMessage('getRoomStats')
  async handleGetRoomStats(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const participants = this.roomParticipants.get(data.roomId);
    const moderationQueue = this.voiceModerationQueue.getItemsByRoom(data.roomId);
    
    client.emit('roomStats', {
      participantCount: participants?.size || 0,
      moderationQueueLength: moderationQueue.length,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast a message to all participants in a room
   * @param roomId - Room to broadcast to
   * @param event - Event name
   * @param data - Data to broadcast
   */
  broadcastToRoom(roomId: string, event: string, data: any): void {
    this.server.to(roomId).emit(event, data);
  }

  /**
   * Get room participant count
   * @param roomId - Room ID
   * @returns Number of connected participants
   */
  getRoomParticipantCount(roomId: string): number {
    return this.roomParticipants.get(roomId)?.size || 0;
  }

  /**
   * Get all connected users for a room (for admin/moderation purposes)
   * @param roomId - Room ID
   * @returns Array of connected users
   */
  getRoomParticipants(roomId: string): ConnectedUser[] {
    const participants = this.roomParticipants.get(roomId);
    if (!participants) return [];

    return Array.from(participants)
      .map(socketId => this.connectedUsers.get(socketId))
      .filter((user): user is ConnectedUser => user !== undefined && user.roomId === roomId);
  }
}