import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RoomTag } from './entities/room-tag.entity';
import { Room } from '../rooms/entities/room.entity';
import { RoomMembership, MembershipRole } from '../rooms/entities/room-membership.entity';
import {
  CreateRoomTagDto,
  CreateMultipleRoomTagsDto,
} from './dto/create-room-tag.dto';
import {
  SearchRoomsByTagDto,
  SearchRoomsByMultipleTagsDto,
} from './dto/search-rooms-by-tag.dto';
import { DeleteRoomTagDto } from './dto/delete-room-tag.dto';

export interface TaggedRoom {
  id: string;
  name: string;
  description?: string;
  type: string;
  maxMembers: number;
  createdBy: string;
  isActive: boolean;
  minLevel: number;
  minXp: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  memberCount?: number;
}

@Injectable()
export class RoomTagsService {
  constructor(
    @InjectRepository(RoomTag)
    private readonly roomTagRepository: Repository<RoomTag>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomMembership)
    private readonly membershipRepository: Repository<RoomMembership>,
  ) {}

  async createRoomTag(
    createRoomTagDto: CreateRoomTagDto,
    userId: string,
  ): Promise<RoomTag> {
    const { roomId, tagName } = createRoomTagDto;

    // Validate room exists and user has permission
    await this.validateRoomCreatorPermission(roomId, userId);

    // Check if tag already exists for this room
    const existingTag = await this.roomTagRepository.findOne({
      where: { roomId, tagName: tagName.toLowerCase() },
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists for this room');
    }

    // Check tag count limit (max 10 tags per room)
    const tagCount = await this.roomTagRepository.count({ where: { roomId } });
    if (tagCount >= 10) {
      throw new BadRequestException('Room cannot have more than 10 tags');
    }

    const roomTag = this.roomTagRepository.create({
      roomId,
      tagName: tagName.toLowerCase(),
      createdBy: userId,
    });

    return this.roomTagRepository.save(roomTag);
  }

  async createMultipleRoomTags(
    createMultipleTagsDto: CreateMultipleRoomTagsDto,
    userId: string,
  ): Promise<RoomTag[]> {
    const { roomId, tagNames } = createMultipleTagsDto;

    // Validate room exists and user has permission
    await this.validateRoomCreatorPermission(roomId, userId);

    // Get existing tags for this room
    const existingTags = await this.roomTagRepository.find({
      where: { roomId },
    });

    const existingTagNames = existingTags.map(tag => tag.tagName);
    const newTagNames = tagNames
      .map(name => name.toLowerCase())
      .filter(name => !existingTagNames.includes(name));

    // Check if adding new tags would exceed limit
    if (existingTags.length + newTagNames.length > 10) {
      throw new BadRequestException('Room cannot have more than 10 tags');
    }

    if (newTagNames.length === 0) {
      throw new BadRequestException('All provided tags already exist for this room');
    }

    const roomTags = newTagNames.map(tagName =>
      this.roomTagRepository.create({
        roomId,
        tagName,
        createdBy: userId,
      }),
    );

    return this.roomTagRepository.save(roomTags);
  }

  async deleteRoomTag(
    deleteRoomTagDto: DeleteRoomTagDto,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const { roomId, tagName } = deleteRoomTagDto;

    // Validate room exists and user has permission
    await this.validateRoomCreatorPermission(roomId, userId);

    const roomTag = await this.roomTagRepository.findOne({
      where: { roomId, tagName: tagName.toLowerCase() },
    });

    if (!roomTag) {
      throw new NotFoundException('Tag not found for this room');
    }

    await this.roomTagRepository.remove(roomTag);

    return {
      success: true,
      message: 'Tag successfully removed from room',
    };
  }

  async getRoomTags(roomId: string): Promise<RoomTag[]> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, isActive: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.roomTagRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }

  async searchRoomsByTag(
    searchDto: SearchRoomsByTagDto,
  ): Promise<{ rooms: TaggedRoom[]; total: number }> {
    const { tag, limit = 20, offset = 0 } = searchDto;

    const query = this.roomRepository
      .createQueryBuilder('room')
      .innerJoin('room_tags', 'tag', 'room.id = tag.room_id')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('tag.tagName = :tagName', { tagName: tag.toLowerCase() })
      .orderBy('room.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [rooms, total] = await query.getManyAndCount();

    // Fetch tags and member counts for each room
    const taggedRooms = await this.enrichRoomsWithTagsAndCounts(rooms);

    return { rooms: taggedRooms, total };
  }

  async searchRoomsByMultipleTags(
    searchDto: SearchRoomsByMultipleTagsDto,
  ): Promise<{ rooms: TaggedRoom[]; total: number }> {
    const { tags, limit = 20, offset = 0, operator = 'OR' } = searchDto;
    const lowerCaseTags = tags.map(tag => tag.toLowerCase());

    let query = this.roomRepository
      .createQueryBuilder('room')
      .innerJoin('room_tags', 'tag', 'room.id = tag.room_id')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('tag.tagName IN (:...tagNames)', { tagNames: lowerCaseTags });

    if (operator === 'AND') {
      // For AND operation, use HAVING to ensure all tags are present
      query = query
        .groupBy('room.id')
        .having('COUNT(DISTINCT tag.tagName) = :tagCount', { tagCount: tags.length });
    }

    query = query
      .orderBy('room.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [rooms, total] = await query.getManyAndCount();

    // Fetch tags and member counts for each room
    const taggedRooms = await this.enrichRoomsWithTagsAndCounts(rooms);

    return { rooms: taggedRooms, total };
  }

  async getAllTags(): Promise<{ tagName: string; roomCount: number }[]> {
    const result = await this.roomTagRepository
      .createQueryBuilder('tag')
      .select('tag.tagName', 'tagName')
      .addSelect('COUNT(*)', 'roomCount')
      .innerJoin('tag.room', 'room')
      .where('room.isActive = :isActive', { isActive: true })
      .groupBy('tag.tagName')
      .orderBy('COUNT(*)', 'DESC')
      .addOrderBy('tag.tagName', 'ASC')
      .getRawMany();

    return result.map(item => ({
      tagName: item.tagName,
      roomCount: parseInt(item.roomCount, 10),
    }));
  }

  async getPopularTags(limit: number = 20): Promise<{ tagName: string; roomCount: number }[]> {
    const result = await this.roomTagRepository
      .createQueryBuilder('tag')
      .select('tag.tagName', 'tagName')
      .addSelect('COUNT(*)', 'roomCount')
      .innerJoin('tag.room', 'room')
      .where('room.isActive = :isActive', { isActive: true })
      .groupBy('tag.tagName')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(item => ({
      tagName: item.tagName,
      roomCount: parseInt(item.roomCount, 10),
    }));
  }

  private async validateRoomCreatorPermission(
    roomId: string,
    userId: string,
  ): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, isActive: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is the room creator or has admin/owner role
    const membership = await this.membershipRepository.findOne({
      where: { roomId, userId, isActive: true },
    });

    const hasPermission =
      room.createdBy === userId ||
      (membership && 
       (membership.role === MembershipRole.OWNER || 
        membership.role === MembershipRole.ADMIN));

    if (!hasPermission) {
      throw new ForbiddenException(
        'Only room creators, owners, and admins can manage tags',
      );
    }
  }

  private async enrichRoomsWithTagsAndCounts(rooms: Room[]): Promise<TaggedRoom[]> {
    if (rooms.length === 0) return [];

    const roomIds = rooms.map(room => room.id);

    // Fetch all tags for these rooms
    const tags = await this.roomTagRepository.find({
      where: { roomId: In(roomIds) },
    });

    // Fetch member counts for these rooms
    const memberCounts = await this.membershipRepository
      .createQueryBuilder('membership')
      .select('membership.roomId', 'roomId')
      .addSelect('COUNT(*)', 'memberCount')
      .where('membership.roomId IN (:...roomIds)', { roomIds })
      .andWhere('membership.isActive = :isActive', { isActive: true })
      .groupBy('membership.roomId')
      .getRawMany();

    // Create lookup maps
    const tagsByRoom = tags.reduce((acc, tag) => {
      if (!acc[tag.roomId]) acc[tag.roomId] = [];
      acc[tag.roomId].push(tag.tagName);
      return acc;
    }, {} as Record<string, string[]>);

    const memberCountsByRoom = memberCounts.reduce((acc, count) => {
      acc[count.roomId] = parseInt(count.memberCount, 10);
      return acc;
    }, {} as Record<string, number>);

    // Enrich rooms with tags and member counts
    return rooms.map(room => ({
      ...room,
      tags: tagsByRoom[room.id] || [],
      memberCount: memberCountsByRoom[room.id] || 0,
    }));
  }
}