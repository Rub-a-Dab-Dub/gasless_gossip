import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(RoomMember) private memberRepo: Repository<RoomMember>,
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

  async createRoom(name: string, type: 'public' | 'paid', fee = 0) {
    const room = this.roomRepo.create({ name, type, fee });
    return this.roomRepo.save(room);
  }

  async joinRoom(userId: number, roomId: number) {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    if (room.type === 'paid' && room.fee > 0) {
      // TODO: integrate payment check here
      const hasPaid = true;
      if (!hasPaid)
        throw new ForbiddenException('Payment required to join this room');
    }

    const existing = await this.memberRepo.findOne({
      where: { user: { id: userId }, room: { id: room.id } },
    });

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    if (!existing) {
      const member = this.memberRepo.create({ user, room });
      await this.memberRepo.save(member);
    }

    return { message: `Joined room ${room.name}` };
  }

  async leaveRoom(userId: number, roomId: number) {
    const membership = await this.memberRepo.findOne({
      where: { user: { id: userId }, room: { id: roomId } },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this room');
    }

    await this.memberRepo.delete({ id: membership.id });

    return { message: 'Left room successfully' };
  }
  async sendRoomMessage(userId: number, roomId: number, content: string) {
    const membership = await this.memberRepo.findOne({
      where: { user: { id: userId }, room: { id: roomId } },
      relations: ['room'],
    });

    if (!membership) throw new ForbiddenException('You are not in this room');

    const sender = await this.userRepo.findOneBy({ id: userId });
    if (!sender) throw new NotFoundException('Sender not found');

    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const message = this.messageRepo.create({
      sender,
      room: membership.room,
      content,
    });

    return this.messageRepo.save(message);
  }

  async getRoomMembers(roomId: number) {
    const members = await this.memberRepo.find({
      where: { room: { id: roomId } },
      relations: ['user'],
    });

    return members.map((m) => m.user);
  }

  async getMessages(roomId: number, userId: number, page = 1, limit = 20) {
    const [messages, total] = await this.messageRepo.findAndCount({
      where: { room: { id: roomId } },
      relations: ['sender', 'readBy'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Count unread messages for this user
    const unreadCount = await this.messageRepo
      .createQueryBuilder('m')
      .leftJoin('m.readBy', 'readBy')
      .where('m.roomId = :roomId', { roomId })
      .andWhere('readBy.id IS NULL OR readBy.id != :userId', { userId })
      .getCount();

    return {
      data: messages.reverse(),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async markAsRead(roomId: number, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const unreadMessages = await this.messageRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.readBy', 'readBy')
      .where('m.roomId = :roomId', { roomId })
      .andWhere('readBy.id IS NULL OR readBy.id != :userId', { userId })
      .getMany();

    for (const msg of unreadMessages) {
      msg.readBy.push(user);
      await this.messageRepo.save(msg);
    }

    return { message: `${unreadMessages.length} messages marked as read` };
  }
}
