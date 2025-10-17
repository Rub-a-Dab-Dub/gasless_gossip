import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dtos/create-chat.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createChat(dto: CreateChatDto) {
    const { senderId, receiverId } = dto;

    const existingChat = await this.chatsRepository.findOne({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
      },
    });

    if (existingChat) return existingChat;

    const sender = await this.usersRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.usersRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) throw new NotFoundException('User not found');

    const chat = this.chatsRepository.create({ sender, receiver });
    return this.chatsRepository.save(chat);
  }

  async getUserChats(userId: number) {
    return this.chatsRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver', 'messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async getChatById(chatId: number) {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['messages', 'sender', 'receiver'],
    });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }
}
