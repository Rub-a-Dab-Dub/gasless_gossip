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
var AnalyticsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const analytics_entity_1 = require("./analytics.entity");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    analyticRepository;
    eventEmitter;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(analyticRepository, eventEmitter) {
        this.analyticRepository = analyticRepository;
        this.eventEmitter = eventEmitter;
    }
    async createAnalytic(createAnalyticDto) {
        try {
            const analytic = this.analyticRepository.create(createAnalyticDto);
            const savedAnalytic = await this.analyticRepository.save(analytic);
            this.eventEmitter.emit('analytics.created', {
                analytic: savedAnalytic,
                userId: savedAnalytic.userId,
                roomId: savedAnalytic.roomId,
                metricType: savedAnalytic.metricType
            });
            this.logger.log(`Analytics created: ${savedAnalytic.metricType} for user ${savedAnalytic.userId}`);
            return savedAnalytic;
        }
        catch (error) {
            this.logger.error(`Failed to create analytic: ${error.message}`);
            throw error;
        }
    }
    async getUserAnalytics(userId, query) {
        const queryBuilder = this.createBaseQuery()
            .where('analytic.userId = :userId', { userId });
        await this.applyFilters(queryBuilder, query);
        const [data, totalMetrics] = await queryBuilder.getManyAndCount();
        const aggregations = await this.getAggregations(userId, null, query);
        return {
            totalMetrics,
            data: query.groupBy ? await this.groupData(data, query.groupBy) : data,
            aggregations,
            timeRange: {
                startDate: query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: query.endDate || new Date().toISOString()
            }
        };
    }
    async getRoomAnalytics(roomId, query) {
        const queryBuilder = this.createBaseQuery()
            .where('analytic.roomId = :roomId', { roomId });
        await this.applyFilters(queryBuilder, query);
        const [data, totalMetrics] = await queryBuilder.getManyAndCount();
        const aggregations = await this.getAggregations(null, roomId, query);
        return {
            totalMetrics,
            data: query.groupBy ? await this.groupData(data, query.groupBy) : data,
            aggregations,
            timeRange: {
                startDate: query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: query.endDate || new Date().toISOString()
            }
        };
    }
    createBaseQuery() {
        return this.analyticRepository
            .createQueryBuilder('analytic')
            .orderBy('analytic.createdAt', 'DESC');
    }
    async applyFilters(queryBuilder, query) {
        if (query.metricType) {
            queryBuilder.andWhere('analytic.metricType = :metricType', { metricType: query.metricType });
        }
        if (query.startDate) {
            queryBuilder.andWhere('analytic.createdAt >= :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            queryBuilder.andWhere('analytic.createdAt <= :endDate', { endDate: query.endDate });
        }
        queryBuilder
            .limit(query.limit || 50)
            .offset(query.offset || 0);
    }
    async getAggregations(userId, roomId, query) {
        const baseQuery = this.analyticRepository.createQueryBuilder('analytic');
        if (userId) {
            baseQuery.where('analytic.userId = :userId', { userId });
        }
        if (roomId) {
            baseQuery.where('analytic.roomId = :roomId', { roomId });
        }
        if (query?.startDate) {
            baseQuery.andWhere('analytic.createdAt >= :startDate', { startDate: query.startDate });
        }
        if (query?.endDate) {
            baseQuery.andWhere('analytic.createdAt <= :endDate', { endDate: query.endDate });
        }
        const aggregations = await baseQuery
            .select([
            `COUNT(CASE WHEN analytic.metricType = '${analytics_entity_1.MetricType.VISIT}' THEN 1 END) as totalVisits`,
            `COUNT(CASE WHEN analytic.metricType = '${analytics_entity_1.MetricType.TIP}' THEN 1 END) as totalTips`,
            `COUNT(CASE WHEN analytic.metricType = '${analytics_entity_1.MetricType.REACTION}' THEN 1 END) as totalReactions`,
            'SUM(analytic.value) as totalValue'
        ])
            .getRawOne();
        return {
            totalVisits: parseInt(aggregations.totalVisits) || 0,
            totalTips: parseInt(aggregations.totalTips) || 0,
            totalReactions: parseInt(aggregations.totalReactions) || 0,
            totalValue: parseFloat(aggregations.totalValue) || 0
        };
    }
    async groupData(data, groupBy) {
        const grouped = data.reduce((acc, item) => {
            let key;
            const date = new Date(item.createdAt);
            switch (groupBy) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const startOfWeek = new Date(date);
                    startOfWeek.setDate(date.getDate() - date.getDay());
                    key = startOfWeek.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
            }
            if (!acc[key]) {
                acc[key] = {
                    period: key,
                    metrics: {},
                    totalValue: 0,
                    count: 0
                };
            }
            if (!acc[key].metrics[item.metricType]) {
                acc[key].metrics[item.metricType] = 0;
            }
            acc[key].metrics[item.metricType] += 1;
            acc[key].totalValue += Number(item.value);
            acc[key].count += 1;
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
    }
    async trackVisit(userId, roomId, metadata) {
        return this.createAnalytic({
            metricType: analytics_entity_1.MetricType.VISIT,
            userId,
            roomId,
            value: 1,
            metadata
        });
    }
    async trackTip(userId, amount, roomId, metadata) {
        return this.createAnalytic({
            metricType: analytics_entity_1.MetricType.TIP,
            userId,
            roomId,
            value: amount,
            metadata
        });
    }
    async trackReaction(userId, roomId, reactionType) {
        return this.createAnalytic({
            metricType: analytics_entity_1.MetricType.REACTION,
            userId,
            roomId,
            value: 1,
            metadata: { reactionType }
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_entity_1.Analytic)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map