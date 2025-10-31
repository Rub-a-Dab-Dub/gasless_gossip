import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatPreviewDto } from './dtos/chat-preview.dto';
import { ChatDetailDto } from './dtos/chat-details.dto';
import { MessageDto } from 'src/messages/dtos/message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  // Reusable: select only needed user fields
  private selectMinimalUserFields(qb: SelectQueryBuilder<any>, alias: string) {
    qb.addSelect([
      `${alias}.id`,
      `${alias}.username`,
      `${alias}.photo`,
      `${alias}.title`,
    ]);
    return qb;
  }

  // === CREATE CHAT (or return existing) ===
  async createNewChat(userId: number, username: string): Promise<Chat> {
    const recipient = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username'],
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    const receiverId = recipient.id;

    if (userId === receiverId) {
      throw new NotFoundException('Cannot chat with yourself');
    }

    const existingChat = await this.hasChat(userId, receiverId);
    if (existingChat) return existingChat;

    const chat = this.chatsRepository.create({
      sender: { id: userId } as User,
      receiver: { id: receiverId } as User,
      isGroup: false,
    });

    return this.chatsRepository.save(chat);
  }

  // === CHECK IF CHAT EXISTS ===
  async hasChat(senderId: number, receiverId: number): Promise<Chat | null> {
    let qb = this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .where(
        `(chat.senderId = :senderId AND chat.receiverId = :receiverId) OR ` +
          `(chat.senderId = :receiverId AND chat.receiverId = :senderId)`,
        { senderId, receiverId },
      )
      .andWhere('chat.isGroup = false')
      .select(['chat.id', 'chat.createdAt']);

    qb = this.selectMinimalUserFields(qb, 'sender');
    qb = this.selectMinimalUserFields(qb, 'receiver');

    return qb.orderBy('chat.createdAt', 'DESC').getOne();
  }

  // === GET ALL USER CHATS ===
  async getUserChats(userId: number): Promise<ChatPreviewDto[]> {
    const qb = this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoin('chat.messages', 'messages')
      .leftJoin(
        'chat.messages',
        'unread_messages',
        'unread_messages.senderId != :userId AND unread_messages.isRead = false',
      )
      .where('chat.senderId = :userId OR chat.receiverId = :userId', { userId })
      .andWhere('chat.isGroup = false')
      .select([
        'chat.id',
        'chat.createdAt',
        'sender.id',
        'sender.username',
        'sender.photo',
        'sender.title',
        'receiver.id',
        'receiver.username',
        'receiver.photo',
        'receiver.title',
      ])
      .addSelect((subQb) => {
        return subQb
          .select(
            `jsonb_build_object(
        'chatId', "lastMsg"."chatId",
        'content', "lastMsg".content,
        'createdAt', "lastMsg"."createdAt",
        'senderId', "lastMsg"."senderId"
      )`,
            'last_message_json',
          )
          .from('messages', 'lastMsg')
          .where('"lastMsg"."chatId" = chat.id')
          .orderBy('"lastMsg"."createdAt"', 'DESC')
          .limit(1);
      }, 'last_message_json')
      // Unread count
      .addSelect('COUNT(DISTINCT unread_messages.id)', 'unread_count')
      .groupBy(
        'chat.id, chat.createdAt, sender.id, sender.username, sender.photo, sender.title, receiver.id, receiver.username, receiver.photo, receiver.title',
      )
      .orderBy('MAX(messages."createdAt")', 'DESC')
      .addOrderBy('chat.createdAt', 'DESC');

    const rawResults = await qb.setParameter('userId', userId).getRawMany();

    return rawResults.map((row) => ({
      id: row.chat_id,
      createdAt: row.chat_createdAt,
      sender: {
        id: row.sender_id,
        username: row.sender_username,
        photo: row.sender_photo,
        title: row.sender_title,
      },
      receiver: {
        id: row.receiver_id,
        username: row.receiver_username,
        photo: row.receiver_photo,
        title: row.receiver_title,
      },
      lastMessage: row.last_message_json,
      unreadCount: Number(row.unread_count),
    }));
  }

  // === GET CHAT BY ID ===
  async getChatById(chatId: number, userId?: number): Promise<ChatDetailDto> {
    const qb = this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'messageSender')
      .where('chat.id = :chatId', { chatId })
      .andWhere('chat.isGroup = false');

    if (userId) {
      qb.andWhere('(chat.senderId = :userId OR chat.receiverId = :userId)', {
        userId,
      });
    }
    qb.select([
      'chat.id',
      'chat.createdAt',
      'sender.id',
      'sender.username',
      'sender.photo',
      'sender.title',
      'receiver.id',
      'receiver.username',
      'receiver.photo',
      'receiver.title',
      'messages.id',
      'messages.content',
      'messages.createdAt',
      'messages.isRead',
      'messages.chatId',
      'messages.senderId',
      'messageSender.id',
    ]);

    const chatEntity = await qb.orderBy('messages.createdAt', 'ASC').getOne();

    if (!chatEntity) {
      throw new NotFoundException('Chat not found');
    }

    // ------------------------------------------------------------------
    // 4. Mark unread messages as read (only for the requesting user)
    // ------------------------------------------------------------------
    if (userId) {
      const unreadIds = chatEntity.messages
        .filter((m) => m.senderId !== userId && !m.isRead)
        .map((m) => m.id);

      if (unreadIds.length) {
        await this.chatsRepository.manager
          .createQueryBuilder()
          .update('messages')
          .set({ isRead: true })
          .where('id IN (:...ids)', { ids: unreadIds })
          .execute();
      }
    }

    // ------------------------------------------------------------------
    // 5. Map Entity → DTO (the ONLY place where the type error disappears)
    // ------------------------------------------------------------------
    const dto: ChatDetailDto = {
      id: chatEntity.id,
      createdAt: chatEntity.createdAt,
      sender: {
        id: chatEntity.sender.id,
        username: chatEntity.sender.username,
        photo: chatEntity.sender.photo ?? undefined,
        title: chatEntity.sender.title ?? undefined,
      },
      receiver: {
        id: chatEntity.receiver.id,
        username: chatEntity.receiver.username,
        photo: chatEntity.receiver.photo ?? undefined,
        title: chatEntity.receiver.title ?? undefined,
      },
      messages: chatEntity.messages.map(
        (msg): MessageDto => ({
          id: msg.id,
          chatId: msg.chatId,
          senderId: msg.senderId,
          content: msg.content,
          isRead: msg.isRead,
          createdAt: msg.createdAt,
        }),
      ),
    };

    return dto;
  }

  // === SEARCH BY USERNAME ===
  async searchByUsername(
    username: string,
    userId: number,
  ): Promise<
    {
      id: number;
      username: string;
      photo: string | null;
      title: string | null;
      chat_id: number | null;
    }[]
  > {
    const searchTerm = `%${username.trim()}%`;
    if (searchTerm === '%%') {
      throw new NotFoundException('Invalid search term');
    }

    const results = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin(
        'chats',
        'chat',
        `
          chat.isGroup = false AND
          (
            (chat.senderId = :userId AND chat.receiverId = user.id) OR
            (chat.senderId = user.id AND chat.receiverId = :userId)
          )
        `,
        { userId },
      )
      .where('user.username ILIKE :searchTerm', { searchTerm })
      .andWhere('user.id != :userId', { userId })
      .select([
        'user.id',
        'user.username',
        'user.photo',
        'user.title',
        'chat.id AS chat_id',
      ])
      .orderBy('chat.createdAt', 'DESC')
      .addOrderBy('user.username', 'ASC')
      .getRawMany();

    // if (results.length === 0) {
    //   throw new NotFoundException('User not found');
    // }

    const seen = new Set<number>();
    return results
      .filter((row) => {
        if (seen.has(row.user_id)) return false;
        seen.add(row.user_id);
        return true;
      })
      .map((row) => ({
        id: row.user_id,
        username: row.user_username,
        photo: row.user_photo,
        title: row.user_title,
        chat_id: row.chat_id,
      }));
  }
}
