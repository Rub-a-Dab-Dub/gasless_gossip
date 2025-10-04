import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SecretRoom } from '../entities/secret-room.entity';
import { RoomInvitation } from '../entities/room-invitation.entity';
import { RoomMember } from '../entities/room-member.entity';
import { 
  CreateSecretRoomDto, 
  UpdateSecretRoomDto, 
  JoinRoomDto, 
  InviteUserDto,
  SecretRoomDto,
  RoomMemberDto,
  RoomInvitationDto,
  RoomStatsDto,
  UserRoomLimitDto
} from '../dto/secret-room.dto';

@Injectable()
export class SecretRoomsService {
  private readonly logger = new Logger(SecretRoomsService.name);
  private readonly maxRoomsPerUser: number;

  constructor(
    @InjectRepository(SecretRoom)
    private readonly secretRoomRepo: Repository<SecretRoom>,
    @InjectRepository(RoomInvitation)
    private readonly roomInvitationRepo: Repository<RoomInvitation>,
    @InjectRepository(RoomMember)
    private readonly roomMemberRepo: Repository<RoomMember>,
    private readonly configService: ConfigService,
  ) {
    this.maxRoomsPerUser = this.configService.get('MAX_ROOMS_PER_USER', 100);
  }

  async createSecretRoom(dto: CreateSecretRoomDto, creatorId: string): Promise<SecretRoomDto> {
    const startTime = Date.now();
    
    try {
      // Check user room limit
      await this.checkUserRoomLimit(creatorId);

      // Validate expiry date if provided
      if (dto.expiresAt && new Date(dto.expiresAt) <= new Date()) {
        throw new BadRequestException('Expiry date must be in the future');
      }

      // Generate unique room code
      const roomCode = await this.generateUniqueRoomCode();

      // Set default moderation settings with creator privileges
      const moderationSettings = {
        creatorModPrivileges: true,
        autoModeration: dto.settings?.moderationLevel !== 'low',
        voiceModerationQueue: dto.settings?.moderationLevel === 'high',
        maxViolationsBeforeAutoDelete: 3,
        pseudonymDecryption: true,
        ...dto.moderationSettings
      };

      // Initialize reaction metrics
      const reactionMetrics = {
        totalReactions: 0,
        trendingScore: 0,
        lastTrendingUpdate: new Date()
      };

      // Calculate XP multiplier based on room settings
      let xpMultiplier = 0;
      if (dto.isPrivate) xpMultiplier += 25; // 25% bonus for private rooms
      if (dto.enablePseudonyms) xpMultiplier += 15; // 15% bonus for pseudonym rooms
      if (dto.expiresAt) xpMultiplier += 10; // 10% bonus for timed rooms

      // Create secret room
      const secretRoom = this.secretRoomRepo.create({
        creatorId,
        name: dto.name,
        description: dto.description,
        roomCode,
        isPrivate: dto.isPrivate,
        maxUsers: dto.maxUsers || 50,
        category: dto.category,
        theme: dto.theme,
        enablePseudonyms: dto.enablePseudonyms !== false, // Default to true
        fakeNameTheme: dto.fakeNameTheme || 'default',
        expiresAt: dto.expiresAt,
        xpMultiplier,
        settings: dto.settings,
        moderationSettings,
        reactionMetrics,
        metadata: dto.metadata,
        status: 'active',
        isActive: true,
        currentUsers: 0,
      });

      const savedRoom = await this.secretRoomRepo.save(secretRoom);

      // Generate fake name for creator if pseudonyms enabled
      let creatorNickname: string | undefined;
      if (savedRoom.enablePseudonyms) {
        creatorNickname = await this.generateFakeNameForUser(
          savedRoom.id, 
          creatorId, 
          savedRoom.fakeNameTheme
        );
      }

      // Add creator as room owner with special privileges
      await this.addRoomMember(savedRoom.id, creatorId, 'owner', {
        nickname: creatorNickname,
        isAnonymous: savedRoom.enablePseudonyms,
        canInvite: true,
        canModerate: true,
        permissions: {
          canPost: true,
          canReact: true,
          canShare: true,
          canDelete: true,
          canEdit: true,
        },
        metadata: {
          joinSource: 'creation',
          creatorPrivileges: true
        }
      });

      // Schedule room expiry if set
      if (savedRoom.expiresAt) {
        await this.scheduleRoomExpiry(savedRoom.id, savedRoom.expiresAt);
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(`Enhanced secret room created: ${savedRoom.id} (${processingTime}ms)`);

      return this.mapRoomToDto(savedRoom);
    } catch (error) {
      this.logger.error(`Failed to create secret room:`, error);
      throw new BadRequestException('Failed to create secret room');
    }
  }

  async getSecretRoom(roomId: string, userId?: string): Promise<SecretRoomDto> {
    const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Secret room not found');
    }

    // Check access for private rooms
    if (room.isPrivate && userId) {
      const isMember = await this.isRoomMember(roomId, userId);
      if (!isMember) {
        throw new ForbiddenException('Access denied to private room');
      }
    }

    return this.mapRoomToDto(room);
  }

