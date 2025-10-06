"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SecretRoomsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretRoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const secret_room_entity_1 = require("../entities/secret-room.entity");
const room_invitation_entity_1 = require("../entities/room-invitation.entity");
const room_member_entity_1 = require("../entities/room-member.entity");
let SecretRoomsService = SecretRoomsService_1 = class SecretRoomsService {
    secretRoomRepo;
    roomInvitationRepo;
    roomMemberRepo;
    configService;
    logger = new common_1.Logger(SecretRoomsService_1.name);
    maxRoomsPerUser;
    constructor(secretRoomRepo, roomInvitationRepo, roomMemberRepo, configService) {
        this.secretRoomRepo = secretRoomRepo;
        this.roomInvitationRepo = roomInvitationRepo;
        this.roomMemberRepo = roomMemberRepo;
        this.configService = configService;
        this.maxRoomsPerUser = this.configService.get('MAX_ROOMS_PER_USER', 100);
    }
    async createSecretRoom(dto, creatorId) {
        const startTime = Date.now();
        try {
            await this.checkUserRoomLimit(creatorId);
            const roomCode = await this.generateUniqueRoomCode();
            const secretRoom = this.secretRoomRepo.create({
                creatorId,
                name: dto.name,
                description: dto.description,
                roomCode,
                isPrivate: dto.isPrivate,
                maxUsers: dto.maxUsers || 50,
                category: dto.category,
                theme: dto.theme,
                settings: dto.settings,
                metadata: dto.metadata,
                status: 'active',
                isActive: true,
                currentUsers: 0,
            });
            const savedRoom = await this.secretRoomRepo.save(secretRoom);
            await this.addRoomMember(savedRoom.id, creatorId, 'owner', {
                canInvite: true,
                canModerate: true,
                permissions: {
                    canPost: true,
                    canReact: true,
                    canShare: true,
                    canDelete: true,
                    canEdit: true,
                },
            });
            const processingTime = Date.now() - startTime;
            this.logger.log(`Secret room created: ${savedRoom.id} (${processingTime}ms)`);
            return this.mapRoomToDto(savedRoom);
        }
        catch (error) {
            this.logger.error(`Failed to create secret room:`, error);
            throw new common_1.BadRequestException('Failed to create secret room');
        }
    }
    async getSecretRoom(roomId, userId) {
        const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Secret room not found');
        }
        if (room.isPrivate && userId) {
            const isMember = await this.isRoomMember(roomId, userId);
            if (!isMember) {
                throw new common_1.ForbiddenException('Access denied to private room');
            }
        }
        return this.mapRoomToDto(room);
    }
    async getSecretRoomByCode(roomCode, userId) {
        const room = await this.secretRoomRepo.findOne({ where: { roomCode } });
        if (!room) {
            throw new common_1.NotFoundException('Secret room not found');
        }
        if (room.isPrivate && userId) {
            const isMember = await this.isRoomMember(room.id, userId);
            if (!isMember) {
                throw new common_1.ForbiddenException('Access denied to private room');
            }
        }
        return this.mapRoomToDto(room);
    }
    async getUserRooms(userId, limit = 20) {
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
    async joinRoom(dto, userId) {
        const room = await this.secretRoomRepo.findOne({ where: { roomCode: dto.roomCode } });
        if (!room) {
            throw new common_1.NotFoundException('Secret room not found');
        }
        if (!room.isActive || room.status !== 'active') {
            throw new common_1.BadRequestException('Room is not active');
        }
        if (room.currentUsers >= room.maxUsers) {
            throw new common_1.BadRequestException('Room is at maximum capacity');
        }
        const existingMember = await this.roomMemberRepo.findOne({
            where: { roomId: room.id, userId, status: 'active' }
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this room');
        }
        const member = await this.addRoomMember(room.id, userId, 'member', {
            nickname: dto.nickname,
            isAnonymous: dto.isAnonymous || false,
            canInvite: !room.isPrivate,
            canModerate: false,
            permissions: {
                canPost: true,
                canReact: true,
                canShare: true,
                canDelete: false,
                canEdit: false,
            },
        });
        await this.updateRoomMemberCount(room.id);
        return this.mapMemberToDto(member);
    }
    async leaveRoom(roomId, userId) {
        const member = await this.roomMemberRepo.findOne({
            where: { roomId, userId, status: 'active' }
        });
        if (!member) {
            throw new common_1.NotFoundException('User is not a member of this room');
        }
        member.status = 'left';
        member.leftAt = new Date();
        await this.roomMemberRepo.save(member);
        await this.updateRoomMemberCount(roomId);
        this.logger.log(`User ${userId} left room ${roomId}`);
    }
    async inviteUser(roomId, dto, invitedBy) {
        const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Secret room not found');
        }
        const inviter = await this.roomMemberRepo.findOne({
            where: { roomId, userId: invitedBy, status: 'active' }
        });
        if (!inviter || !inviter.canInvite) {
            throw new common_1.ForbiddenException('User does not have permission to invite others');
        }
        const invitationCode = await this.generateUniqueInvitationCode();
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
    async acceptInvitation(invitationCode, userId) {
        const invitation = await this.roomInvitationRepo.findOne({
            where: { invitationCode, status: 'pending' }
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found or expired');
        }
        if (invitation.expiresAt && invitation.expiresAt < new Date()) {
            invitation.status = 'expired';
            await this.roomInvitationRepo.save(invitation);
            throw new common_1.BadRequestException('Invitation has expired');
        }
        const existingMember = await this.roomMemberRepo.findOne({
            where: { roomId: invitation.roomId, userId, status: 'active' }
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this room');
        }
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
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date();
        await this.roomInvitationRepo.save(invitation);
        await this.updateRoomMemberCount(invitation.roomId);
        return this.mapMemberToDto(member);
    }
    async getRoomMembers(roomId, userId) {
        const hasAccess = await this.isRoomMember(roomId, userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access denied to room members');
        }
        const members = await this.roomMemberRepo.find({
            where: { roomId, status: 'active' },
            order: { joinedAt: 'ASC' }
        });
        return members.map(member => this.mapMemberToDto(member));
    }
    async updateRoom(roomId, dto, userId) {
        const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Secret room not found');
        }
        const member = await this.roomMemberRepo.findOne({
            where: { roomId, userId, status: 'active' }
        });
        if (room.creatorId !== userId && (!member || member.role !== 'admin')) {
            throw new common_1.ForbiddenException('Only room creator or admin can update room');
        }
        Object.assign(room, dto);
        const updatedRoom = await this.secretRoomRepo.save(room);
        return this.mapRoomToDto(updatedRoom);
    }
    async deleteRoom(roomId, userId) {
        const room = await this.secretRoomRepo.findOne({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Secret room not found');
        }
        if (room.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only room creator can delete room');
        }
        room.status = 'deleted';
        room.isActive = false;
        await this.secretRoomRepo.save(room);
        this.logger.log(`Room ${roomId} deleted by user ${userId}`);
    }
    async getRoomStats() {
        const [totalRooms, activeRooms, privateRooms, publicRooms, totalMembers, roomsCreatedToday, roomsCreatedThisWeek] = await Promise.all([
            this.secretRoomRepo.count(),
            this.secretRoomRepo.count({ where: { status: 'active' } }),
            this.secretRoomRepo.count({ where: { isPrivate: true, status: 'active' } }),
            this.secretRoomRepo.count({ where: { isPrivate: false, status: 'active' } }),
            this.roomMemberRepo.count({ where: { status: 'active' } }),
            this.secretRoomRepo.count({
                where: {
                    createdAt: {
                        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            }),
            this.secretRoomRepo.count({
                where: {
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
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
    async getUserRoomLimit(userId) {
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
    async checkUserRoomLimit(userId) {
        const limit = await this.getUserRoomLimit(userId);
        if (!limit.canCreateMore) {
            throw new common_1.BadRequestException(`User has reached the maximum limit of ${this.maxRoomsPerUser} rooms`);
        }
    }
    async generateUniqueRoomCode() {
        let roomCode;
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
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async generateUniqueInvitationCode() {
        let invitationCode;
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
    generateInvitationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async addRoomMember(roomId, userId, role, options = {}) {
        const member = this.roomMemberRepo.create({
            roomId,
            userId,
            role,
            status: 'active',
            ...options,
        });
        return this.roomMemberRepo.save(member);
    }
    async isRoomMember(roomId, userId) {
        const member = await this.roomMemberRepo.findOne({
            where: { roomId, userId, status: 'active' }
        });
        return !!member;
    }
    async updateRoomMemberCount(roomId) {
        const count = await this.roomMemberRepo.count({
            where: { roomId, status: 'active' }
        });
        await this.secretRoomRepo.update(roomId, { currentUsers: count });
    }
    mapRoomToDto(room) {
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
            settings: room.settings,
            metadata: room.metadata,
            lastActivityAt: room.lastActivityAt,
            expiresAt: room.expiresAt,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
        };
    }
    mapMemberToDto(member) {
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
    mapInvitationToDto(invitation) {
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
};
exports.SecretRoomsService = SecretRoomsService;
exports.SecretRoomsService = SecretRoomsService = SecretRoomsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(secret_room_entity_1.SecretRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(room_invitation_entity_1.RoomInvitation)),
    __param(2, (0, typeorm_1.InjectRepository)(room_member_entity_1.RoomMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], SecretRoomsService);
//# sourceMappingURL=secret-rooms.service.js.map