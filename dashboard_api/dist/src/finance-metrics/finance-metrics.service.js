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
exports.FinanceMetricsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_aggregate_entity_1 = require("./entities/daily-aggregate.entity");
const ethers_1 = require("ethers");
const config_1 = require("@nestjs/config");
let FinanceMetricsService = class FinanceMetricsService {
    dailyAggregateRepo;
    configService;
    provider;
    constructor(dailyAggregateRepo, configService) {
        this.dailyAggregateRepo = dailyAggregateRepo;
        this.configService = configService;
        const rpcUrl = this.configService.get('BLOCKCHAIN_RPC_URL');
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
    }
    async createDailyAggregate(date) {
        const startBlock = await this.getBlockNumberForDate(date);
        const endBlock = await this.getBlockNumberForDate(new Date(date.getTime() + 86400000));
        const transactions = await this.getTransactions(startBlock, endBlock);
        const metrics = await this.processTransactions(transactions, date, startBlock);
        return this.dailyAggregateRepo.save(metrics);
    }
    async getTopUsers(startDate, endDate, limit = 10) {
        const aggregates = await this.dailyAggregateRepo.find({
            where: { date: (0, typeorm_2.Between)(startDate, endDate) },
            order: { date: 'DESC' },
        });
        const userMap = new Map();
        aggregates.forEach(agg => {
            agg.topUsers?.forEach(user => {
                const existing = userMap.get(user.userId) || {
                    userId: user.userId,
                    totalVolume: 0,
                    transactionCount: 0,
                    lastActive: agg.date,
                };
                userMap.set(user.userId, {
                    ...existing,
                    totalVolume: existing.totalVolume + user.volume,
                    transactionCount: existing.transactionCount + user.transactionCount,
                    lastActive: existing.lastActive > agg.date ? existing.lastActive : agg.date,
                });
            });
        });
        return Array.from(userMap.values())
            .sort((a, b) => b.totalVolume - a.totalVolume)
            .slice(0, limit);
    }
    async updateTrendForecast(id) {
        const aggregate = await this.dailyAggregateRepo.findOne({ where: { id } });
        if (!aggregate)
            throw new common_1.NotFoundException('Daily aggregate not found');
        const historicalData = await this.dailyAggregateRepo.find({
            where: { date: (0, typeorm_2.LessThanOrEqual)(aggregate.date) },
            order: { date: 'DESC' },
            take: 30,
        });
        const trend = this.calculateTrend(historicalData);
        await this.dailyAggregateRepo.update(id, {
            trends: {
                volumeGrowth: trend.growthRate,
                predictedVolume: trend.predictedVolume,
                userGrowth: trend.userGrowth,
            },
        });
        return {
            predictedVolume: trend.predictedVolume,
            confidence: trend.confidence,
            growthRate: trend.growthRate,
        };
    }
    async deleteSpikeAlert(id) {
        const aggregate = await this.dailyAggregateRepo.findOne({ where: { id } });
        if (!aggregate)
            throw new common_1.NotFoundException('Daily aggregate not found');
        await this.dailyAggregateRepo.update(id, {
            hasSpike: false,
            spikeData: null,
        });
    }
    async compareROI(period1Start, period1End, period2Start, period2End) {
        const [roi1, roi2] = await Promise.all([
            this.calculateROI(period1Start, period1End),
            this.calculateROI(period2Start, period2End),
        ]);
        const difference = roi2 - roi1;
        const percentageChange = roi1 !== 0 ? (difference / Math.abs(roi1)) * 100 : 0;
        return {
            period1ROI: roi1,
            period2ROI: roi2,
            difference,
            percentageChange,
        };
    }
    async getBlockNumberForDate(date) {
        const timestamp = Math.floor(date.getTime() / 1000);
        const block = await this.provider.getBlock(timestamp);
        return block.number;
    }
    async getTransactions(startBlock, endBlock) {
        const contractAddress = this.configService.get('TOKEN_CONTRACT_ADDRESS');
        const filter = {
            address: contractAddress,
            topics: [ethers_1.ethers.id('Transfer(address,address,uint256)')],
            fromBlock: startBlock,
            toBlock: endBlock,
        };
        return this.provider.getLogs(filter);
    }
    async processTransactions(transactions, date, blockNumber) {
        const uniqueUsers = new Set();
        const userVolumes = new Map();
        let dailyVolume = 0;
        transactions.forEach(tx => {
            const { from, to, value } = this.parseTransferLog(tx);
            uniqueUsers.add(from).add(to);
            dailyVolume += Number(value);
            this.updateUserVolume(userVolumes, from, value);
            this.updateUserVolume(userVolumes, to, value);
        });
        const topUsers = Array.from(userVolumes.entries())
            .map(([userId, data]) => ({
            userId,
            volume: data.volume,
            transactionCount: data.count,
        }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 10);
        return {
            date,
            dailyVolume,
            transactionCount: transactions.length,
            uniqueUsers: uniqueUsers.size,
            topUsers,
            blockNumber,
        };
    }
    parseTransferLog(log) {
        const iface = new ethers_1.ethers.Interface([
            'event Transfer(address indexed from, address indexed to, uint256 value)',
        ]);
        const parsedLog = iface.parseLog(log);
        return {
            from: parsedLog.args[0],
            to: parsedLog.args[1],
            value: parsedLog.args[2],
        };
    }
    updateUserVolume(userVolumes, user, value) {
        const current = userVolumes.get(user) || { volume: 0, count: 0 };
        userVolumes.set(user, {
            volume: current.volume + Number(value),
            count: current.count + 1,
        });
    }
    async calculateROI(startDate, endDate) {
        const [startAggregate, endAggregate] = await Promise.all([
            this.dailyAggregateRepo.findOne({
                where: { date: (0, typeorm_2.MoreThanOrEqual)(startDate) },
                order: { date: 'ASC' },
            }),
            this.dailyAggregateRepo.findOne({
                where: { date: (0, typeorm_2.LessThanOrEqual)(endDate) },
                order: { date: 'DESC' },
            }),
        ]);
        if (!startAggregate || !endAggregate)
            return 0;
        return ((endAggregate.cumulativeVolume - startAggregate.cumulativeVolume) / startAggregate.cumulativeVolume) * 100;
    }
    calculateTrend(historicalData) {
        const n = historicalData.length;
        const volumes = historicalData.map(d => d.dailyVolume);
        const timestamps = historicalData.map((d, i) => i);
        const sumX = timestamps.reduce((a, b) => a + b, 0);
        const sumY = volumes.reduce((a, b) => a + b, 0);
        const sumXY = timestamps.reduce((sum, x, i) => sum + x * volumes[i], 0);
        const sumXX = timestamps.reduce((sum, x) => sum + x * x, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const predictedVolume = slope * n + intercept;
        const growthRate = (slope / (sumY / n)) * 100;
        const yMean = sumY / n;
        const totalSS = volumes.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
        const regressionSS = volumes.reduce((sum, y, i) => {
            const yPred = slope * timestamps[i] + intercept;
            return sum + Math.pow(yPred - yMean, 2);
        }, 0);
        const confidence = regressionSS / totalSS;
        return {
            predictedVolume,
            growthRate,
            confidence,
            userGrowth: historicalData[0].uniqueUsers / historicalData[n - 1].uniqueUsers - 1,
        };
    }
};
exports.FinanceMetricsService = FinanceMetricsService;
exports.FinanceMetricsService = FinanceMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_aggregate_entity_1.DailyAggregate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], FinanceMetricsService);
//# sourceMappingURL=finance-metrics.service.js.map