  async getSecretRoomByCode(roomCode: string, userId?: string): Promise<SecretRoomDto> {
    const room = await this.secretRoomRepo.findOne({ where: { roomCode } });
    if (!room) {
      throw new NotFoundException('Secret room not found');
    }

    // Check access for private rooms
    if (room.isPrivate && userId) {
      const isMember = await this.isRoomMember(room.id, userId);
      if (!isMember) {
        throw new ForbiddenException('Access denied to private room');
      }
    }

    return this.mapRoomToDto(room);
  }

  async getUserRooms(userId: string, limit: number = 20): Promise<SecretRoomDto[]> {
    const rooms = await this.secretRoomRepo
      .createQueryBuilder('room')
      .leftJoin('room_members', 'member', 'member.roomId = room.id AND member.userId = :userId', { userId })
      .where('room.creatorId = :userId OR member.userId = :userId', { userId })
      .andWhere('room.status = :status', { status: 'active' })
      .orderBy('room.lastActivityAt', 'DESC')
      .limit(limit)
      .getMany();

    return rooms.map(room => this.mapRoomToDto(room));
  }

  async joinRoom(dto: JoinRoomDto, userId: string): Promise<RoomMemberDto> {
    const room = await this.secretRoomRepo.findOne({ where: { roomCode: dto.roomCode } });
    if (!room) {
      throw new NotFoundException('Secret room not found');
    }

    if (!room.isActive || room.status !== 'active') {
      throw new BadRequestException('Room is not active');
    }

    if (room.currentUsers >= room.maxUsers) {
      throw new BadRequestException('Room is at maximum capacity');
    }

    // Check if user is already a member
    const existingMember = await this.roomMemberRepo.findOne({
      where: { roomId: room.id, userId, status: 'active' }
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this room');
    }

    // Add user as room member
    const member = await this.addRoomMember(room.id, userId, 'member', {
      nickname: dto.nickname,
      isAnonymous: dto.isAnonymous || false,
      canInvite: !room.isPrivate, // Public rooms allow inviting
      canModerate: false,
      permissions: {
        canPost: true,
        canReact: true,
        canShare: true,
        canDelete: false,
        canEdit: false,
      },
    });

    // Update room member count
    await this.updateRoomMemberCount(room.id);

    return this.mapMemberToDto(member);
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    const member = await this.roomMemberRepo.findOne({
      where: { roomId, userId, status: 'active' }
    });

    if (!member) {
      throw new NotFoundException('User is not a member of this room');
    }

    // Update member status
    member.status = 'left';
    member.leftAt = new Date();
    await this.roomMemberRepo.save(member);

    // Update room member count
    await this.updateRoomMemberCount(roomId);

    this.logger.log(`User ${userId} left room ${roomId}`);
  }

  async inviteUser(roomId: string, dto: InviteUserDto, invitedBy: string): Promise<RoomInvitationDto> {
    const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Secret room not found');
    }

    // Check if user has permission to invite
    const inviter = await this.roomMemberRepo.findOne({
      where: { roomId, userId: invitedBy, status: 'active' }
    });

    if (!inviter || !inviter.canInvite) {
      throw new ForbiddenException('User does not have permission to invite others');
    }

    // Generate unique invitation code
    const invitationCode = await this.generateUniqueInvitationCode();

    // Create invitation
    const invitation = this.roomInvitationRepo.create({
      roomId,
      invitedBy,
      invitedUserId: dto.userId,
      invitedEmail: dto.email,
      invitationCode,
      message: dto.message,
      role: dto.role || 'member',
      expiresInDays: dto.expiresInDays || 7,
      expiresAt: new Date(Date.now() + (dto.expiresInDays || 7) * 24 * 60 * 60 * 1000),
    });

    const savedInvitation = await this.roomInvitationRepo.save(invitation);

    return this.mapInvitationToDto(savedInvitation);
  }

