import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { SecretRoomsService } from '../services/secret-rooms.service';

interface ReactionData {
  messageId: string;
  reactionType: 'like' | 'love' | 'laugh' | 'fire' | 'mind_blown' | 'angry' | 'sad';
  roomId: string;
  userId: string;
}

interface VoiceNoteData {
  roomId: string;
  audioUrl: string;
  duration: number;
  isBlurred: boolean;
  userId: string;
}

interface PseudonymData {
  roomId: string;
  userId: string;
  pseudonym: string;
}

@WebSocketGateway({
  namespace: '/secret-rooms',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class SecretRoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SecretRoomsGateway.name);
  private readonly connectedUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private readonly socketToUser = new Map<string, string>(); // socketId -> userId
  private readonly roomSubscriptions = new Map<string, Set<string>>(); // roomId -> Set<socketId>
  private readonly roomPseudonyms = new Map<string, Map<string, string>>(); // roomId -> (userId -> pseudonym)

  constructor(private readonly secretRoomsService: SecretRoomsService) {}

  afterInit(server: Server) {
    this.logger.log('SecretRoomsGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Clean up user connections
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      const userSockets = this.connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(userId);
        }
      }
      this.socketToUser.delete(client.id);
    }

    // Clean up room subscriptions
    for (const [roomId, sockets] of this.roomSubscriptions.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.roomSubscriptions.delete(roomId);
        }
      }
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(
    @MessageBody() data: { token: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // TODO: Validate JWT token
      // For now, just store the user connection
      
      if (!this.connectedUsers.has(data.userId)) {
        this.connectedUsers.set(data.userId, new Set());
      }
      this.connectedUsers.get(data.userId)!.add(client.id);
      this.socketToUser.set(client.id, data.userId);

      client.emit('authenticated', { success: true, userId: data.userId });
      this.logger.log(`User ${data.userId} authenticated with socket ${client.id}`);
    } catch (error) {
      client.emit('authentication_error', { message: 'Invalid token' });
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Verify user can access the room
      const room = await this.secretRoomsService.getSecretRoom(data.roomId, data.userId);
      
      // Add to room subscription
      if (!this.roomSubscriptions.has(data.roomId)) {
        this.roomSubscriptions.set(data.roomId, new Set());
      }
      this.roomSubscriptions.get(data.roomId)!.add(client.id);
      
      // Join socket.io room
      client.join(data.roomId);
      
      // Get or create pseudonym for this user in this room
      const pseudonym = await this.getOrCreatePseudonym(data.roomId, data.userId, room.fakeNameTheme);
      
      // Store pseudonym mapping
      if (!this.roomPseudonyms.has(data.roomId)) {
        this.roomPseudonyms.set(data.roomId, new Map());
      }
      this.roomPseudonyms.get(data.roomId)!.set(data.userId, pseudonym);

      client.emit('joined_room', { 
        roomId: data.roomId, 
        pseudonym: room.enablePseudonyms ? pseudonym : undefined,
        roomInfo: {
          name: room.name,
          enablePseudonyms: room.enablePseudonyms,
          expiresAt: room.expiresAt
        }
      });

      // Notify room about new member (with pseudonym if enabled)
      const displayName = room.enablePseudonyms ? pseudonym : `User ${data.userId}`;
      this.server.to(data.roomId).emit('member_joined', {
        displayName,
        timestamp: new Date(),
        memberCount: this.roomSubscriptions.get(data.roomId)?.size || 0
      });

      this.logger.log(`User ${data.userId} joined room ${data.roomId} as ${displayName}`);
    } catch (error) {
      client.emit('join_error', { message: 'Failed to join room' });
      this.logger.error(`Failed to join room ${data.roomId}:`, error);
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Remove from room subscription
      const roomSockets = this.roomSubscriptions.get(data.roomId);
      if (roomSockets) {
        roomSockets.delete(client.id);
        if (roomSockets.size === 0) {
          this.roomSubscriptions.delete(data.roomId);
        }
      }

      // Leave socket.io room
      client.leave(data.roomId);

      // Get pseudonym for notification
      const pseudonym = this.roomPseudonyms.get(data.roomId)?.get(data.userId);
      
      client.emit('left_room', { roomId: data.roomId });

      // Notify room about member leaving
      this.server.to(data.roomId).emit('member_left', {
        displayName: pseudonym || `User ${data.userId}`,
        timestamp: new Date(),
        memberCount: roomSockets?.size || 0
      });

      this.logger.log(`User ${data.userId} left room ${data.roomId}`);
    } catch (error) {
      this.logger.error(`Failed to leave room ${data.roomId}:`, error);
    }
  }

  @SubscribeMessage('react_to_message')
  async handleReaction(
    @MessageBody() data: ReactionData,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Update room reaction metrics
      await this.secretRoomsService.updateRoomReactionMetrics(
        data.roomId, 
        data.reactionType, 
        true
      );

      // Get user's pseudonym for this room
      const pseudonym = this.roomPseudonyms.get(data.roomId)?.get(data.userId);
      const room = await this.secretRoomsService.getSecretRoom(data.roomId);

      // Broadcast reaction to room
      this.server.to(data.roomId).emit('reaction_added', {
        messageId: data.messageId,
        reactionType: data.reactionType,
        from: room.enablePseudonyms ? pseudonym : `User ${data.userId}`,
        timestamp: new Date(),
        roomId: data.roomId
      });

      this.logger.debug(`Reaction ${data.reactionType} added to message ${data.messageId} in room ${data.roomId}`);
    } catch (error) {
      client.emit('reaction_error', { message: 'Failed to add reaction' });
      this.logger.error(`Failed to add reaction:`, error);
    }
  }

  @SubscribeMessage('remove_reaction')
  async handleRemoveReaction(
    @MessageBody() data: ReactionData,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Update room reaction metrics
      await this.secretRoomsService.updateRoomReactionMetrics(
        data.roomId, 
        data.reactionType, 
        false
      );

      // Get user's pseudonym for this room
      const pseudonym = this.roomPseudonyms.get(data.roomId)?.get(data.userId);
      const room = await this.secretRoomsService.getSecretRoom(data.roomId);

      // Broadcast reaction removal to room
      this.server.to(data.roomId).emit('reaction_removed', {
        messageId: data.messageId,
        reactionType: data.reactionType,
        from: room.enablePseudonyms ? pseudonym : `User ${data.userId}`,
        timestamp: new Date(),
        roomId: data.roomId
      });

      this.logger.debug(`Reaction ${data.reactionType} removed from message ${data.messageId} in room ${data.roomId}`);
    } catch (error) {
      client.emit('reaction_error', { message: 'Failed to remove reaction' });
      this.logger.error(`Failed to remove reaction:`, error);
    }
  }

  @SubscribeMessage('voice_note_shared')
  async handleVoiceNote(
    @MessageBody() data: VoiceNoteData,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Get user's pseudonym for this room
      const pseudonym = this.roomPseudonyms.get(data.roomId)?.get(data.userId);
      const room = await this.secretRoomsService.getSecretRoom(data.roomId);

      // Broadcast voice note to room members
      this.server.to(data.roomId).emit('voice_note_received', {
        audioUrl: data.isBlurred ? data.audioUrl : data.audioUrl, // Use blurred version
        duration: data.duration,
        from: room.enablePseudonyms ? pseudonym : `User ${data.userId}`,
        timestamp: new Date(),
        isBlurred: data.isBlurred,
        roomId: data.roomId
      });

      // Award XP for voice note sharing
      await this.secretRoomsService.awardCreatorXpBonus(data.roomId, 'voice_note_shared');

      this.logger.log(`Voice note shared in room ${data.roomId} by ${pseudonym || data.userId}`);
    } catch (error) {
      client.emit('voice_note_error', { message: 'Failed to share voice note' });
      this.logger.error(`Failed to share voice note:`, error);
    }
  }

  @SubscribeMessage('request_room_stats')
  async handleRoomStatsRequest(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = await this.secretRoomsService.getSecretRoom(data.roomId);
      const activeMembers = this.roomSubscriptions.get(data.roomId)?.size || 0;

      client.emit('room_stats', {
        roomId: data.roomId,
        activeMembers,
        totalMembers: room.currentUsers,
        trendingScore: room.reactionMetrics?.trendingScore || 0,
        totalReactions: room.reactionMetrics?.totalReactions || 0,
        expiresAt: room.expiresAt,
        timeRemaining: room.expiresAt ? room.expiresAt.getTime() - Date.now() : null
      });
    } catch (error) {
      client.emit('stats_error', { message: 'Failed to get room stats' });
    }
  }

  /**
   * Broadcast room expiry warning to all members
   */
  async notifyRoomExpiry(roomId: string, minutesRemaining: number): Promise<void> {
    const roomSockets = this.roomSubscriptions.get(roomId);
    if (!roomSockets || roomSockets.size === 0) return;

    this.server.to(roomId).emit('room_expiry_warning', {
      minutesRemaining,
      message: `This room will expire in ${minutesRemaining} minutes!`,
      timestamp: new Date()
    });

    this.logger.log(`Sent expiry warning for room ${roomId}: ${minutesRemaining} minutes remaining`);
  }

  /**
   * Notify room members of room deletion
   */
  async notifyRoomDeletion(roomId: string): Promise<void> {
    const roomSockets = this.roomSubscriptions.get(roomId);
    if (!roomSockets || roomSockets.size === 0) return;

    this.server.to(roomId).emit('room_deleted', {
      message: 'This room has been deleted',
      timestamp: new Date()
    });

    // Clean up room from gateway
    this.roomSubscriptions.delete(roomId);
    this.roomPseudonyms.delete(roomId);

    this.logger.log(`Notified deletion of room ${roomId}`);
  }

  /**
   * Get or create pseudonym for user in room
   */
  private async getOrCreatePseudonym(roomId: string, userId: string, theme: string): Promise<string> {
    // TODO: Integrate with existing pseudonym service
    // For now, generate a simple pseudonym
    const fakeNameThemes = {
      default: ['Shadow Walker', 'Night Whisper', 'Silent Ghost'],
      space: ['Cosmic Wanderer', 'Star Drifter', 'Nebula Explorer'],
      animals: ['Cyber Fox', 'Digital Wolf', 'Neon Tiger'],
      colors: ['Crimson Shade', 'Azure Phantom', 'Golden Spirit']
    };

    const names = fakeNameThemes[theme] || fakeNameThemes.default;
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    // Add random number to ensure uniqueness
    return `${randomName} ${Math.floor(Math.random() * 999)}`;
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    activeConnections: number;
    activeRooms: number;
    usersConnected: number;
  } {
    return {
      activeConnections: this.socketToUser.size,
      activeRooms: this.roomSubscriptions.size,
      usersConnected: this.connectedUsers.size
    };
  }
}