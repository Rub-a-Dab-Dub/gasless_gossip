import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomType } from './entities/room.entity';
import { RoomMembership, MembershipRole } from './entities/room-membership.entity';
import { User } from '../users/entities/user.entity';
import { XpService } from '../xp/xp.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomMembership)
    private readonly membershipRepository: Repository<RoomMembership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly xpService: XpService,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto, createdBy: string): Promise<Room> {
    const room = this.roomRepository.create({
      ...createRoomDto,
      createdBy,
    });

    const savedRoom = await this.roomRepository.save(room);

    // Automatically add creator as owner
    await this.addMembership(savedRoom.id, createdBy, MembershipRole.OWNER);

    return savedRoom;
  }

  async joinRoom(userId: string, roomId: string, chatGateway?: any): Promise<{ success: boolean; message: string; xpAwarded?: number }> {
    // Check if room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId, isActive: true },
      relations: ['memberships'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is already a member
    const existingMembership = await this.membershipRepository.findOne({
      where: { roomId, userId, isActive: true },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this room');
    }

    // Check capacity
    const currentMemberCount = await this.membershipRepository.count({
      where: { roomId, isActive: true },
    });

    if (currentMemberCount >= room.maxMembers) {
      throw new BadRequestException('Room is at maximum capacity');
    }

    // Check room type specific rules
    await this.validateRoomAccess(room, userId);

    // Get user for level/XP validation
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate user requirements (this would need XP integration)
    // For now, we'll assume user meets requirements

    // Add membership
    await this.addMembership(roomId, userId, MembershipRole.MEMBER);

    // Award XP for joining room
    const xpAwarded = await this.awardJoinRoomXP(userId, room.type);

    // Notify other room members via WebSocket if gateway is available
    if (chatGateway && chatGateway.notifyRoomJoined) {
      await chatGateway.notifyRoomJoined(roomId, userId);
    }

    return {
      success: true,
      message: `Successfully joined room: ${room.name}`,
      xpAwarded,
    };
  }

  async leaveRoom(userId: string, roomId: string, chatGateway?: any): Promise<{ success: boolean; message: string }> {
    // Check if room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId, isActive: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is a member
    const membership = await this.membershipRepository.findOne({
      where: { roomId, userId, isActive: true },
    });

    if (!membership) {
      throw new BadRequestException('User is not a member of this room');
    }

    // Prevent owner from leaving (they must transfer ownership first)
    if (membership.role === MembershipRole.OWNER) {
      throw new BadRequestException('Room owner cannot leave. Transfer ownership first.');
    }

    // Deactivate membership
    membership.isActive = false;
    await this.membershipRepository.save(membership);

    // Notify other room members via WebSocket if gateway is available
    if (chatGateway && chatGateway.notifyRoomLeft) {
      await chatGateway.notifyRoomLeft(roomId, userId);
    }

    return {
      success: true,
      message: `Successfully left room: ${room.name}`,
    };
  }

  async getRoomMembers(roomId: string): Promise<RoomMembership[]> {
    return this.membershipRepository.find({
      where: { roomId, isActive: true },
      relations: ['room'],
      order: { joinedAt: 'DESC' },
    });
  }

  async getUserRooms(userId: string): Promise<Room[]> {
    const memberships = await this.membershipRepository.find({
      where: { userId, isActive: true },
      relations: ['room'],
    });

    return memberships.map(membership => membership.room);
  }

  async getAllRooms(userId?: string): Promise<Room[]> {
    const query = this.roomRepository.createQueryBuilder('room')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('(room.type = :publicType OR room.createdBy = :userId)', {
        publicType: RoomType.PUBLIC,
        userId: userId || '',
      })
      .orderBy('room.createdAt', 'DESC');

    return query.getMany();
  }

  private async addMembership(roomId: string, userId: string, role: MembershipRole = MembershipRole.MEMBER): Promise<RoomMembership> {
    const membership = this.membershipRepository.create({
      roomId,
      userId,
      role,
    });

    return this.membershipRepository.save(membership);
  }

  private async validateRoomAccess(room: Room, userId: string): Promise<void> {
    switch (room.type) {
      case RoomType.PUBLIC:
        // Public rooms are open to all
        break;
      case RoomType.PRIVATE:
        // Private rooms require some form of access (could be level/XP based)
        // For now, we'll allow access but this could be extended
        break;
      case RoomType.INVITE_ONLY:
        // Check if user has an invitation (this would need an invitations system)
        // For now, we'll throw an error
        throw new ForbiddenException('This room is invite-only');
      default:
        throw new BadRequestException('Invalid room type');
    }
  }

  private async awardJoinRoomXP(userId: string, roomType: RoomType): Promise<number> {
    let xpAmount = 0;

    // Different XP amounts based on room type
    switch (roomType) {
      case RoomType.PUBLIC:
        xpAmount = 5; // Base XP for joining public room
        break;
      case RoomType.PRIVATE:
        xpAmount = 10; // More XP for private room
        break;
      case RoomType.INVITE_ONLY:
        xpAmount = 15; // Most XP for exclusive room
        break;
    }

    if (xpAmount > 0) {
      // Add XP using the existing XP service
      await this.xpService.addXp(userId, xpAmount, `Joined ${roomType} room`);
    }

    return xpAmount;
  }
}