  async acceptInvitation(invitationCode: string, userId: string): Promise<RoomMemberDto> {
    const invitation = await this.roomInvitationRepo.findOne({
      where: { invitationCode, status: 'pending' }
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found or expired');
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await this.roomInvitationRepo.save(invitation);
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user is already a member
    const existingMember = await this.roomMemberRepo.findOne({
      where: { roomId: invitation.roomId, userId, status: 'active' }
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this room');
    }

    // Add user as room member
    const member = await this.addRoomMember(invitation.roomId, userId, invitation.role || 'member', {
      canInvite: invitation.role === 'admin' || invitation.role === 'moderator',
      canModerate: invitation.role === 'admin' || invitation.role === 'moderator',
      permissions: {
        canPost: true,
        canReact: true,
        canShare: true,
        canDelete: invitation.role === 'admin',
        canEdit: invitation.role === 'admin',
      },
    });

    // Update invitation status
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    await this.roomInvitationRepo.save(invitation);

    // Update room member count
    await this.updateRoomMemberCount(invitation.roomId);

    return this.mapMemberToDto(member);
  }

  async getRoomMembers(roomId: string, userId: string): Promise<RoomMemberDto[]> {
    // Check if user has access to the room
    const hasAccess = await this.isRoomMember(roomId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to room members');
    }

    const members = await this.roomMemberRepo.find({
      where: { roomId, status: 'active' },
      order: { joinedAt: 'ASC' }
    });

    return members.map(member => this.mapMemberToDto(member));
  }

  async updateRoom(roomId: string, dto: UpdateSecretRoomDto, userId: string): Promise<SecretRoomDto> {
    const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Secret room not found');
    }

    // Check if user is the creator or has admin role
    const member = await this.roomMemberRepo.findOne({
      where: { roomId, userId, status: 'active' }
    });

    if (room.creatorId !== userId && (!member || member.role !== 'admin')) {
      throw new ForbiddenException('Only room creator or admin can update room');
    }

    // Update room
    Object.assign(room, dto);
    const updatedRoom = await this.secretRoomRepo.save(room);

    return this.mapRoomToDto(updatedRoom);
  }

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Secret room not found');
    }

    // Check if user is the creator
    if (room.creatorId !== userId) {
      throw new ForbiddenException('Only room creator can delete room');
    }

    // Soft delete room
    room.status = 'deleted';
    room.isActive = false;
    await this.secretRoomRepo.save(room);

    this.logger.log(`Room ${roomId} deleted by user ${userId}`);
  }

