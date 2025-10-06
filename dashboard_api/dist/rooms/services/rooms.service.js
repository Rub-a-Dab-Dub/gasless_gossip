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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const participant_entity_1 = require("./entities/participant.entity");
const message_entity_1 = require("./entities/message.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const room_expiry_service_1 = require("./services/room-expiry.service");
let RoomsService = class RoomsService {
    roomRepo;
    participantRepo;
    messageRepo;
    transactionRepo;
    dataSource;
    expiryService;
    constructor(roomRepo, participantRepo, messageRepo, transactionRepo, dataSource, expiryService) {
        this.roomRepo = roomRepo;
        this.participantRepo = participantRepo;
        this.messageRepo = messageRepo;
        this.transactionRepo = transactionRepo;
        this.dataSource = dataSource;
        this.expiryService = expiryService;
    }
    async create(dto, creatorId) {
        const room = this.roomRepo.create({
            ...dto,
            creatorId,
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        });
        const saved = await this.roomRepo.save(room);
        if (saved.expiresAt) {
            await this.expiryService.scheduleExpiry(saved.id, saved.expiresAt);
        }
        return saved;
    }
    async findAll(query, isModerator) {
        const { page, limit, type, creatorId, activityLevel, expiryWithinDays, search } = query;
        const skip = (page - 1) * limit;
        const qb = this.roomRepo.createQueryBuilder('room')
            .leftJoinAndSelect('room.participants', 'participants')
            .leftJoinAndSelect('room.messages', 'messages')
            .leftJoinAndSelect('room.transactions', 'transactions');
        if (type)
            qb.andWhere('room.type = :type', { type });
        if (creatorId)
            qb.andWhere('room.creatorId = :creatorId', { creatorId });
        if (activityLevel)
            qb.andWhere('room.activityLevel > :activityLevel', { activityLevel });
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
        if (!isModerator) {
            rooms.forEach(room => {
                room.participants = room.participants.map(p => ({
                    ...p,
                    userId: null,
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
    async findOne(id, isModerator) {
        const room = await this.roomRepo.findOne({
            where: { id },
            relations: ['participants', 'messages', 'transactions'],
        });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        if (!isModerator) {
            room.participants = room.participants.map(p => ({
                ...p,
                userId: null,
            }));
        }
        return room;
    }
    async update(id, dto) {
        const room = await this.roomRepo.findOne({ where: { id } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        Object.assign(room, dto);
        if (dto.expiresAt) {
            room.expiresAt = new Date(dto.expiresAt);
            await this.expiryService.scheduleExpiry(room.id, room.expiresAt);
        }
        return this.roomRepo.save(room);
    }
    async bulkUpdate(dto) {
        const startTime = Date.now();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const rooms = await queryRunner.manager.find(room_entity_1.Room, {
                where: { id: (0, typeorm_2.In)(dto.roomIds) },
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async softDelete(id) {
        const room = await this.roomRepo.findOne({ where: { id } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        room.isClosed = true;
        await this.roomRepo.save(room);
    }
    async hardDelete(id) {
        const room = await this.roomRepo.findOne({ where: { id } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        await this.roomRepo.remove(room);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(participant_entity_1.Participant)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(3, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource, typeof (_a = typeof room_expiry_service_1.RoomExpiryService !== "undefined" && room_expiry_service_1.RoomExpiryService) === "function" ? _a : Object])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map