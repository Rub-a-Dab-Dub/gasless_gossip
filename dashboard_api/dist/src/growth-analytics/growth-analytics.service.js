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
exports.GrowthAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
let GrowthAnalyticsService = class GrowthAnalyticsService {
    growthMetricRepository;
    cohortRepository;
    constructor(growthMetricRepository, cohortRepository) {
        this.growthMetricRepository = growthMetricRepository;
        this.cohortRepository = cohortRepository;
    }
    async createMetric(createDto) {
        const metric = this.growthMetricRepository.create(createDto);
        return await this.growthMetricRepository.save(metric);
    }
    async createMetricsBulk(createDtos) {
        const metrics = this.growthMetricRepository.create(createDtos);
        return await this.growthMetricRepository.save(metrics);
    }
    async getMetrics(query) {
        const { userId, cohortId, startDate, endDate, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.growthMetricRepository.createQueryBuilder("metric");
        if (userId) {
            queryBuilder.andWhere("metric.userId = :userId", { userId });
        }
        if (cohortId) {
            queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere("metric.metricDate BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
            });
        }
        else if (startDate) {
            queryBuilder.andWhere("metric.metricDate >= :startDate", { startDate });
        }
        else if (endDate) {
            queryBuilder.andWhere("metric.metricDate <= :endDate", { endDate });
        }
        const [data, total] = await queryBuilder
            .orderBy("metric.metricDate", "DESC")
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateMetric(id, updateDto) {
        const metric = await this.growthMetricRepository.findOne({ where: { id } });
        if (!metric) {
            throw new common_1.NotFoundException(`Growth metric with ID ${id} not found`);
        }
        Object.assign(metric, updateDto);
        return await this.growthMetricRepository.save(metric);
    }
    async getAverageLevels(startDate, endDate, cohortId) {
        const queryBuilder = this.growthMetricRepository
            .createQueryBuilder("metric")
            .select("DATE(metric.metricDate)", "date")
            .addSelect("AVG(metric.userLevel)", "averageLevel")
            .addSelect("COUNT(DISTINCT metric.userId)", "totalUsers")
            .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate });
        if (cohortId) {
            queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId });
            queryBuilder.addSelect("metric.cohortId", "cohortId");
        }
        queryBuilder.groupBy("DATE(metric.metricDate)");
        if (cohortId) {
            queryBuilder.addGroupBy("metric.cohortId");
        }
        queryBuilder.orderBy("date", "ASC");
        const results = await queryBuilder.getRawMany();
        return results.map((row) => ({
            date: row.date,
            averageLevel: Number.parseFloat(row.averageLevel),
            totalUsers: Number.parseInt(row.totalUsers),
            cohortId: row.cohortId,
        }));
    }
    async getUnlockRates(startDate, endDate, cohortId) {
        const queryBuilder = this.growthMetricRepository
            .createQueryBuilder("metric")
            .select("DATE(metric.metricDate)", "date")
            .addSelect("SUM(metric.unlocksCount)", "totalUnlocks")
            .addSelect("COUNT(DISTINCT metric.userId)", "uniqueUsers")
            .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate });
        if (cohortId) {
            queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId });
            queryBuilder.addSelect("metric.cohortId", "cohortId");
        }
        queryBuilder.groupBy("DATE(metric.metricDate)");
        if (cohortId) {
            queryBuilder.addGroupBy("metric.cohortId");
        }
        queryBuilder.orderBy("date", "ASC");
        const results = await queryBuilder.getRawMany();
        return results.map((row) => ({
            date: row.date,
            totalUnlocks: Number.parseInt(row.totalUnlocks),
            uniqueUsers: Number.parseInt(row.uniqueUsers),
            unlockRate: Number.parseInt(row.totalUnlocks) / Number.parseInt(row.uniqueUsers),
            cohortId: row.cohortId,
        }));
    }
    async getDropOffAnalysis(startDate, endDate, cohortId) {
        const queryBuilder = this.growthMetricRepository
            .createQueryBuilder("metric")
            .select("metric.dropOffPoint", "level")
            .addSelect("COUNT(*)", "dropOffCount")
            .where("metric.dropOffPoint IS NOT NULL")
            .andWhere("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate });
        if (cohortId) {
            queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId });
        }
        queryBuilder.groupBy("metric.dropOffPoint").orderBy("level", "ASC");
        const results = await queryBuilder.getRawMany();
        const totalDropOffs = results.reduce((sum, row) => sum + Number.parseInt(row.dropOffCount), 0);
        return results.map((row) => ({
            level: Number.parseInt(row.level),
            dropOffCount: Number.parseInt(row.dropOffCount),
            dropOffPercentage: (Number.parseInt(row.dropOffCount) / totalDropOffs) * 100,
        }));
    }
    async predictPlateaus(cohortId) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const queryBuilder = this.growthMetricRepository
            .createQueryBuilder("metric")
            .select("DATE(metric.metricDate)", "date")
            .addSelect("AVG(metric.userLevel)", "avgLevel")
            .where("metric.metricDate >= :thirtyDaysAgo", { thirtyDaysAgo: thirtyDaysAgo.toISOString().split("T")[0] });
        if (cohortId) {
            queryBuilder.andWhere("metric.cohortId = :cohortId", { cohortId });
        }
        queryBuilder.groupBy("DATE(metric.metricDate)").orderBy("date", "ASC");
        const results = await queryBuilder.getRawMany();
        if (results.length < 7) {
            throw new common_1.BadRequestException("Insufficient data for plateau prediction (minimum 7 days required)");
        }
        const levels = results.map((r) => Number.parseFloat(r.avgLevel));
        const n = levels.length;
        const xValues = Array.from({ length: n }, (_, i) => i);
        const xMean = xValues.reduce((a, b) => a + b, 0) / n;
        const yMean = levels.reduce((a, b) => a + b, 0) / n;
        const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (levels[i] - yMean), 0);
        const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
        const slope = numerator / denominator;
        const variance = levels.reduce((sum, level) => sum + Math.pow(level - yMean, 2), 0) / n;
        const confidence = Math.max(0, Math.min(1, 1 - variance / (yMean * yMean)));
        let trend;
        if (slope > 0.1)
            trend = "increasing";
        else if (slope < -0.1)
            trend = "decreasing";
        else
            trend = "stable";
        const currentMax = Math.max(...levels);
        const plateauLevel = Math.round(currentMax + Math.max(0, slope * 30));
        const daysToPlateauEstimate = slope > 0.1 ? Math.round(30 / slope) : 0;
        return {
            plateauLevel,
            confidence,
            daysToPlateauEstimate,
            trend,
        };
    }
    async getSegmentedLevels(startDate, endDate) {
        const results = await this.growthMetricRepository
            .createQueryBuilder("metric")
            .select("metric.userLevel", "level")
            .addSelect("COUNT(DISTINCT metric.userId)", "userCount")
            .where("metric.metricDate BETWEEN :startDate AND :endDate", { startDate, endDate })
            .groupBy("metric.userLevel")
            .orderBy("level", "ASC")
            .getRawMany();
        const segments = new Map();
        results.forEach((row) => {
            const level = Number.parseInt(row.level);
            const segmentStart = Math.floor(level / 10) * 10;
            const segmentEnd = segmentStart + 9;
            const segmentKey = `${segmentStart}-${segmentEnd}`;
            if (!segments.has(segmentKey)) {
                segments.set(segmentKey, { range: segmentKey, userCount: 0 });
            }
            const segment = segments.get(segmentKey);
            segment.userCount += Number.parseInt(row.userCount);
        });
        return Array.from(segments.values()).sort((a, b) => {
            const aStart = Number.parseInt(a.range.split("-")[0]);
            const bStart = Number.parseInt(b.range.split("-")[0]);
            return aStart - bStart;
        });
    }
    async createCohort(createDto) {
        const cohort = this.cohortRepository.create(createDto);
        return await this.cohortRepository.save(cohort);
    }
    async getCohorts() {
        return await this.cohortRepository.find({ order: { startDate: "DESC" } });
    }
    async getCohort(id) {
        const cohort = await this.cohortRepository.findOne({ where: { id } });
        if (!cohort) {
            throw new common_1.NotFoundException(`Cohort with ID ${id} not found`);
        }
        return cohort;
    }
    async deleteCohort(id) {
        const result = await this.cohortRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Cohort with ID ${id} not found`);
        }
    }
    async getCohortAnalysis(cohortId) {
        const cohort = await this.getCohort(cohortId);
        const metrics = await this.growthMetricRepository
            .createQueryBuilder("metric")
            .select("COUNT(DISTINCT metric.userId)", "totalUsers")
            .addSelect("AVG(metric.userLevel)", "averageLevel")
            .addSelect("SUM(metric.unlocksCount)", "totalUnlocks")
            .addSelect("SUM(CASE WHEN metric.isActive = true THEN 1 ELSE 0 END)", "activeUsers")
            .where("metric.cohortId = :cohortId", { cohortId })
            .getRawOne();
        const totalUsers = Number.parseInt(metrics.totalUsers) || 0;
        const activeUsers = Number.parseInt(metrics.activeUsers) || 0;
        return {
            cohortId: cohort.id,
            cohortName: cohort.cohortName,
            totalUsers,
            averageLevel: Number.parseFloat(metrics.averageLevel) || 0,
            totalUnlocks: Number.parseInt(metrics.totalUnlocks) || 0,
            retentionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
        };
    }
    async getChartData(startDate, endDate, cohortId) {
        const [avgLevels, unlockRates, dropOffs] = await Promise.all([
            this.getAverageLevels(startDate, endDate, cohortId),
            this.getUnlockRates(startDate, endDate, cohortId),
            this.getDropOffAnalysis(startDate, endDate, cohortId),
        ]);
        return {
            averageLevels: {
                type: "line",
                data: avgLevels,
                xAxis: "date",
                yAxis: "averageLevel",
                title: "Average User Levels Over Time",
            },
            unlockRates: {
                type: "line",
                data: unlockRates,
                xAxis: "date",
                yAxis: "unlockRate",
                title: "Unlock Rates Over Time",
            },
            dropOffAnalysis: {
                type: "bar",
                data: dropOffs,
                xAxis: "level",
                yAxis: "dropOffCount",
                title: "Drop-off Points by Level",
            },
        };
    }
};
exports.GrowthAnalyticsService = GrowthAnalyticsService;
exports.GrowthAnalyticsService = GrowthAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function])
], GrowthAnalyticsService);
//# sourceMappingURL=growth-analytics.service.js.map