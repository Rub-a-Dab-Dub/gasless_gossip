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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GossipService } from './services/gossip.service';
import { 
  CreateGossipIntentDto, 
  UpdateGossipIntentDto, 
  VoteGossipDto, 
  CommentGossipDto,
  GossipBroadcastDto
} from './dto/gossip.dto';

@WebSocketGateway({
  namespace: '/gossip',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class GossipGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(GossipGateway.name);
  private readonly connectedUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private readonly socketToUser = new Map<string, string>(); // socketId -> userId
  private readonly roomSubscriptions = new Map<string, Set<string>>(); // roomId -> Set<socketId>
  private readonly performanceMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    messagesProcessed: 0,
    averageLatency: 0,
  };

  constructor(private readonly gossipService: GossipService) {}

  afterInit(server: Server) {
    this.logger.log('GossipGateway initialized');
    
    // Set up performance monitoring
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000); // Every 30 seconds
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.performanceMetrics.totalConnections++;
    this.performanceMetrics.activeConnections++;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.performanceMetrics.activeConnections--;
    
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      // Remove from user connections
      const userSockets = this.connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(userId);
        }
      }
      
      // Remove from room subscriptions
      for (const [roomId, sockets] of this.roomSubscriptions.entries()) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.roomSubscriptions.delete(roomId);
        }
      }
      
      this.socketToUser.delete(client.id);
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(
    @MessageBody() data: { token: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // In a real implementation, you'd verify the JWT token here
      // For now, we'll trust the userId from the client
      const userId = data.userId;
      
      // Track user connection
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(client.id);
      this.socketToUser.set(client.id, userId);
      
      // Join user to their personal room for direct messages
      client.join(`user:${userId}`);
      
      this.logger.log(`User ${userId} authenticated with socket ${client.id}`);
      
      return { status: 'authenticated', userId };
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      return { status: 'error', message: 'Authentication failed' };
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      return { status: 'error', message: 'Not authenticated' };
    }

    const roomId = data.roomId;
    
    // Join socket to room
    client.join(`room:${roomId}`);
    
    // Track room subscription
    if (!this.roomSubscriptions.has(roomId)) {
      this.roomSubscriptions.set(roomId, new Set());
    }
    this.roomSubscriptions.get(roomId)!.add(client.id);
    
    this.logger.log(`User ${userId} joined room ${roomId}`);
    
    return { status: 'joined', roomId };
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      return { status: 'error', message: 'Not authenticated' };
    }

    const roomId = data.roomId;
    
    // Leave socket from room
    client.leave(`room:${roomId}`);
    
    // Remove from room subscription tracking
    const roomSockets = this.roomSubscriptions.get(roomId);
    if (roomSockets) {
      roomSockets.delete(client.id);
      if (roomSockets.size === 0) {
        this.roomSubscriptions.delete(roomId);
      }
    }
    
    this.logger.log(`User ${userId} left room ${roomId}`);
    
    return { status: 'left', roomId };
  }

  @SubscribeMessage('new_gossip')
  async handleNewGossip(
    @MessageBody() data: CreateGossipIntentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const startTime = Date.now();
    const userId = this.socketToUser.get(client.id);
    
    if (!userId) {
      return { status: 'error', message: 'Not authenticated' };
    }

    try {
      // Create gossip intent
      const intent = await this.gossipService.createIntent(data, userId);
      
      // Broadcast to room
      const broadcast: GossipBroadcastDto = {
        type: 'new_intent',
        intent,
        timestamp: new Date().toISOString(),
        roomId: data.roomId,
      };
      
      this.server.to(`room:${data.roomId}`).emit('gossip_update', broadcast);
      
      // Track performance
      const latency = Date.now() - startTime;
      this.updatePerformanceMetrics(latency);
      
      this.logger.log(`New gossip created by ${userId} in room ${data.roomId} (${latency}ms)`);
      
      return { status: 'success', intent };
    } catch (error) {
      this.logger.error('Failed to create gossip:', error);
      return { status: 'error', message: 'Failed to create gossip' };
    }
  }

  @SubscribeMessage('update_gossip')
  async handleUpdateGossip(
    @MessageBody() data: UpdateGossipIntentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const startTime = Date.now();
    const userId = this.socketToUser.get(client.id);
    
    if (!userId) {
      return { status: 'error', message: 'Not authenticated' };
    }

    try {
      const intent = await this.gossipService.updateIntentStatus(data, userId);
      
      // Broadcast to room
      const broadcast: GossipBroadcastDto = {
        type: 'status_change',
        intent,
        timestamp: new Date().toISOString(),
        roomId: intent.roomId,
      };
      
      this.server.to(`room:${intent.roomId}`).emit('gossip_update', broadcast);
      
      const latency = Date.now() - startTime;
      this.updatePerformanceMetrics(latency);
      
      this.logger.log(`Gossip updated by ${userId} (${latency}ms)`);
      
      return { status: 'success', intent };
    } catch (error) {
      this.logger.error('Failed to update gossip:', error);
      return { status: 'error', message: 'Failed to update gossip' };
    }
  }

  @SubscribeMessage('vote_gossip')
  async handleVoteGossip(
    @MessageBody() data: VoteGossipDto,
    @ConnectedSocket() client: Socket,
  ) {
    const startTime = Date.now();
    const userId = this.socketToUser.get(client.id);
    
    if (!userId) {
      return { status: 'error', message: 'Not authenticated' };
    }

    try {
      const intent = await this.gossipService.voteIntent(data, userId);
      
      // Broadcast to room
      const broadcast: GossipBroadcastDto = {
        type: 'vote',
        intent,
        timestamp: new Date().toISOString(),
        roomId: intent.roomId,
      };
      
      this.server.to(`room:${intent.roomId}`).emit('gossip_update', broadcast);
      
      const latency = Date.now() - startTime;
      this.updatePerformanceMetrics(latency);
      
      this.logger.log(`Gossip voted by ${userId} (${latency}ms)`);
      
      return { status: 'success', intent };
    } catch (error) {
      this.logger.error('Failed to vote gossip:', error);
      return { status: 'error', message: 'Failed to vote gossip' };
    }
  }

  @SubscribeMessage('comment_gossip')
  async handleCommentGossip(
    @MessageBody() data: CommentGossipDto,
    @ConnectedSocket() client: Socket,
  ) {
    const startTime = Date.now();
    const userId = this.socketToUser.get(client.id);
    
    if (!userId) {
      return { status: 'error', message: 'Not authenticated' };
    }

    try {
      const update = await this.gossipService.commentIntent(data, userId);
      const intent = await this.gossipService.getIntentById(data.intentId);
      
      // Broadcast to room
      const broadcast: GossipBroadcastDto = {
        type: 'comment',
        intent,
        update,
        timestamp: new Date().toISOString(),
        roomId: intent.roomId,
      };
      
      this.server.to(`room:${intent.roomId}`).emit('gossip_update', broadcast);
      
      const latency = Date.now() - startTime;
      this.updatePerformanceMetrics(latency);
      
      this.logger.log(`Gossip commented by ${userId} (${latency}ms)`);
      
      return { status: 'success', update };
    } catch (error) {
      this.logger.error('Failed to comment gossip:', error);
      return { status: 'error', message: 'Failed to comment gossip' };
    }
  }

  // Broadcast methods for server-side events
  async broadcastToRoom(roomId: string, event: string, data: any): Promise<void> {
    this.server.to(`room:${roomId}`).emit(event, data);
  }

  async broadcastToUser(userId: string, event: string, data: any): Promise<void> {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  async broadcastToAll(event: string, data: any): Promise<void> {
    this.server.emit(event, data);
  }

  // Performance monitoring
  private updatePerformanceMetrics(latency: number): void {
    this.performanceMetrics.messagesProcessed++;
    this.performanceMetrics.averageLatency = 
      (this.performanceMetrics.averageLatency + latency) / 2;
  }

  private logPerformanceMetrics(): void {
    this.logger.log(`Performance Metrics:
      Active Connections: ${this.performanceMetrics.activeConnections}
      Total Connections: ${this.performanceMetrics.totalConnections}
      Messages Processed: ${this.performanceMetrics.messagesProcessed}
      Average Latency: ${this.performanceMetrics.averageLatency.toFixed(2)}ms
      Rooms with Subscribers: ${this.roomSubscriptions.size}
      Users Connected: ${this.connectedUsers.size}`);
  }

  // Get current connection stats
  getConnectionStats(): {
    activeConnections: number;
    totalConnections: number;
    roomsSubscribed: number;
    usersConnected: number;
    averageLatency: number;
  } {
    return {
      activeConnections: this.performanceMetrics.activeConnections,
      totalConnections: this.performanceMetrics.totalConnections,
      roomsSubscribed: this.roomSubscriptions.size,
      usersConnected: this.connectedUsers.size,
      averageLatency: this.performanceMetrics.averageLatency,
    };
  }
}
