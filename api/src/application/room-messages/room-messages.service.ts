import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomMessage } from './entities/room-message.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoomMessagesService {
  constructor(
    @InjectRepository(RoomMessage)
    private messagesRepository: Repository<RoomMessage>,
    @InjectRepository(Room) private roomsRepository: Repository<Room>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async sendMessage(roomId: number, senderId: number, content: string) {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    const sender = await this.usersRepository.findOne({
      where: { id: senderId },
    });

    if (!room || !sender)
      throw new NotFoundException('Room or sender not found');

    const message = this.messagesRepository.create({ room, sender, content });
    return this.messagesRepository.save(message);
  }

  async getMessages(roomId: number) {
    return this.messagesRepository.find({
      where: { room: { id: roomId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
