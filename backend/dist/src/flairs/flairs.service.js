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
var FlairsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlairsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flair_entity_1 = require("./entities/flair.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let FlairsService = FlairsService_1 = class FlairsService {
    flairRepository;
    stellarService;
    logger = new common_1.Logger(FlairsService_1.name);
    constructor(flairRepository, stellarService) {
        this.flairRepository = flairRepository;
        this.stellarService = stellarService;
    }
    async addFlairForUser(userId, dto) {
        if (!userId)
            throw new common_1.BadRequestException('Missing userId');
        if (dto.flairType.startsWith('premium:')) {
            const premiumKey = dto.flairType.replace('premium:', '');
            const owns = await this.verifyPremiumFlairOwnership(userId, premiumKey);
            if (!owns) {
                throw new common_1.ForbiddenException('Premium flair not owned on Stellar');
            }
        }
        const flair = this.flairRepository.create({
            userId,
            flairType: dto.flairType,
            metadata: dto.metadata,
        });
        return await this.flairRepository.save(flair);
    }
    async getFlairsForUser(userId) {
        if (!userId)
            throw new common_1.BadRequestException('Missing userId');
        return this.flairRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }
    async verifyPremiumFlairOwnership(userId, premiumKey) {
        try {
            if (typeof this.stellarService.verifyTokenOwnership === 'function') {
                return await this.stellarService.verifyTokenOwnership(userId, premiumKey);
            }
            await this.stellarService.distributeReward(userId, 0);
            this.logger.warn(`verifyTokenOwnership not implemented; allowing premium key '${premiumKey}' for user ${userId} in dev mode.`);
            return true;
        }
        catch (e) {
            this.logger.error('Stellar verification failed', e);
            return false;
        }
    }
};
exports.FlairsService = FlairsService;
exports.FlairsService = FlairsService = FlairsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flair_entity_1.Flair)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService])
], FlairsService);
//# sourceMappingURL=flairs.service.js.map