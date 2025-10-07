import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async sendMessage(senderId: number, receiverId: number, content: string) {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    const receiver = await this.userRepo.findOneBy({ id: receiverId });

    if (!sender) throw new NotFoundException('Sender not found');

    if (!receiver) throw new NotFoundException('Receiver not found');

    const message = this.messageRepo.create({ sender, receiver, content });
    return this.messageRepo.save(message);
  }

  async getConversation(userId1: number, userId2: number) {
    return this.messageRepo.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
  }
}
