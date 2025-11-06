import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Chat } from '../chats/entities/chat.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async sendMessage(dto: CreateMessageDto) {
    const chat = await this.chatsRepository.findOne({
      where: { id: dto.chatId },
    });
    const sender = await this.usersRepository.findOne({
      where: { id: dto.senderId },
    });

    if (!chat || !sender) throw new NotFoundException('Chat or user not found');

    const message = this.messagesRepository.create({
      chat,
      sender,
      content: dto.content,
    });

    return this.messagesRepository.save(message);
  }

  async getMessages(chatId: number) {
    return this.messagesRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async markAsRead(messageId: number) {
    const msg = await this.messagesRepository.findOne({
      where: { id: messageId },
    });
    if (!msg) throw new NotFoundException('Message not found');
    msg.isRead = true;
    return this.messagesRepository.save(msg);
  }
}
