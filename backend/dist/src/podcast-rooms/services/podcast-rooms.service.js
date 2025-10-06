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
exports.PodcastRoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const podcast_room_entity_1 = require("../entities/podcast-room.entity");
const stellar_service_1 = require("./stellar.service");
const ipfs_service_1 = require("./ipfs.service");
let PodcastRoomsService = class PodcastRoomsService {
    podcastRoomRepository;
    stellarService;
    ipfsService;
    constructor(podcastRoomRepository, stellarService, ipfsService) {
        this.podcastRoomRepository = podcastRoomRepository;
        this.stellarService = stellarService;
        this.ipfsService = ipfsService;
    }
    async create(createPodcastRoomDto) {
        const existingRoom = await this.podcastRoomRepository.findOne({
            where: { roomId: createPodcastRoomDto.roomId },
        });
        if (existingRoom) {
            throw new common_1.ConflictException('Room ID already exists');
        }
        try {
            const stellarHash = await this.stellarService.generateHash(createPodcastRoomDto.audioHash);
            const metadata = {
                roomId: createPodcastRoomDto.roomId,
                audioHash: createPodcastRoomDto.audioHash,
                creatorId: createPodcastRoomDto.creatorId,
                title: createPodcastRoomDto.title,
                timestamp: new Date().toISOString(),
            };
            await this.stellarService.storeMetadata(metadata);
            const podcastRoom = this.podcastRoomRepository.create({
                ...createPodcastRoomDto,
                stellarHash,
                ipfsHash: `ipfs_${createPodcastRoomDto.audioHash}`,
            });
            return await this.podcastRoomRepository.save(podcastRoom);
        }
        catch (error) {
            const errMsg = error instanceof Error
                ? error.message
                : typeof error === 'string'
                    ? error
                    : JSON.stringify(error);
            throw new common_1.BadRequestException(`Failed to create podcast room: ${errMsg}`);
        }
    }
    async findAll(creatorId) {
        const whereCondition = creatorId
            ? { creatorId, isActive: true }
            : { isActive: true };
        return await this.podcastRoomRepository.find({
            where: whereCondition,
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const podcastRoom = await this.podcastRoomRepository.findOne({
            where: { id, isActive: true },
        });
        if (!podcastRoom) {
            throw new common_1.NotFoundException('Podcast room not found');
        }
        return podcastRoom;
    }
    async findByRoomId(roomId) {
        const podcastRoom = await this.podcastRoomRepository.findOne({
            where: { roomId, isActive: true },
        });
        if (!podcastRoom) {
            throw new common_1.NotFoundException('Podcast room not found');
        }
        return podcastRoom;
    }
    async update(id, updatePodcastRoomDto, requestingUserId) {
        const podcastRoom = await this.findOne(id);
        if (podcastRoom.creatorId !== requestingUserId) {
            throw new common_1.ForbiddenException('Only the creator can update this podcast room');
        }
        Object.assign(podcastRoom, updatePodcastRoomDto);
        return await this.podcastRoomRepository.save(podcastRoom);
    }
    async remove(id, requestingUserId) {
        const podcastRoom = await this.findOne(id);
        if (podcastRoom.creatorId !== requestingUserId) {
            throw new common_1.ForbiddenException('Only the creator can delete this podcast room');
        }
        podcastRoom.isActive = false;
        await this.podcastRoomRepository.save(podcastRoom);
    }
    async verifyAccess(roomId, userId) {
        const room = await this.findByRoomId(roomId);
        return room.isActive;
    }
    async getAudioUrl(roomId) {
        const room = await this.findByRoomId(roomId);
        if (room.ipfsHash) {
            return this.ipfsService.getAudioUrl(room.ipfsHash);
        }
        throw new common_1.NotFoundException('Audio content not found');
    }
};
exports.PodcastRoomsService = PodcastRoomsService;
exports.PodcastRoomsService = PodcastRoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(podcast_room_entity_1.PodcastRoom)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService,
        ipfs_service_1.IPFSService])
], PodcastRoomsService);
//# sourceMappingURL=podcast-rooms.service.js.map