import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { DailyAggregate } from './entities/daily-aggregate.entity';
import { ROIComparisonResponse, TopUserResponse, TrendForecastResponse } from './dto/response.dto';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FinanceMetricsService {
  private provider: ethers.Provider;

  constructor(
    @InjectRepository(DailyAggregate)
    private readonly dailyAggregateRepo: Repository<DailyAggregate>,
    private configService: ConfigService,
  ) {
    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async createDailyAggregate(date: Date): Promise<DailyAggregate> {
    const startBlock = await this.getBlockNumberForDate(date);
    const endBlock = await this.getBlockNumberForDate(new Date(date.getTime() + 86400000));
    
    const transactions = await this.getTransactions(startBlock, endBlock);
    const metrics = await this.processTransactions(transactions, date, startBlock);
    
    return this.dailyAggregateRepo.save(metrics);
  }

  async getTopUsers(startDate: Date, endDate: Date, limit = 10): Promise<TopUserResponse[]> {
    const aggregates = await this.dailyAggregateRepo.find({
      where: { date: Between(startDate, endDate) },
      order: { date: 'DESC' },
    });

    const userMap = new Map<string, TopUserResponse>();

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

  async updateTrendForecast(id: string): Promise<TrendForecastResponse> {
    const aggregate = await this.dailyAggregateRepo.findOne({ where: { id } });
    if (!aggregate) throw new NotFoundException('Daily aggregate not found');

    const historicalData = await this.dailyAggregateRepo.find({
      where: { date: LessThanOrEqual(aggregate.date) },
      order: { date: 'DESC' },
      take: 30, // Last 30 days for trend analysis
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

  async deleteSpikeAlert(id: string): Promise<void> {
    const aggregate = await this.dailyAggregateRepo.findOne({ where: { id } });
    if (!aggregate) throw new NotFoundException('Daily aggregate not found');

    await this.dailyAggregateRepo.update(id, {
      hasSpike: false,
      spikeData: null,
    });
  }

  async compareROI(period1Start: Date, period1End: Date, period2Start: Date, period2End: Date): Promise<ROIComparisonResponse> {
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

  private async getBlockNumberForDate(date: Date): Promise<number> {
    // Implementation would depend on your blockchain's average block time
    // This is a simplified version
    const timestamp = Math.floor(date.getTime() / 1000);
    const block = await this.provider.getBlock(timestamp);
    return block.number;
  }

  private async getTransactions(startBlock: number, endBlock: number): Promise<any[]> {
    const contractAddress = this.configService.get<string>('TOKEN_CONTRACT_ADDRESS');
    const filter = {
      address: contractAddress,
      topics: [ethers.id('Transfer(address,address,uint256)')],
      fromBlock: startBlock,
      toBlock: endBlock,
    };

    return this.provider.getLogs(filter);
  }

  private async processTransactions(transactions: any[], date: Date, blockNumber: number): Promise<Partial<DailyAggregate>> {
    const uniqueUsers = new Set<string>();
    const userVolumes = new Map<string, { volume: number; count: number }>();
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

  private parseTransferLog(log: any) {
    const iface = new ethers.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ]);
    const parsedLog = iface.parseLog(log);
    
    return {
      from: parsedLog.args[0],
      to: parsedLog.args[1],
      value: parsedLog.args[2],
    };
  }

  private updateUserVolume(userVolumes: Map<string, { volume: number; count: number }>, user: string, value: number) {
    const current = userVolumes.get(user) || { volume: 0, count: 0 };
    userVolumes.set(user, {
      volume: current.volume + Number(value),
      count: current.count + 1,
    });
  }

  private async calculateROI(startDate: Date, endDate: Date): Promise<number> {
    const [startAggregate, endAggregate] = await Promise.all([
      this.dailyAggregateRepo.findOne({
        where: { date: MoreThanOrEqual(startDate) },
        order: { date: 'ASC' },
      }),
      this.dailyAggregateRepo.findOne({
        where: { date: LessThanOrEqual(endDate) },
        order: { date: 'DESC' },
      }),
    ]);

    if (!startAggregate || !endAggregate) return 0;

    return ((endAggregate.cumulativeVolume - startAggregate.cumulativeVolume) / startAggregate.cumulativeVolume) * 100;
  }

  private calculateTrend(historicalData: DailyAggregate[]) {
    // Simple linear regression for trend calculation
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
    
    // Calculate R-squared for confidence
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
}