import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Hook } from '../entities/hook.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/hooks',
})
export class HooksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HooksGateway.name);
  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('subscribe-to-events')
  handleSubscribeToEvents(
    @MessageBody() data: { eventTypes?: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { eventTypes } = data;
    
    if (eventTypes && eventTypes.length > 0) {
      eventTypes.forEach(eventType => {
        client.join(`event:${eventType}`);
      });
      this.logger.log(`Client ${client.id} subscribed to events: ${eventTypes.join(', ')}`);
    } else {
      client.join('all-events');
      this.logger.log(`Client ${client.id} subscribed to all events`);
    }

    client.emit('subscription-confirmed', { eventTypes: eventTypes || ['all'] });
  }

  @SubscribeMessage('unsubscribe-from-events')
  handleUnsubscribeFromEvents(
    @MessageBody() data: { eventTypes?: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { eventTypes } = data;
    
    if (eventTypes && eventTypes.length > 0) {
      eventTypes.forEach(eventType => {
        client.leave(`event:${eventType}`);
      });
    } else {
      client.leave('all-events');
    }

    client.emit('unsubscription-confirmed', { eventTypes: eventTypes || ['all'] });
  }

  // Broadcast new hook to all subscribers
  broadcastHookCreated(hook: Hook) {
    try {
      // Send to specific event type subscribers
      this.server.to(`event:${hook.eventType}`).emit('hook-created', {
        id: hook.id,
        eventType: hook.eventType,
        data: hook.data,
        stellarTransactionId: hook.stellarTransactionId,
        stellarAccountId: hook.stellarAccountId,
        createdAt: hook.createdAt,
      });

      // Send to all-events subscribers
      this.server.to('all-events').emit('hook-created', {
        id: hook.id,
        eventType: hook.eventType,
        data: hook.data,
        stellarTransactionId: hook.stellarTransactionId,
        stellarAccountId: hook.stellarAccountId,
        createdAt: hook.createdAt,
      });

      this.logger.log(`Broadcasted hook created: ${hook.id} (${hook.eventType})`);
    } catch (error) {
      this.logger.error(`Failed to broadcast hook created: ${error.message}`);
    }
  }

  // Broadcast hook processing updates
  broadcastHookProcessed(hook: Hook) {
    try {
      const updateData = {
        id: hook.id,
        eventType: hook.eventType,
        processed: hook.processed,
        processedAt: hook.processedAt,
        errorMessage: hook.errorMessage,
      };

      this.server.to(`event:${hook.eventType}`).emit('hook-processed', updateData);
      this.server.to('all-events').emit('hook-processed', updateData);

      this.logger.log(`Broadcasted hook processed: ${hook.id}`);
    } catch (error) {
      this.logger.error(`Failed to broadcast hook processed: ${error.message}`);
    }
  }

  // Send real-time stats
  broadcastStats(stats: any) {
    try {
      this.server.to('all-events').emit('hooks-stats', stats);
    } catch (error) {
      this.logger.error(`Failed to broadcast stats: ${error.message}`);
    }
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}