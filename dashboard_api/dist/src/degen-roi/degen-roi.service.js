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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenRoiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const degen_roi_entity_1 = require("./entities/degen-roi.entity");
let DegenRoiService = class DegenRoiService {
    roiRepo;
    LOSS_THRESHOLD = 10000;
    ANOMALY_THRESHOLD = 0.3;
    constructor(roiRepo) {
        this.roiRepo = roiRepo;
    }
    async createWinRate(dto) {
        const winRate = (dto.winningBets / dto.totalBets) * 100;
        const roiPercentage = ((dto.totalReturned - dto.totalWagered) / dto.totalWagered) * 100;
        const avgBetSize = dto.totalWagered / dto.totalBets;
        const isAnomaly = await this.detectAnomaly(dto.roomCategory, roiPercentage);
        const entity = this.roiRepo.create({
            ...dto,
            winRate,
            roiPercentage,
            avgBetSize,
            isAnomaly,
        });
        const saved = await this.roiRepo.save(entity);
        if (dto.totalReturned < dto.totalWagered) {
            await this.checkLossAlert(saved);
        }
        return saved;
    }
    async getRiskMetrics(query) {
        const qb = this.roiRepo.createQueryBuilder('roi');
        if (query.roomCategory) {
            qb.andWhere('roi.roomCategory = :category', { category: query.roomCategory });
        }
        if (query.startDate && query.endDate) {
            qb.andWhere('roi.timestamp BETWEEN :start AND :end', {
                start: query.startDate,
                end: query.endDate,
            });
        }
        const results = await qb.getMany();
        return results.map(r => ({
            winRate: Number(r.winRate),
            roiPercentage: Number(r.roiPercentage),
            totalBets: r.totalBets,
            profitLoss: Number(r.totalReturned) - Number(r.totalWagered),
            avgBetSize: Number(r.avgBetSize),
            roomCategory: r.roomCategory,
        }));
    }
    async updateRoiCalc(id, dto) {
        const entity = await this.roiRepo.findOne({ where: { id } });
        if (!entity)
            throw new common_1.NotFoundException('ROI record not found');
        const totalWagered = dto.totalWagered ?? entity.totalWagered;
        const totalReturned = dto.totalReturned ?? entity.totalReturned;
        const winningBets = dto.winningBets ?? entity.winningBets;
        const losingBets = dto.losingBets ?? entity.losingBets;
        const totalBets = winningBets + losingBets;
        const winRate = (winningBets / totalBets) * 100;
        const roiPercentage = ((Number(totalReturned) - Number(totalWagered)) / Number(totalWagered)) * 100;
        const avgBetSize = Number(totalWagered) / totalBets;
        Object.assign(entity, {
            ...dto,
            winRate,
            roiPercentage,
            avgBetSize,
            totalBets,
        });
        return this.roiRepo.save(entity);
    }
    async deleteAnomalyReport(id) {
        const result = await this.roiRepo.delete({ id, isAnomaly: true });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Anomaly report not found');
        }
    }
    async getOutcomeQueries(roomCategory) {
        const data = await this.roiRepo.find({
            where: { roomCategory },
            order: { timestamp: 'DESC' },
            take: 100,
        });
        return {
            roomCategory,
            totalRecords: data.length,
            avgWinRate: data.reduce((sum, d) => sum + Number(d.winRate), 0) / data.length,
            avgRoi: data.reduce((sum, d) => sum + Number(d.roiPercentage), 0) / data.length,
            anomalyCount: data.filter(d => d.isAnomaly).length,
            outcomeDistribution: this.aggregateOutcomes(data),
        };
    }
    async getHistoricalComparison(roomCategory) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const current = await this.getAggregatedMetrics(roomCategory, weekAgo, now);
        const previous = await this.getAggregatedMetrics(roomCategory, twoWeeksAgo, weekAgo);
        const percentageChange = ((current.roiPercentage - previous.roiPercentage) / Math.abs(previous.roiPercentage)) * 100;
        let trend = 'stable';
        if (percentageChange > 5)
            trend = 'improving';
        else if (percentageChange < -5)
            trend = 'declining';
        return { current, previous, percentageChange, trend };
    }
    async getLossAlerts(roomCategory) {
        const qb = this.roiRepo.createQueryBuilder('roi')
            .where('roi.totalReturned < roi.totalWagered');
        if (roomCategory) {
            qb.andWhere('roi.roomCategory = :category', { category: roomCategory });
        }
        const losses = await qb.getMany();
        return losses.map(l => {
            const lossAmount = Number(l.totalWagered) - Number(l.totalReturned);
            return {
                roomCategory: l.roomCategory,
                lossAmount,
                threshold: this.LOSS_THRESHOLD,
                severity: this.calculateSeverity(lossAmount),
                timestamp: l.timestamp,
            };
        }).filter(alert => alert.lossAmount > this.LOSS_THRESHOLD);
    }
    async detectAnomaly(roomCategory, currentRoi) {
        const historical = await this.roiRepo.find({
            where: { roomCategory },
            order: { timestamp: 'DESC' },
            take: 10,
        });
        if (historical.length < 3)
            return false;
        const avgRoi = historical.reduce((sum, h) => sum + Number(h.roiPercentage), 0) / historical.length;
        const deviation = Math.abs((currentRoi - avgRoi) / avgRoi);
        return deviation > this.ANOMALY_THRESHOLD;
    }
    async checkLossAlert(entity) {
        const loss = Number(entity.totalWagered) - Number(entity.totalReturned);
        if (loss > this.LOSS_THRESHOLD) {
            console.log(`LOSS ALERT: ${entity.roomCategory} - Loss: $${loss}`);
        }
    }
    calculateSeverity(loss) {
        if (loss > 100000)
            return 'critical';
        if (loss > 50000)
            return 'high';
        if (loss > 25000)
            return 'medium';
        return 'low';
    }
    aggregateOutcomes(data) {
        const outcomes = {};
        data.forEach(d => {
            if (d.outcomeDistribution) {
                Object.entries(d.outcomeDistribution).forEach(([key, val]) => {
                    outcomes[key] = (outcomes[key] || 0) + val;
                });
            }
        });
        return outcomes;
    }
    async getAggregatedMetrics(roomCategory, start, end) {
        const data = await this.roiRepo.find({
            where: {
                roomCategory,
                timestamp: (0, typeorm_2.Between)(start, end),
            },
        });
        const totalBets = data.reduce((sum, d) => sum + d.totalBets, 0);
        const totalWagered = data.reduce((sum, d) => sum + Number(d.totalWagered), 0);
        const totalReturned = data.reduce((sum, d) => sum + Number(d.totalReturned), 0);
        const winningBets = data.reduce((sum, d) => sum + d.winningBets, 0);
        return {
            winRate: (winningBets / totalBets) * 100,
            roiPercentage: ((totalReturned - totalWagered) / totalWagered) * 100,
            totalBets,
            profitLoss: totalReturned - totalWagered,
            avgBetSize: totalWagered / totalBets,
            roomCategory,
        };
    }
};
exports.DegenRoiService = DegenRoiService;
exports.DegenRoiService = DegenRoiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(degen_roi_entity_1.DegenRoiEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DegenRoiService);
//# sourceMappingURL=degen-roi.service.js.map