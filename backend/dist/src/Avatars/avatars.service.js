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
var AvatarsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const avatar_entity_1 = require("./entities/avatar.entity");
const stellar_nft_service_1 = require("./services/stellar-nft.service");
let AvatarsService = AvatarsService_1 = class AvatarsService {
    avatarRepository;
    stellarNftService;
    logger = new common_1.Logger(AvatarsService_1.name);
    constructor(avatarRepository, stellarNftService) {
        this.avatarRepository = avatarRepository;
        this.stellarNftService = stellarNftService;
    }
    async mintAvatar(userId, createAvatarDto, userStellarPublicKey) {
        const existingAvatar = await this.avatarRepository.findOne({
            where: { userId, isActive: true },
        });
        if (existingAvatar) {
            throw new common_1.ConflictException('User already has an active avatar');
        }
        try {
            const assetCode = this.stellarNftService.generateUniqueAssetCode(userId, createAvatarDto.level);
            const { txId, issuer } = await this.stellarNftService.mintNFT(userStellarPublicKey, assetCode, createAvatarDto);
            const avatar = this.avatarRepository.create({
                userId,
                metadata: createAvatarDto,
                txId,
                stellarAssetCode: assetCode,
                stellarIssuer: issuer,
            });
            const savedAvatar = await this.avatarRepository.save(avatar);
            this.logger.log(`Avatar created for user ${userId}: ${savedAvatar.id}`);
            return this.mapToResponseDto(savedAvatar);
        }
        catch (error) {
            this.logger.error(`Failed to mint avatar for user ${userId}:`, error);
            throw error;
        }
    }
    async getUserAvatar(userId) {
        const avatar = await this.avatarRepository.findOne({
            where: { userId, isActive: true },
        });
        if (!avatar) {
            throw new common_1.NotFoundException('Avatar not found for this user');
        }
        return this.mapToResponseDto(avatar);
    }
    async getAllAvatars() {
        const avatars = await this.avatarRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
        return avatars.map((avatar) => this.mapToResponseDto(avatar));
    }
    async deactivateAvatar(userId) {
        const result = await this.avatarRepository.update({ userId, isActive: true }, { isActive: false });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('No active avatar found for this user');
        }
    }
    mapToResponseDto(avatar) {
        return {
            id: avatar.id,
            userId: avatar.userId,
            metadata: avatar.metadata,
            txId: avatar.txId,
            stellarAssetCode: avatar.stellarAssetCode,
            stellarIssuer: avatar.stellarIssuer,
            isActive: avatar.isActive,
            createdAt: avatar.createdAt,
            updatedAt: avatar.updatedAt,
        };
    }
};
exports.AvatarsService = AvatarsService;
exports.AvatarsService = AvatarsService = AvatarsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(avatar_entity_1.Avatar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_nft_service_1.StellarNftService])
], AvatarsService);
//# sourceMappingURL=avatars.service.js.map