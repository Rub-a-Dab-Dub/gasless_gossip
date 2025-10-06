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
exports.RoomTagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_tag_entity_1 = require("./entities/room-tag.entity");
const room_entity_1 = require("../rooms/entities/room.entity");
const room_membership_entity_1 = require("../rooms/entities/room-membership.entity");
let RoomTagsService = class RoomTagsService {
    roomTagRepository;
    roomRepository;
    membershipRepository;
    constructor(roomTagRepository, roomRepository, membershipRepository) {
        this.roomTagRepository = roomTagRepository;
        this.roomRepository = roomRepository;
        this.membershipRepository = membershipRepository;
    }
    async createRoomTag(createRoomTagDto, userId) {
        const { roomId, tagName } = createRoomTagDto;
        await this.validateRoomCreatorPermission(roomId, userId);
        const existingTag = await this.roomTagRepository.findOne({
            where: { roomId, tagName: tagName.toLowerCase() },
        });
        if (existingTag) {
            throw new common_1.ConflictException('Tag already exists for this room');
        }
        const tagCount = await this.roomTagRepository.count({ where: { roomId } });
        if (tagCount >= 10) {
            throw new common_1.BadRequestException('Room cannot have more than 10 tags');
        }
        const roomTag = this.roomTagRepository.create({
            roomId,
            tagName: tagName.toLowerCase(),
            createdBy: userId,
        });
        return this.roomTagRepository.save(roomTag);
    }
    async createMultipleRoomTags(createMultipleTagsDto, userId) {
        const { roomId, tagNames } = createMultipleTagsDto;
        await this.validateRoomCreatorPermission(roomId, userId);
        const existingTags = await this.roomTagRepository.find({
            where: { roomId },
        });
        const existingTagNames = existingTags.map(tag => tag.tagName);
        const newTagNames = tagNames
            .map(name => name.toLowerCase())
            .filter(name => !existingTagNames.includes(name));
        if (existingTags.length + newTagNames.length > 10) {
            throw new common_1.BadRequestException('Room cannot have more than 10 tags');
        }
        if (newTagNames.length === 0) {
            throw new common_1.BadRequestException('All provided tags already exist for this room');
        }
        const roomTags = newTagNames.map(tagName => this.roomTagRepository.create({
            roomId,
            tagName,
            createdBy: userId,
        }));
        return this.roomTagRepository.save(roomTags);
    }
    async deleteRoomTag(deleteRoomTagDto, userId) {
        const { roomId, tagName } = deleteRoomTagDto;
        await this.validateRoomCreatorPermission(roomId, userId);
        const roomTag = await this.roomTagRepository.findOne({
            where: { roomId, tagName: tagName.toLowerCase() },
        });
        if (!roomTag) {
            throw new common_1.NotFoundException('Tag not found for this room');
        }
        await this.roomTagRepository.remove(roomTag);
        return {
            success: true,
            message: 'Tag successfully removed from room',
        };
    }
    async getRoomTags(roomId) {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, isActive: true },
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return this.roomTagRepository.find({
            where: { roomId },
            order: { createdAt: 'ASC' },
        });
    }
    async searchRoomsByTag(searchDto) {
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
        const taggedRooms = await this.enrichRoomsWithTagsAndCounts(rooms);
        return { rooms: taggedRooms, total };
    }
    async searchRoomsByMultipleTags(searchDto) {
        const { tags, limit = 20, offset = 0, operator = 'OR' } = searchDto;
        const lowerCaseTags = tags.map(tag => tag.toLowerCase());
        let query = this.roomRepository
            .createQueryBuilder('room')
            .innerJoin('room_tags', 'tag', 'room.id = tag.room_id')
            .where('room.isActive = :isActive', { isActive: true })
            .andWhere('tag.tagName IN (:...tagNames)', { tagNames: lowerCaseTags });
        if (operator === 'AND') {
            query = query
                .groupBy('room.id')
                .having('COUNT(DISTINCT tag.tagName) = :tagCount', { tagCount: tags.length });
        }
        query = query
            .orderBy('room.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const [rooms, total] = await query.getManyAndCount();
        const taggedRooms = await this.enrichRoomsWithTagsAndCounts(rooms);
        return { rooms: taggedRooms, total };
    }
    async getAllTags() {
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
    async getPopularTags(limit = 20) {
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
    async validateRoomCreatorPermission(roomId, userId) {
        const room = await this.roomRepository.findOne({
            where: { id: roomId, isActive: true },
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const membership = await this.membershipRepository.findOne({
            where: { roomId, userId, isActive: true },
        });
        const hasPermission = room.createdBy === userId ||
            (membership &&
                (membership.role === room_membership_entity_1.MembershipRole.OWNER ||
                    membership.role === room_membership_entity_1.MembershipRole.ADMIN));
        if (!hasPermission) {
            throw new common_1.ForbiddenException('Only room creators, owners, and admins can manage tags');
        }
    }
    async enrichRoomsWithTagsAndCounts(rooms) {
        if (rooms.length === 0)
            return [];
        const roomIds = rooms.map(room => room.id);
        const tags = await this.roomTagRepository.find({
            where: { roomId: (0, typeorm_2.In)(roomIds) },
        });
        const memberCounts = await this.membershipRepository
            .createQueryBuilder('membership')
            .select('membership.roomId', 'roomId')
            .addSelect('COUNT(*)', 'memberCount')
            .where('membership.roomId IN (:...roomIds)', { roomIds })
            .andWhere('membership.isActive = :isActive', { isActive: true })
            .groupBy('membership.roomId')
            .getRawMany();
        const tagsByRoom = tags.reduce((acc, tag) => {
            if (!acc[tag.roomId])
                acc[tag.roomId] = [];
            acc[tag.roomId].push(tag.tagName);
            return acc;
        }, {});
        const memberCountsByRoom = memberCounts.reduce((acc, count) => {
            acc[count.roomId] = parseInt(count.memberCount, 10);
            return acc;
        }, {});
        return rooms.map(room => ({
            ...room,
            tags: tagsByRoom[room.id] || [],
            memberCount: memberCountsByRoom[room.id] || 0,
        }));
    }
};
exports.RoomTagsService = RoomTagsService;
exports.RoomTagsService = RoomTagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_tag_entity_1.RoomTag)),
    __param(1, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(2, (0, typeorm_1.InjectRepository)(room_membership_entity_1.RoomMembership)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoomTagsService);
//# sourceMappingURL=room-tags.service.js.map