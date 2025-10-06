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
exports.VoiceDropsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const voice_drop_entity_1 = require("../entities/voice-drop.entity");
const ipfs_service_1 = require("./ipfs.service");
const stellar_service_1 = require("./stellar.service");
let VoiceDropsService = class VoiceDropsService {
    voiceDropRepository;
    ipfsService;
    stellarService;
    constructor(voiceDropRepository, ipfsService, stellarService) {
        this.voiceDropRepository = voiceDropRepository;
        this.ipfsService = ipfsService;
        this.stellarService = stellarService;
    }
    async createVoiceDrop(createVoiceDropDto, audioFile, userId) {
        const ipfsResult = await this.ipfsService.uploadAudioFile(audioFile);
        const stellarResult = await this.stellarService.createStellarHash(ipfsResult.hash, {
            roomId: createVoiceDropDto.roomId,
            creatorId: userId,
            fileName: createVoiceDropDto.fileName,
            duration: createVoiceDropDto.duration,
        });
        const voiceDrop = this.voiceDropRepository.create({
            roomId: createVoiceDropDto.roomId,
            audioHash: ipfsResult.hash,
            stellarHash: stellarResult.hash,
            creatorId: userId,
            fileName: createVoiceDropDto.fileName,
            duration: createVoiceDropDto.duration,
            fileSize: createVoiceDropDto.fileSize,
            mimeType: createVoiceDropDto.mimeType,
        });
        const savedVoiceDrop = await this.voiceDropRepository.save(voiceDrop);
        return this.toResponseDto(savedVoiceDrop);
    }
    async getVoiceDropsByRoom(roomId, query, userId) {
        const { page = 1, limit = 20, creatorId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.voiceDropRepository
            .createQueryBuilder('voiceDrop')
            .where('voiceDrop.roomId = :roomId', { roomId })
            .orderBy('voiceDrop.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (creatorId) {
            queryBuilder.andWhere('voiceDrop.creatorId = :creatorId', { creatorId });
        }
        const [voiceDrops, total] = await queryBuilder.getManyAndCount();
        const data = voiceDrops.map(vd => this.toResponseDto(vd));
        return { data, total, page, limit };
    }
    async getVoiceDropById(id, userId) {
        const voiceDrop = await this.voiceDropRepository.findOne({ where: { id } });
        if (!voiceDrop) {
            throw new common_1.NotFoundException('Voice drop not found');
        }
        return this.toResponseDto(voiceDrop);
    }
    async deleteVoiceDrop(id, userId) {
        const voiceDrop = await this.voiceDropRepository.findOne({ where: { id } });
        if (!voiceDrop) {
            throw new common_1.NotFoundException('Voice drop not found');
        }
        if (voiceDrop.creatorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own voice drops');
        }
        await this.voiceDropRepository.remove(voiceDrop);
    }
    toResponseDto(voiceDrop) {
        return {
            id: voiceDrop.id,
            roomId: voiceDrop.roomId,
            audioHash: voiceDrop.audioHash,
            stellarHash: voiceDrop.stellarHash,
            creatorId: voiceDrop.creatorId,
            fileName: voiceDrop.fileName,
            duration: voiceDrop.duration,
            fileSize: voiceDrop.fileSize,
            mimeType: voiceDrop.mimeType,
            audioUrl: this.ipfsService.getAudioUrl(voiceDrop.audioHash),
            createdAt: voiceDrop.createdAt,
        };
    }
    async validateRoomAccess(roomId, userId) {
        return;
    }
};
exports.VoiceDropsService = VoiceDropsService;
exports.VoiceDropsService = VoiceDropsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(voice_drop_entity_1.VoiceDrop)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ipfs_service_1.IpfsService,
        stellar_service_1.StellarService])
], VoiceDropsService);
//# sourceMappingURL=voice-drops.service.js.map