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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const xp_transaction_entity_1 = require("../entities/xp-transaction.entity");
let XPTransactionRepository = class XPTransactionRepository extends typeorm_1.Repository {
    dataSource;
    constructor(dataSource) {
        super(xp_transaction_entity_1.XPTransaction, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findPaginated(query) {
        const { page, limit, userId, actionType, startDate, endDate, minAmount, transactionId, status, } = query;
        const qb = this.createQueryBuilder('xp').leftJoinAndSelect('xp.user', 'user').where('1 = 1');
        if (userId)
            qb.andWhere('xp.userId = :userId', { userId });
        if (actionType)
            qb.andWhere('xp.actionType = :actionType', { actionType });
        if (startDate && endDate) {
            qb.andWhere('xp.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        if (minAmount)
            qb.andWhere('xp.finalAmount >= :minAmount', { minAmount });
        if (transactionId)
            qb.andWhere('xp.transactionId = :transactionId', { transactionId });
        if (status)
            qb.andWhere('xp.status = :status', { status });
        const [items, total] = await qb
            .orderBy('xp.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getUserTotalXP(userId) {
        const result = await this.createQueryBuilder('xp')
            .select('SUM(xp.finalAmount)', 'total')
            .where('xp.userId = :userId', { userId })
            .andWhere('xp.status = :status', { status: xp_transaction_entity_1.TransactionStatus.ACTIVE })
            .getRawOne();
        return parseInt(result?.total || '0', 10);
    }
    async getGlobalAggregates(startDate, endDate) {
        const qb = this.createQueryBuilder('xp').where('xp.status = :status', {
            status: xp_transaction_entity_1.TransactionStatus.ACTIVE,
        });
        if (startDate && endDate) {
            qb.andWhere('xp.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        const [totalXP, transactionCount, avgXP] = await Promise.all([
            qb.clone().select('SUM(xp.finalAmount)', 'total').getRawOne(),
            qb.clone().getCount(),
            qb.clone().select('AVG(xp.finalAmount)', 'avg').getRawOne(),
        ]);
        return {
            totalXP: parseInt(totalXP?.total || '0', 10),
            transactionCount,
            averageXP: parseFloat(avgXP?.avg || '0'),
        };
    }
    async getTopUsers(limit = 10) {
        const results = await this.createQueryBuilder('xp')
            .leftJoin('xp.user', 'user')
            .select('xp.userId', 'userId')
            .addSelect('user.username', 'username')
            .addSelect('SUM(xp.finalAmount)', 'totalXP')
            .where('xp.status = :status', { status: xp_transaction_entity_1.TransactionStatus.ACTIVE })
            .groupBy('xp.userId')
            .addGroupBy('user.username')
            .orderBy('totalXP', 'DESC')
            .limit(limit)
            .getRawMany();
        return results.map((r) => ({
            userId: r.userId,
            username: r.username,
            totalXP: parseInt(r.totalXP, 10),
        }));
    }
    async getDistributionByType() {
        const results = await this.createQueryBuilder('xp')
            .select('xp.actionType', 'actionType')
            .addSelect('SUM(xp.finalAmount)', 'total')
            .where('xp.status = :status', { status: xp_transaction_entity_1.TransactionStatus.ACTIVE })
            .groupBy('xp.actionType')
            .getRawMany();
        const distribution = {};
        results.forEach((r) => {
            distribution[r.actionType] = parseInt(r.total, 10);
        });
        return distribution;
    }
    async getXPTimeline(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const results = await this.createQueryBuilder('xp')
            .select('DATE(xp.createdAt)', 'date')
            .addSelect('SUM(xp.finalAmount)', 'totalXP')
            .where('xp.createdAt >= :startDate', { startDate })
            .andWhere('xp.status = :status', { status: xp_transaction_entity_1.TransactionStatus.ACTIVE })
            .groupBy('DATE(xp.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return results.map((r) => ({
            date: r.date,
            totalXP: parseInt(r.totalXP, 10),
        }));
    }
    async detectSuspiciousActivity(userId, hours = 1) {
        const startTime = new Date();
        startTime.setHours(startTime.getHours() - hours);
        const result = await this.createQueryBuilder('xp')
            .select('SUM(xp.finalAmount)', 'total')
            .where('xp.userId = :userId', { userId })
            .andWhere('xp.createdAt >= :startTime', { startTime })
            .andWhere('xp.status = :status', { status: xp_transaction_entity_1.TransactionStatus.ACTIVE })
            .getRawOne();
        return parseInt(result?.total || '0', 10);
    }
};
exports.XPTransactionRepository = XPTransactionRepository;
exports.XPTransactionRepository = XPTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], XPTransactionRepository);
//# sourceMappingURL=xp-transaction.repository.js.map