  async getRoomStats(): Promise<RoomStatsDto> {
    const [
      totalRooms,
      activeRooms,
      privateRooms,
      publicRooms,
      totalMembers,
      roomsCreatedToday,
      roomsCreatedThisWeek
    ] = await Promise.all([
      this.secretRoomRepo.count(),
      this.secretRoomRepo.count({ where: { status: 'active' } }),
      this.secretRoomRepo.count({ where: { isPrivate: true, status: 'active' } }),
      this.secretRoomRepo.count({ where: { isPrivate: false, status: 'active' } }),
      this.roomMemberRepo.count({ where: { status: 'active' } }),
      this.secretRoomRepo.count({
        where: {
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          } as any
        }
      }),
      this.secretRoomRepo.count({
        where: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          } as any
        }
      })
    ]);

    const averageMembersPerRoom = totalRooms > 0 ? totalMembers / totalRooms : 0;

    return {
      totalRooms,
      activeRooms,
      privateRooms,
      publicRooms,
      totalMembers,
      averageMembersPerRoom,
      roomsCreatedToday,
      roomsCreatedThisWeek,
    };
  }

  async getUserRoomLimit(userId: string): Promise<UserRoomLimitDto> {
    const currentRooms = await this.secretRoomRepo.count({
      where: { creatorId: userId, status: 'active' }
    });

    return {
      userId,
      currentRooms,
      maxRooms: this.maxRoomsPerUser,
      canCreateMore: currentRooms < this.maxRoomsPerUser,
      remainingSlots: Math.max(0, this.maxRoomsPerUser - currentRooms),
    };
  }

  private async checkUserRoomLimit(userId: string): Promise<void> {
    const limit = await this.getUserRoomLimit(userId);
    if (!limit.canCreateMore) {
      throw new BadRequestException(`User has reached the maximum limit of ${this.maxRoomsPerUser} rooms`);
    }
  }

  private async generateUniqueRoomCode(): Promise<string> {
    let roomCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      roomCode = this.generateRoomCode();
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Failed to generate unique room code');
      }
    } while (await this.secretRoomRepo.findOne({ where: { roomCode } }));

    return roomCode;
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async generateUniqueInvitationCode(): Promise<string> {
    let invitationCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      invitationCode = this.generateInvitationCode();
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Failed to generate unique invitation code');
      }
    } while (await this.roomInvitationRepo.findOne({ where: { invitationCode } }));

    return invitationCode;
  }

  private generateInvitationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async addRoomMember(
    roomId: string, 
    userId: string, 
    role: string, 
    options: any = {}
  ): Promise<RoomMember> {
    const member = this.roomMemberRepo.create({
      roomId,
      userId,
      role,
      status: 'active',
      ...options,
    });

    return this.roomMemberRepo.save(member);
  }

  private async isRoomMember(roomId: string, userId: string): Promise<boolean> {
    const member = await this.roomMemberRepo.findOne({
      where: { roomId, userId, status: 'active' }
    });
    return !!member;
  }

  private async updateRoomMemberCount(roomId: string): Promise<void> {
    const count = await this.roomMemberRepo.count({
      where: { roomId, status: 'active' }
    });

    await this.secretRoomRepo.update(roomId, { currentUsers: count });
  }

  private mapRoomToDto(room: SecretRoom): SecretRoomDto {
    return {
      id: room.id,
      creatorId: room.creatorId,
      name: room.name,
      description: room.description,
      roomCode: room.roomCode,
      isPrivate: room.isPrivate,
      isActive: room.isActive,
      status: room.status,
      maxUsers: room.maxUsers,
      currentUsers: room.currentUsers,
      category: room.category,
      theme: room.theme,
      enablePseudonyms: room.enablePseudonyms,
      fakeNameTheme: room.fakeNameTheme,
      xpMultiplier: room.xpMultiplier,
      settings: room.settings,
      moderationSettings: room.moderationSettings,
      reactionMetrics: room.reactionMetrics,
      metadata: room.metadata,
      lastActivityAt: room.lastActivityAt,
      expiresAt: room.expiresAt,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }

  private mapMemberToDto(member: RoomMember): RoomMemberDto {
    return {
      id: member.id,
      roomId: member.roomId,
      userId: member.userId,
      role: member.role,
      status: member.status,
      nickname: member.nickname,
      displayName: member.displayName,
      isAnonymous: member.isAnonymous,
      canInvite: member.canInvite,
      canModerate: member.canModerate,
      messageCount: member.messageCount,
      reactionCount: member.reactionCount,
      lastSeenAt: member.lastSeenAt,
      lastMessageAt: member.lastMessageAt,
      permissions: member.permissions,
      metadata: member.metadata,
      joinedAt: member.joinedAt,
      updatedAt: member.updatedAt,
    };
  }

  private mapInvitationToDto(invitation: RoomInvitation): RoomInvitationDto {
    return {
      id: invitation.id,
      roomId: invitation.roomId,
      invitedBy: invitation.invitedBy,
      invitedUserId: invitation.invitedUserId,
      invitedEmail: invitation.invitedEmail,
      invitationCode: invitation.invitationCode,
      status: invitation.status,
      message: invitation.message,
      role: invitation.role,
      expiresInDays: invitation.expiresInDays,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      declinedAt: invitation.declinedAt,
      metadata: invitation.metadata,
      createdAt: invitation.createdAt,
    };
  }

  /**
   * Generate fake name for user using pseudonym system
   */
  private async generateFakeNameForUser(roomId: string, userId: string, theme: string): Promise<string> {
    // Generate fake name using the theme
    const fakeNameGenerator = new (await import('./fake-name-generator.service')).FakeNameGeneratorService();
    let fakeName = fakeNameGenerator.generateFakeName(theme);
    
    // Ensure uniqueness in room by checking existing pseudonyms
    let attempts = 0;
    const maxAttempts = 10;
    
    // TODO: Integrate with existing pseudonym service
    // For now, return the generated name
    return fakeName;
  }

  /**
   * Schedule room expiry for automatic deletion
   */
  private async scheduleRoomExpiry(roomId: string, expiresAt: Date): Promise<void> {
    this.logger.log(`Scheduling room ${roomId} for deletion at ${expiresAt.toISOString()}`);
    
    // The actual scheduling is handled by SecretRoomSchedulerService
    // This is just a placeholder for logging/tracking
    
    // TODO: Could integrate with a job queue system like Bull for more precise scheduling
  }

  /**
   * Get most reacted secret rooms for trending/discovery
   */
  async getMostReactedSecretRooms(limit: number = 10, timeWindow?: Date): Promise<SecretRoomDto[]> {
    const query = this.secretRoomRepo
      .createQueryBuilder('room')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('room.status = :status', { status: 'active' })
      .andWhere('(room.expiresAt > :now OR room.expiresAt IS NULL)', { now: new Date() });

    if (timeWindow) {
      query.andWhere('room.lastActivityAt > :timeWindow', { timeWindow });
    }

    const rooms = await query
      .orderBy('COALESCE((room.reactionMetrics->>\'trendingScore\')::numeric, 0)', 'DESC')
      .addOrderBy('room.currentUsers', 'DESC')
      .addOrderBy('room.lastActivityAt', 'DESC')
      .limit(limit)
      .getMany();

    return rooms.map(room => this.mapRoomToDto(room));
  }

  /**
   * Update reaction metrics for a room
   */
  async updateRoomReactionMetrics(roomId: string, reactionType: string, increment: boolean = true): Promise<void> {
    const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
    if (!room) return;

    const weights = { 
      like: 1, 
      love: 2, 
      laugh: 1.5, 
      fire: 2, 
      mind_blown: 2.5,
      angry: 0.5, 
      sad: 0.3 
    };
    
    const weight = weights[reactionType] || 1;
    const change = increment ? weight : -weight;

    const updatedMetrics = {
      ...room.reactionMetrics,
      totalReactions: Math.max(0, (room.reactionMetrics?.totalReactions || 0) + (increment ? 1 : -1)),
      trendingScore: Math.max(0, (room.reactionMetrics?.trendingScore || 0) + change),
      lastTrendingUpdate: new Date()
    };

    await this.secretRoomRepo.update(roomId, { 
      reactionMetrics: updatedMetrics,
      lastActivityAt: new Date()
    });

    this.logger.debug(`Updated reaction metrics for room ${roomId}: ${JSON.stringify(updatedMetrics)}`);
  }

  /**
   * Award XP to room creator for active room
   */
  async awardCreatorXpBonus(roomId: string, reason: string = 'room_activity'): Promise<void> {
    const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
    if (!room) return;

    let xpAmount = 25; // Base bonus XP

    // Apply room-specific multipliers
    if (room.currentUsers >= 10) xpAmount += 15; // Active room bonus
    if (room.reactionMetrics?.trendingScore && room.reactionMetrics.trendingScore > 100) {
      xpAmount += Math.floor(room.reactionMetrics.trendingScore / 20);
    }

    // Apply room XP multiplier
    xpAmount = Math.floor(xpAmount * (1 + (room.xpMultiplier || 0) / 100));

    this.logger.log(`Awarding ${xpAmount} XP to creator ${room.creatorId} for room ${roomId} (${reason})`);
    
    // TODO: Integrate with actual XP service
    // await this.xpService.awardXp(room.creatorId, xpAmount, reason);
  }
}
