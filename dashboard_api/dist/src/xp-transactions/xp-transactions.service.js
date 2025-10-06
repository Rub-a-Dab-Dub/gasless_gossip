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
var XPTransactionService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPTransactionService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("typeorm");
const xp_transaction_repository_1 = require("./repositories/xp-transaction.repository");
const xp_transaction_entity_1 = require("./entities/xp-transaction.entity");
let XPTransactionService = XPTransactionService_1 = class XPTransactionService {
    xpRepository;
    cacheManager;
    eventEmitter;
    dataSource;
    logger = new common_1.Logger(XPTransactionService_1.name);
    FRAUD_THRESHOLD = 1000;
    CACHE_TTL = 300;
    constructor(xpRepository, cacheManager, eventEmitter, dataSource) {
        this.xpRepository = xpRepository;
        this.cacheManager = cacheManager;
        this.eventEmitter = eventEmitter;
        this.dataSource = dataSource;
    }
    async create(dto) {
        const multiplier = dto.multiplier || 1.0;
        const finalAmount = Math.floor(dto.amount * multiplier);
        const transaction = this.xpRepository.create({
            ...dto,
            multiplier,
            finalAmount,
            status: xp_transaction_entity_1.TransactionStatus.ACTIVE,
        });
        const saved = await this.xpRepository.save(transaction);
        await this.checkFraudAndAlert(dto.userId);
        await this.invalidateUserCache(dto.userId);
        this.eventEmitter.emit('xp.created', { userId: dto.userId, amount: finalAmount });
        return saved;
    }
    async findAll(query) {
        const cacheKey = `xp:query:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const result = await this.xpRepository.findPaginated(query);
        await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);
        return result;
    }
    async findOne(id) {
        const transaction = await this.xpRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`XP Transaction with ID ${id} not found`);
        }
        return transaction;
    }
    async update(id, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existing = await queryRunner.manager.findOne(xp_transaction_entity_1.XPTransaction, {
                where: { id },
                relations: ['user'],
            });
            if (!existing) {
                throw new common_1.NotFoundException(`XP Transaction with ID ${id} not found`);
            }
            const adjustment = queryRunner.manager.create(xp_transaction_entity_1.XPTransaction, {
                userId: existing.userId,
                actionType: existing.actionType,
                amount: dto.amount,
                multiplier: 1.0,
                finalAmount: dto.amount,
                reason: dto.reason,
                adjustedBy: dto.adjustedBy,
                status: xp_transaction_entity_1.TransactionStatus.ACTIVE,
                metadata: {
                    originalTransactionId: id,
                    adjustmentType: 'retroactive',
                },
            });
            const saved = await queryRunner.manager.save(adjustment);
            await queryRunner.commitTransaction();
            await this.invalidateUserCache(existing.userId);
            this.eventEmitter.emit('xp.adjusted', {
                userId: existing.userId,
                amount: dto.amount,
                reason: dto.reason,
            });
            return saved;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async void(id, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = await queryRunner.manager.findOne(xp_transaction_entity_1.XPTransaction, {
                where: { id },
                relations: ['user'],
            });
            if (!transaction) {
                throw new common_1.NotFoundException(`XP Transaction with ID ${id} not found`);
            }
            transaction.status = xp_transaction_entity_1.TransactionStatus.VOIDED;
            transaction.voidedBy = dto.voidedBy;
            transaction.voidReason = dto.voidReason;
            const voided = await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            await this.invalidateUserCache(transaction.userId);
            this.eventEmitter.emit('xp.voided', {
                userId: transaction.userId,
                amount: -transaction.finalAmount,
                reason: dto.voidReason,
            });
            return voided;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getAggregates(startDate, endDate) {
        const cacheKey = `xp:aggregates:${startDate}:${endDate}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const [globalStats, topUsers, distribution, timeline] = await Promise.all([
            this.xpRepository.getGlobalAggregates(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined),
            this.xpRepository.getTopUsers(10),
            this.xpRepository.getDistributionByType(),
            this.xpRepository.getXPTimeline(30),
        ]);
        const result = {
            ...globalStats,
            topUsers,
            distributionByType: distribution,
            timeline,
        };
        await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);
        return result;
    }
    async getUserTotal(userId) {
        const cacheKey = `xp:user:${userId}:total`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached !== null && cached !== undefined)
            return cached;
        const total = await this.xpRepository.getUserTotalXP(userId);
        await this.cacheManager.set(cacheKey, total, this.CACHE_TTL);
        return total;
    }
    async exportToCSV(query, anonymize = false) {
        const { items } = await this.xpRepository.findPaginated({
            ...query,
            limit: 10000,
        });
        return items.map((item) => ({
            id: item.id,
            userId: anonymize ? this.anonymizeUserId(item.userId) : item.userId,
            username: anonymize ? 'Anonymous' : item.user?.username || 'N/A',
            actionType: item.actionType,
            amount: item.amount,
            multiplier: item.multiplier,
            finalAmount: item.finalAmount,
            status: item.status,
            reason: item.reason || '',
            transactionId: item.transactionId || '',
            createdAt: item.createdAt.toISOString(),
        }));
    }
    async checkFraudAndAlert(userId) {
        const xpInLastHour = await this.xpRepository.detectSuspiciousActivity(userId, 1);
        if (xpInLastHour > this.FRAUD_THRESHOLD) {
            this.logger.warn(`Suspicious activity: user ${userId}: ${xpInLastHour} XP in last hour`);
            this.eventEmitter.emit('fraud.detected', {
                userId,
                xpAmount: xpInLastHour,
                threshold: this.FRAUD_THRESHOLD,
                timestamp: new Date(),
            });
        }
    }
    async invalidateUserCache(userId) {
        await this.cacheManager.del(`xp:user:${userId}:total`);
        const keys = await this.cacheManager.store.keys();
        const aggregateKeys = keys.filter((k) => k.startsWith('xp:aggregates:'));
        await Promise.all(aggregateKeys.map((k) => this.cacheManager.del(k)));
    }
    anonymizeUserId(userId) {
        return `user_${userId.substring(0, 8)}***`;
    }
};
exports.XPTransactionService = XPTransactionService;
exports.XPTransactionService = XPTransactionService = XPTransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [xp_transaction_repository_1.XPTransactionRepository, Object, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object, typeorm_1.DataSource])
], XPTransactionService);
//# sourceMappingURL=xp-transactions.service.js.map