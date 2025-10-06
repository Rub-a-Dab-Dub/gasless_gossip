import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DegenRoiEntity } from './entities/degen-roi.entity';
import { CreateWinRateDto } from './dto/create-win-rate.dto';
import { UpdateRoiCalcDto } from './dto/update-roi-calc.dto';
import { RiskMetricsQueryDto } from './dto/risk-metrics.dto';
import { IRoiMetrics, IHistoricalComparison, ILossAlert } from './interfaces/roi-metrics.interface';

@Injectable()
export class DegenRoiService {
  private readonly LOSS_THRESHOLD = 10000; // configurable
  private readonly ANOMALY_THRESHOLD = 0.3; // 30% deviation

  constructor(
    @InjectRepository(DegenRoiEntity)
    private roiRepo: Repository<DegenRoiEntity>,
  ) {}

  async createWinRate(dto: CreateWinRateDto): Promise<DegenRoiEntity> {
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

    // Check for loss alerts
    if (dto.totalReturned < dto.totalWagered) {
      await this.checkLossAlert(saved);
    }

    return saved;
  }

  async getRiskMetrics(query: RiskMetricsQueryDto): Promise<IRoiMetrics[]> {
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

  async updateRoiCalc(id: string, dto: UpdateRoiCalcDto): Promise<DegenRoiEntity> {
    const entity = await this.roiRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('ROI record not found');

    // Recalculate metrics
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

  async deleteAnomalyReport(id: string): Promise<void> {
    const result = await this.roiRepo.delete({ id, isAnomaly: true });
    if (result.affected === 0) {
      throw new NotFoundException('Anomaly report not found');
    }
  }

  async getOutcomeQueries(roomCategory: string): Promise<any> {
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

  async getHistoricalComparison(roomCategory: string): Promise<IHistoricalComparison> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const current = await this.getAggregatedMetrics(roomCategory, weekAgo, now);
    const previous = await this.getAggregatedMetrics(roomCategory, twoWeeksAgo, weekAgo);

    const percentageChange = ((current.roiPercentage - previous.roiPercentage) / Math.abs(previous.roiPercentage)) * 100;
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (percentageChange > 5) trend = 'improving';
    else if (percentageChange < -5) trend = 'declining';

    return { current, previous, percentageChange, trend };
  }

  async getLossAlerts(roomCategory?: string): Promise<ILossAlert[]> {
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

  // Private helpers
  private async detectAnomaly(roomCategory: string, currentRoi: number): Promise<boolean> {
    const historical = await this.roiRepo.find({
      where: { roomCategory },
      order: { timestamp: 'DESC' },
      take: 10,
    });

    if (historical.length < 3) return false;

    const avgRoi = historical.reduce((sum, h) => sum + Number(h.roiPercentage), 0) / historical.length;
    const deviation = Math.abs((currentRoi - avgRoi) / avgRoi);

    return deviation > this.ANOMALY_THRESHOLD;
  }

  private async checkLossAlert(entity: DegenRoiEntity): Promise<void> {
    const loss = Number(entity.totalWagered) - Number(entity.totalReturned);
    if (loss > this.LOSS_THRESHOLD) {
      // Implement notification logic here (email, webhook, etc.)
      console.log(`LOSS ALERT: ${entity.roomCategory} - Loss: $${loss}`);
    }
  }

  private calculateSeverity(loss: number): 'low' | 'medium' | 'high' | 'critical' {
    if (loss > 100000) return 'critical';
    if (loss > 50000) return 'high';
    if (loss > 25000) return 'medium';
    return 'low';
  }

  private aggregateOutcomes(data: DegenRoiEntity[]): Record<string, number> {
    const outcomes: Record<string, number> = {};
    data.forEach(d => {
      if (d.outcomeDistribution) {
        Object.entries(d.outcomeDistribution).forEach(([key, val]) => {
          outcomes[key] = (outcomes[key] || 0) + (val as number);
        });
      }
    });
    return outcomes;
  }

  private async getAggregatedMetrics(
    roomCategory: string,
    start: Date,
    end: Date,
  ): Promise<IRoiMetrics> {
    const data = await this.roiRepo.find({
      where: {
        roomCategory,
        timestamp: Between(start, end),
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
}