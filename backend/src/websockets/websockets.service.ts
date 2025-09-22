import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, Notification } from './websockets.entity';
import { Socket } from 'socket.io';

@Injectable()
export class WebSocketsService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async handleChat(data: any, client: Socket) {
    // Save message to PostgreSQL
    const message = this.messageRepo.create({
      roomId!: data.roomId,
      userId: data.userId,
      content: data.content,
    });
    await this.messageRepo.save(message);
    // Broadcast to room
    client.broadcast.to(data.roomId).emit('chat', message);
    return { status: 'sent', message };
  }

  async handleNotification(data: any, client: Socket) {
    // Save notification to PostgreSQL
    const notification = this.notificationRepo.create({
      userId!: data.userId,
      content: data.content,
    });
    await this.notificationRepo.save(notification);
    // Broadcast notification
    client.broadcast.emit('notification', notification);
    return { status: 'notified', notification };
  }
}
