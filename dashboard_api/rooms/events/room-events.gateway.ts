import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
@WebSocketGateway({ namespace: '/rooms' })
export class RoomEventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private redisSubscriber: Redis;
  private redisPublisher: Redis;

  afterInit() {
    this.redisSubscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    });

    this.redisPublisher = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
    });

    this.redisSubscriber.subscribe('room-updates');

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'room-updates') {
        const data = JSON.parse(message);
        this.server.to(data.roomId).emit('room-update', data);
      }
    });
  }

  async publishRoomUpdate(roomId: string, event: string, data: any) {
    await this.redisPublisher.publish('room-updates', JSON.stringify({
      roomId,
      event,
      data,
      timestamp: new Date().toISOString(),
    }));
  }

  async notifyParticipants(roomId: string, message: string) {
    this.server.to(roomId).emit('notification', { message });
  }
}