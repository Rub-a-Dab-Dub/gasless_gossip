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
var FanGiftingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanGiftingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fan_gift_entity_1 = require("../entities/fan-gift.entity");
const stellar_service_1 = require("./stellar.service");
let FanGiftingService = FanGiftingService_1 = class FanGiftingService {
    fanGiftRepository;
    stellarService;
    logger = new common_1.Logger(FanGiftingService_1.name);
    constructor(fanGiftRepository, stellarService) {
        this.fanGiftRepository = fanGiftRepository;
        this.stellarService = stellarService;
    }
    async createGift(fanId, createGiftDto) {
        try {
            this.logger.log(`Creating gift from fan ${fanId} to creator ${createGiftDto.creatorId}`);
            if (fanId === createGiftDto.creatorId) {
                throw new common_1.BadRequestException('Cannot gift to yourself');
            }
            const fanAccount = {
                publicKey: `GFAN${Math.random().toString(36).substr(2, 52)}`,
                secretKey: 'mock_secret_key'
            };
            const creatorPublicKey = `GCRE${Math.random().toString(36).substr(2, 52)}`;
            const transferResult = await this.stellarService.transferTokens(fanAccount, creatorPublicKey, createGiftDto.amount.toString(), createGiftDto.stellarAsset, createGiftDto.message);
            if (!transferResult.success) {
                throw new common_1.BadRequestException(`Stellar transfer failed: ${transferResult.error}`);
            }
            const fanGift = this.fanGiftRepository.create({
                giftId: createGiftDto.giftId,
                fanId,
                creatorId: createGiftDto.creatorId,
                txId: transferResult.transactionId,
                giftType: createGiftDto.giftType,
                amount: createGiftDto.amount.toString(),
                stellarAsset: createGiftDto.stellarAsset,
                message: createGiftDto.message || null,
                status: 'completed'
            });
            const savedGift = await this.fanGiftRepository.save(fanGift);
            this.logger.log(`Gift created successfully: ${savedGift.id}`);
            await this.triggerAnalyticsHooks(savedGift);
            return savedGift;
        }
        catch (error) {
            this.logger.error(`Failed to create gift: ${error.message}`);
            if (error.transactionId) {
                const failedGift = this.fanGiftRepository.create({
                    giftId: createGiftDto.giftId,
                    fanId,
                    creatorId: createGiftDto.creatorId,
                    txId: error.transactionId,
                    giftType: createGiftDto.giftType,
                    amount: createGiftDto.amount.toString(),
                    stellarAsset: createGiftDto.stellarAsset,
                    message: createGiftDto.message || null,
                    status: 'failed'
                });
                await this.fanGiftRepository.save(failedGift);
            }
            throw error;
        }
    }
    async getGiftHistory(userId, query) {
        const queryBuilder = this.fanGiftRepository
            .createQueryBuilder('gift')
            .where('gift.fanId = :userId OR gift.creatorId = :userId', { userId });
        if (query.status) {
            queryBuilder.andWhere('gift.status = :status', { status: query.status });
        }
        if (query.creatorId) {
            queryBuilder.andWhere('gift.creatorId = :creatorId', { creatorId: query.creatorId });
        }
        const [gifts, total] = await queryBuilder
            .orderBy('gift.createdAt', 'DESC')
            .skip((query.page - 1) * query.limit)
            .take(query.limit)
            .getManyAndCount();
        return {
            data: gifts,
            total,
            page: query.page,
            totalPages: Math.ceil(total / query.limit)
        };
    }
    async getGiftById(giftId) {
        const gift = await this.fanGiftRepository.findOne({ where: { id: giftId } });
        if (!gift) {
            throw new common_1.NotFoundException(`Gift with ID ${giftId} not found`);
        }
        return gift;
    }
    async getGiftStats(userId) {
        const [sentCount, sentSum, receivedCount, receivedSum] = await Promise.all([
            this.fanGiftRepository.count({ where: { fanId: userId, status: 'completed' } }),
            this.fanGiftRepository
                .createQueryBuilder('gift')
                .select('SUM(CAST(gift.amount AS DECIMAL))', 'total')
                .where('gift.fanId = :userId AND gift.status = :status', { userId, status: 'completed' })
                .getRawOne(),
            this.fanGiftRepository.count({ where: { creatorId: userId, status: 'completed' } }),
            this.fanGiftRepository
                .createQueryBuilder('gift')
                .select('SUM(CAST(gift.amount AS DECIMAL))', 'total')
                .where('gift.creatorId = :userId AND gift.status = :status', { userId, status: 'completed' })
                .getRawOne()
        ]);
        return {
            sent: {
                count: sentCount,
                totalAmount: sentSum?.total || '0'
            },
            received: {
                count: receivedCount,
                totalAmount: receivedSum?.total || '0'
            }
        };
    }
    async triggerAnalyticsHooks(gift) {
        try {
            const analyticsEvent = {
                event: 'gift_sent',
                userId: gift.fanId,
                properties: {
                    giftId: gift.giftId,
                    creatorId: gift.creatorId,
                    giftType: gift.giftType,
                    amount: gift.amount,
                    stellarAsset: gift.stellarAsset,
                    txId: gift.txId,
                    timestamp: gift.createdAt
                }
            };
            this.logger.log(`Analytics event triggered: ${JSON.stringify(analyticsEvent)}`);
        }
        catch (error) {
            this.logger.warn(`Failed to trigger analytics hooks: ${error.message}`);
        }
    }
};
exports.FanGiftingService = FanGiftingService;
exports.FanGiftingService = FanGiftingService = FanGiftingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fan_gift_entity_1.FanGift)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService])
], FanGiftingService);
//# sourceMappingURL=fan-gifting.service.js.map