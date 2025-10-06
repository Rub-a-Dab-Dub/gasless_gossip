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
var GiftsGivenService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsGivenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const gift_log_entity_1 = require("./entities/gift-log.entity");
const gift_given_event_1 = require("./events/gift-given.event");
const gift_analytics_event_1 = require("./events/gift-analytics.event");
let GiftsGivenService = GiftsGivenService_1 = class GiftsGivenService {
    giftLogRepository;
    eventEmitter;
    logger = new common_1.Logger(GiftsGivenService_1.name);
    constructor(giftLogRepository, eventEmitter) {
        this.giftLogRepository = giftLogRepository;
        this.eventEmitter = eventEmitter;
    }
    async logGift(createGiftLogDto) {
        try {
            const giftLog = this.giftLogRepository.create(createGiftLogDto);
            const savedLog = await this.giftLogRepository.save(giftLog);
            this.emitGiftEvents(savedLog);
            this.logger.log(`Gift logged: ${savedLog.id} by user ${savedLog.userId}`);
            return savedLog;
        }
        catch (error) {
            this.logger.error('Failed to log gift', error);
            throw error;
        }
    }
    async getUserGiftHistory(userId, query) {
        const { startDate, endDate, page = 1, limit = 20, giftType } = query;
        const queryBuilder = this.giftLogRepository
            .createQueryBuilder('gift_log')
            .where('gift_log.userId = :userId', { userId });
        if (startDate && endDate) {
            queryBuilder.andWhere('gift_log.createdAt BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        else if (startDate) {
            queryBuilder.andWhere('gift_log.createdAt >= :startDate', { startDate });
        }
        else if (endDate) {
            queryBuilder.andWhere('gift_log.createdAt <= :endDate', { endDate });
        }
        if (giftType) {
            queryBuilder.andWhere('gift_log.giftType = :giftType', { giftType });
        }
        const offset = (page - 1) * limit;
        queryBuilder
            .orderBy('gift_log.createdAt', 'DESC')
            .skip(offset)
            .take(limit);
        const [gifts, total] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            gifts,
            total,
            page,
            totalPages,
        };
    }
    async getGiftAnalytics(userId) {
        const totalGifts = await this.giftLogRepository.count({ where: { userId } });
        const valueResult = await this.giftLogRepository
            .createQueryBuilder('gift_log')
            .select('SUM(gift_log.giftValue)', 'total')
            .where('gift_log.userId = :userId', { userId })
            .andWhere('gift_log.giftValue IS NOT NULL')
            .getRawOne();
        const giftsByType = await this.giftLogRepository
            .createQueryBuilder('gift_log')
            .select(['gift_log.giftType as giftType'])
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(gift_log.giftValue)', 'totalValue')
            .where('gift_log.userId = :userId', { userId })
            .groupBy('gift_log.giftType')
            .getRawMany();
        const recentActivity = await this.giftLogRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        return {
            totalGifts,
            totalValue: parseFloat(valueResult?.total || '0'),
            giftsByType: giftsByType.map(item => ({
                giftType: item.giftType || 'Unknown',
                count: parseInt(item.count),
                totalValue: parseFloat(item.totalValue || '0'),
            })),
            recentActivity,
        };
    }
    emitGiftEvents(giftLog) {
        const giftGivenEvent = new gift_given_event_1.GiftGivenEvent(giftLog.giftId, giftLog.userId, giftLog.recipientId, giftLog.giftType, giftLog.giftValue);
        this.eventEmitter.emit('gift.given', giftGivenEvent);
        const senderAnalyticsEvent = new gift_analytics_event_1.GiftAnalyticsEvent(giftLog.userId, 'gift_sent', {
            giftId: giftLog.giftId,
            giftType: giftLog.giftType,
            giftValue: giftLog.giftValue,
            recipientId: giftLog.recipientId,
        });
        this.eventEmitter.emit('analytics.gift', senderAnalyticsEvent);
        if (giftLog.recipientId) {
            const recipientAnalyticsEvent = new gift_analytics_event_1.GiftAnalyticsEvent(giftLog.recipientId, 'gift_received', {
                giftId: giftLog.giftId,
                giftType: giftLog.giftType,
                giftValue: giftLog.giftValue,
                recipientId: giftLog.userId,
            });
            this.eventEmitter.emit('analytics.gift', recipientAnalyticsEvent);
        }
    }
};
exports.GiftsGivenService = GiftsGivenService;
exports.GiftsGivenService = GiftsGivenService = GiftsGivenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gift_log_entity_1.GiftLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], GiftsGivenService);
//# sourceMappingURL=gifts-given.service.js.map