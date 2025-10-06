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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const room_membership_entity_1 = require("./entities/room-membership.entity");
const user_entity_1 = require("../users/entities/user.entity");
const xp_service_1 = require("../xp/xp.service");
let RoomsService = class RoomsService {
    roomRepository;
    membershipRepository;
    userRepository;
    xpService;
    constructor(roomRepository, membershipRepository, userRepository, xpService) {
        this.roomRepository = roomRepository;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.xpService = xpService;
    }
    async createRoom(createRoomDto, createdBy) {
        const room = this.roomRepository.create({
            ...createRoomDto,
            createdBy,
        });
        const savedRoom = await this.roomRepository.save(room);
        await this.addMembership(savedRoom.id, createdBy, room_membership_entity_1.MembershipRole.OWNER);
        return savedRoom;
    }
    async joinRoom(userId, roomId, chatGateway) {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, isActive: true },
            relations: ['memberships'],
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const existingMembership = await this.membershipRepository.findOne({
            where: { roomId, userId, isActive: true },
        });
        if (existingMembership) {
            throw new common_1.BadRequestException('User is already a member of this room');
        }
        const currentMemberCount = await this.membershipRepository.count({
            where: { roomId, isActive: true },
        });
        if (currentMemberCount >= room.maxMembers) {
            throw new common_1.BadRequestException('Room is at maximum capacity');
        }
        await this.validateRoomAccess(room, userId);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.addMembership(roomId, userId, room_membership_entity_1.MembershipRole.MEMBER);
        const xpAwarded = await this.awardJoinRoomXP(userId, room.type);
        if (chatGateway && chatGateway.notifyRoomJoined) {
            await chatGateway.notifyRoomJoined(roomId, userId);
        }
        return {
            success: true,
            message: `Successfully joined room: ${room.name}`,
            xpAwarded,
        };
    }
    async leaveRoom(userId, roomId, chatGateway) {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, isActive: true },
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const membership = await this.membershipRepository.findOne({
            where: { roomId, userId, isActive: true },
        });
        if (!membership) {
            throw new common_1.BadRequestException('User is not a member of this room');
        }
        if (membership.role === room_membership_entity_1.MembershipRole.OWNER) {
            throw new common_1.BadRequestException('Room owner cannot leave. Transfer ownership first.');
        }
        membership.isActive = false;
        await this.membershipRepository.save(membership);
        if (chatGateway && chatGateway.notifyRoomLeft) {
            await chatGateway.notifyRoomLeft(roomId, userId);
        }
        return {
            success: true,
            message: `Successfully left room: ${room.name}`,
        };
    }
    async getRoomMembers(roomId) {
        return this.membershipRepository.find({
            where: { roomId, isActive: true },
            relations: ['room'],
            order: { joinedAt: 'DESC' },
        });
    }
    async getUserRooms(userId) {
        const memberships = await this.membershipRepository.find({
            where: { userId, isActive: true },
            relations: ['room'],
        });
        return memberships.map((membership) => membership.room);
    }
    async getAllRooms(userId) {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .where('room.isActive = :isActive', { isActive: true })
            .andWhere('(room.type = :publicType OR room.createdBy = :userId)', {
            publicType: room_entity_1.RoomType.PUBLIC,
            userId: userId || '',
        })
            .orderBy('room.createdAt', 'DESC');
        return query.getMany();
    }
    async addMembership(roomId, userId, role = room_membership_entity_1.MembershipRole.MEMBER) {
        const membership = this.membershipRepository.create({
            roomId,
            userId,
            role,
        });
        return this.membershipRepository.save(membership);
    }
    async validateRoomAccess(room, userId) {
        switch (room.type) {
            case room_entity_1.RoomType.PUBLIC:
                break;
            case room_entity_1.RoomType.PRIVATE:
                break;
            case room_entity_1.RoomType.INVITE_ONLY:
                throw new common_1.ForbiddenException('This room is invite-only');
            default:
                throw new common_1.BadRequestException('Invalid room type');
        }
    }
    async awardJoinRoomXP(userId, roomType) {
        let xpAmount = 0;
        switch (roomType) {
            case room_entity_1.RoomType.PUBLIC:
                xpAmount = 5;
                break;
            case room_entity_1.RoomType.PRIVATE:
                xpAmount = 10;
                break;
            case room_entity_1.RoomType.INVITE_ONLY:
                xpAmount = 15;
                break;
        }
        if (xpAmount > 0) {
            await this.xpService.addXp(userId, xpAmount, `Joined ${roomType} room`);
        }
        return xpAmount;
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(room_membership_entity_1.RoomMembership)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        xp_service_1.XpService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map