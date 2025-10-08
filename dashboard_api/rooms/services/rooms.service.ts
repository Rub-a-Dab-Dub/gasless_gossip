import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, MoreThan, LessThan, Like } from 'typeorm';
import { Room } from './entities/room.entity';
import { Participant } from './entities/participant.entity';
import { Message } from './entities/message.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { BulkUpdateRoomsDto } from './dto/bulk-update-rooms.dto';
import { RoomExpiryService } from './services/room-expiry.service';
import { RoomAuditService } from './room-audit.service';
import { RoomAuditAction } from '../entities/room-audit.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private dataSource: DataSource,
    private expiryService: RoomExpiryService,
    private roomAuditService: RoomAuditService,
  ) {}

  async create(dto: CreateRoomDto, creatorId: string): Promise<Room> {
    const room = this.roomRepo.create({
      ...dto,
      creatorId,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });

    const saved = await this.roomRepo.save(room);

    if (saved.expiresAt) {
      await this.expiryService.scheduleExpiry(saved.id, saved.expiresAt);
    }

    // Create audit log
    await this.roomAuditService.create({
      roomId: saved.id,
      creatorId,
      action: RoomAuditAction.CREATED,
      metadata: {
        roomType: saved.type,
        settings: dto,
        maxParticipants: dto.maxParticipants,
        xpRequired: dto.xpRequired,
      },
      description: `Room "${saved.name}" created by user ${creatorId}`,
    });

    return saved;
  }

  async findAll(query: QueryRoomsDto, isModerator: boolean) {
    const { page, limit, type, creatorId, activityLevel, expiryWithinDays, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.roomRepo.createQueryBuilder('room')
      .leftJoinAndSelect('room.participants', 'participants')
      .leftJoinAndSelect('room.messages', 'messages')
      .leftJoinAndSelect('room.transactions', 'transactions');

    if (type) qb.andWhere('room.type = :type', { type });
    if (creatorId) qb.andWhere('room.creatorId = :creatorId', { creatorId });
    if (activityLevel) qb.andWhere('room.activityLevel > :activityLevel', { activityLevel });
    
    if (expiryWithinDays) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + expiryWithinDays);
      qb.andWhere('room.expiresAt <= :futureDate', { futureDate });
    }

    if (search) {
      qb.andWhere('room.name LIKE :search', { search: `%${search}%` });
    }

    const [rooms, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Filter real IDs if not moderator
    if (!isModerator) {
      rooms.forEach(room => {
        room.participants = room.participants.map(p => ({
          ...p,
          userId: null, // Hide real ID
        }));
      });
    }

    return {
      data: rooms,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, isModerator: boolean): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['participants', 'messages', 'transactions'],
    });

    if (!room) throw new NotFoundException('Room not found');

    if (!isModerator) {
      room.participants = room.participants.map(p => ({
        ...p,
        userId: null,
      }));
    }

    return room;
  }

  async update(id: string, dto: UpdateRoomDto, moderatorId?: string): Promise<Room> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');

    Object.assign(room, dto);

    if (dto.expiresAt) {
      room.expiresAt = new Date(dto.expiresAt);
      await this.expiryService.scheduleExpiry(room.id, room.expiresAt);
    }

    const updated = await this.roomRepo.save(room);

    // Create audit log
    await this.roomAuditService.create({
      roomId: room.id,
      creatorId: moderatorId || room.creatorId,
      action: RoomAuditAction.UPDATED,
      metadata: {
        roomType: room.type,
        settings: dto,
        maxParticipants: dto.maxParticipants,
        xpRequired: dto.xpRequired,
      },
      description: `Room "${room.name}" updated by ${moderatorId ? 'moderator' : 'creator'} ${moderatorId || room.creatorId}`,
    });

    return updated;
  }

  async bulkUpdate(dto: BulkUpdateRoomsDto): Promise<{ updated: number }> {
    const startTime = Date.now();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const rooms = await queryRunner.manager.find(Room, {
        where: { id: In(dto.roomIds) },
      });

      for (const room of rooms) {
        Object.assign(room, dto.updates);
        if (dto.updates.expiresAt) {
          room.expiresAt = new Date(dto.updates.expiresAt);
        }
      }

      await queryRunner.manager.save(rooms);
      await queryRunner.commitTransaction();

      const duration = Date.now() - startTime;
      if (duration > 5000) {
        console.warn(`Bulk update took ${duration}ms for ${rooms.length} rooms`);
      }

      return { updated: rooms.length };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async softDelete(id: string): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');

    room.isClosed = true;
    await this.roomRepo.save(room);
    
    // Create audit log
    await this.roomAuditService.create({
      roomId: room.id,
      creatorId: room.creatorId,
      action: RoomAuditAction.SUSPENDED,
      metadata: {
        roomType: room.type,
        settings: {},
        reasonForAction: 'Soft delete requested',
      },
      description: `Room "${room.name}" was soft deleted (closed)`,
    });
    
    // Notify via pub/sub (handled in gateway)
  }

  async hardDelete(id: string): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');

    // Create audit log before deletion
    await this.roomAuditService.create({
      roomId: room.id,
      creatorId: room.creatorId,
      action: RoomAuditAction.DELETED,
      metadata: {
        roomType: room.type,
        settings: {},
        reasonForAction: 'Hard delete requested',
      },
      description: `Room "${room.name}" was permanently deleted`,
    });

    await this.roomRepo.remove(room); // Cascade deletes messages, participants, transactions
    
    // Notify participants via events (handled in gateway)
  }
}