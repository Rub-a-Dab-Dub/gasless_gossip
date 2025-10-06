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
var RateLimitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rate_limit_violation_entity_1 = require("../entities/rate-limit-violation.entity");
let RateLimitService = RateLimitService_1 = class RateLimitService {
    violationRepo;
    logger = new common_1.Logger(RateLimitService_1.name);
    constructor(violationRepo) {
        this.violationRepo = violationRepo;
    }
    async logViolation(data) {
        try {
            const violation = this.violationRepo.create({
                userId: data.userId,
                ipAddress: data.ipAddress,
                endpoint: data.endpoint,
                violationType: data.violationType,
                requestCount: data.requestCount,
                limit: data.limit,
                userAgent: data.userAgent,
                metadata: data.metadata,
                status: 'active',
            });
            const savedViolation = await this.violationRepo.save(violation);
            this.logger.warn(`Rate limit violation logged: ${data.endpoint} by ${data.userId || data.ipAddress} (${data.requestCount}/${data.limit})`);
            return savedViolation;
        }
        catch (error) {
            this.logger.error('Failed to log rate limit violation:', error);
            throw error;
        }
    }
    async getViolationsByUser(userId, limit = 50) {
        return this.violationRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getViolationsByIp(ipAddress, limit = 50) {
        return this.violationRepo.find({
            where: { ipAddress },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getViolationsByEndpoint(endpoint, limit = 50) {
        return this.violationRepo.find({
            where: { endpoint },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getRecentViolations(hours = 24, limit = 100) {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        return this.violationRepo.find({
            where: {
                createdAt: { $gte: since },
            },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getViolationStats(hours = 24) {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        const [totalViolations, uniqueUsers, uniqueIps, topEndpoints, topUsers, topIps] = await Promise.all([
            this.violationRepo.count({
                where: { createdAt: { $gte: since } },
            }),
            this.violationRepo
                .createQueryBuilder('violation')
                .select('COUNT(DISTINCT violation.userId)', 'count')
                .where('violation.createdAt >= :since', { since })
                .andWhere('violation.userId IS NOT NULL')
                .getRawOne()
                .then(result => parseInt(result.count) || 0),
            this.violationRepo
                .createQueryBuilder('violation')
                .select('COUNT(DISTINCT violation.ipAddress)', 'count')
                .where('violation.createdAt >= :since', { since })
                .getRawOne()
                .then(result => parseInt(result.count) || 0),
            this.violationRepo
                .createQueryBuilder('violation')
                .select('violation.endpoint', 'endpoint')
                .addSelect('COUNT(*)', 'count')
                .where('violation.createdAt >= :since', { since })
                .groupBy('violation.endpoint')
                .orderBy('count', 'DESC')
                .limit(10)
                .getRawMany(),
            this.violationRepo
                .createQueryBuilder('violation')
                .select('violation.userId', 'userId')
                .addSelect('COUNT(*)', 'count')
                .where('violation.createdAt >= :since', { since })
                .andWhere('violation.userId IS NOT NULL')
                .groupBy('violation.userId')
                .orderBy('count', 'DESC')
                .limit(10)
                .getRawMany(),
            this.violationRepo
                .createQueryBuilder('violation')
                .select('violation.ipAddress', 'ipAddress')
                .addSelect('COUNT(*)', 'count')
                .where('violation.createdAt >= :since', { since })
                .groupBy('violation.ipAddress')
                .orderBy('count', 'DESC')
                .limit(10)
                .getRawMany(),
        ]);
        return {
            totalViolations,
            uniqueUsers,
            uniqueIps,
            topEndpoints: topEndpoints.map(item => ({
                endpoint: item.endpoint,
                count: parseInt(item.count),
            })),
            topUsers: topUsers.map(item => ({
                userId: item.userId,
                count: parseInt(item.count),
            })),
            topIps: topIps.map(item => ({
                ipAddress: item.ipAddress,
                count: parseInt(item.count),
            })),
        };
    }
    async resolveViolation(violationId) {
        await this.violationRepo.update(violationId, { status: 'resolved' });
        this.logger.log(`Rate limit violation ${violationId} resolved`);
    }
    async ignoreViolation(violationId) {
        await this.violationRepo.update(violationId, { status: 'ignored' });
        this.logger.log(`Rate limit violation ${violationId} ignored`);
    }
    async cleanupOldViolations(days = 30) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const result = await this.violationRepo
            .createQueryBuilder()
            .delete()
            .where('createdAt < :cutoffDate', { cutoffDate })
            .execute();
        this.logger.log(`Cleaned up ${result.affected} old rate limit violations`);
        return result.affected || 0;
    }
    async getPerformanceMetrics() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const [recentViolations, totalViolations] = await Promise.all([
            this.violationRepo.count({
                where: { createdAt: { $gte: oneHourAgo } },
            }),
            this.violationRepo.count(),
        ]);
        const violationsPerMinute = recentViolations / 60;
        const successRate = totalViolations > 0 ? (totalViolations - recentViolations) / totalViolations : 1;
        return {
            averageResponseTime: 0,
            violationsPerMinute,
            successRate,
            topViolatingEndpoints: [],
        };
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = RateLimitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rate_limit_violation_entity_1.RateLimitViolation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map