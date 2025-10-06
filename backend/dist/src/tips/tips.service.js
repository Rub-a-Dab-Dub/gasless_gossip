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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tip_entity_1 = require("./entities/tip.entity");
const stellar_service_1 = require("./services/stellar.service");
const analytics_service_1 = require("./services/analytics.service");
let TipsService = class TipsService {
    tipsRepository;
    stellarService;
    analyticsService;
    constructor(tipsRepository, stellarService, analyticsService) {
        this.tipsRepository = tipsRepository;
        this.stellarService = stellarService;
        this.analyticsService = analyticsService;
    }
    async createTip(createTipDto, senderId) {
        if (createTipDto.receiverId === senderId) {
            throw new common_1.BadRequestException('Cannot tip yourself');
        }
        const receiver = await this.validateUser(createTipDto.receiverId);
        const sender = await this.validateUser(senderId);
        try {
            const stellarTransaction = await this.stellarService.transferTokens({
                amount: createTipDto.amount,
                receiverPublicKey: receiver.stellarPublicKey || 'mock_receiver_key',
                senderPrivateKey: sender.stellarPrivateKey || 'mock_sender_key',
                memo: `Whisper tip from ${sender.username}`
            });
            const tip = this.tipsRepository.create({
                amount: createTipDto.amount,
                receiverId: createTipDto.receiverId,
                senderId,
                txId: stellarTransaction.hash,
            });
            const savedTip = await this.tipsRepository.save(tip);
            this.analyticsService.emitTipEvent({
                eventType: 'tip_sent',
                userId: senderId,
                amount: createTipDto.amount,
                txId: stellarTransaction.hash,
                timestamp: savedTip.createdAt
            });
            this.analyticsService.emitTipEvent({
                eventType: 'tip_received',
                userId: createTipDto.receiverId,
                amount: createTipDto.amount,
                txId: stellarTransaction.hash,
                timestamp: savedTip.createdAt
            });
            return this.mapToResponseDto(savedTip);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to process tip: ${error.message}`);
        }
    }
    async getUserTips(userId, requestingUserId) {
        const isOwnProfile = userId === requestingUserId;
        const queryBuilder = this.tipsRepository
            .createQueryBuilder('tip')
            .leftJoinAndSelect('tip.sender', 'sender')
            .leftJoinAndSelect('tip.receiver', 'receiver')
            .where('tip.receiverId = :userId OR tip.senderId = :userId', { userId })
            .orderBy('tip.createdAt', 'DESC');
        if (!isOwnProfile) {
            queryBuilder.andWhere('tip.receiverId = :userId', { userId });
        }
        const tips = await queryBuilder.getMany();
        return tips.map(tip => this.mapToResponseDto(tip, !isOwnProfile));
    }
    async getTipAnalytics(userId) {
        const [received, sent] = await Promise.all([
            this.tipsRepository
                .createQueryBuilder('tip')
                .select('COUNT(*)', 'count')
                .addSelect('SUM(tip.amount)', 'total')
                .where('tip.receiverId = :userId', { userId })
                .getRawOne(),
            this.tipsRepository
                .createQueryBuilder('tip')
                .select('COUNT(*)', 'count')
                .addSelect('SUM(tip.amount)', 'total')
                .where('tip.senderId = :userId', { userId })
                .getRawOne()
        ]);
        return {
            totalTipsReceived: parseInt(received.count) || 0,
            totalTipsSent: parseInt(sent.count) || 0,
            totalAmountReceived: parseFloat(received.total) || 0,
            totalAmountSent: parseFloat(sent.total) || 0,
            tipCount: (parseInt(received.count) || 0) + (parseInt(sent.count) || 0)
        };
    }
    async validateUser(userId) {
        const mockUsers = {
            'user1': { id: 'user1', username: 'alice', stellarPublicKey: 'GALICE...', stellarPrivateKey: 'SALICE...' },
            'user2': { id: 'user2', username: 'bob', stellarPublicKey: 'GBOB...', stellarPrivateKey: 'SBOB...' },
            'user3': { id: 'user3', username: 'charlie', stellarPublicKey: 'GCHARLIE...', stellarPrivateKey: 'SCHARLIE...' }
        };
        const user = mockUsers[userId];
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    mapToResponseDto(tip, limitedInfo = false) {
        const response = {
            id: tip.id,
            amount: tip.amount,
            receiverId: tip.receiverId,
            senderId: limitedInfo ? null : tip.senderId,
            txId: tip.txId,
            createdAt: tip.createdAt,
        };
        if (tip.receiver) {
            response.receiver = {
                id: tip.receiver.id,
                username: tip.receiver.username
            };
        }
        if (tip.sender && !limitedInfo) {
            response.sender = {
                id: tip.sender.id,
                username: tip.sender.username
            };
        }
        return response;
    }
};
exports.TipsService = TipsService;
exports.TipsService = TipsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tip_entity_1.Tip)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof stellar_service_1.StellarService !== "undefined" && stellar_service_1.StellarService) === "function" ? _a : Object, typeof (_b = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _b : Object])
], TipsService);
//# sourceMappingURL=tips.service.js.map