import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Analytic, MetricType } from './analytics.entity';
import { AnalyticsQueryDto, CreateAnalyticDto, AnalyticsResponseDto } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Analytic)
    private readonly analyticRepository: Repository<Analytic>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createAnalytic(createAnalyticDto: CreateAnalyticDto): Promise<Analytic> {
    try {
      const analytic = this.analyticRepository.create(createAnalyticDto);
      const savedAnalytic = await this.analyticRepository.save(analytic);
      
      // Emit event for real-time updates
      this.eventEmitter.emit('analytics.created', {
        analytic: savedAnalytic,
        userId: savedAnalytic.userId,
        roomId: savedAnalytic.roomId,
        metricType: savedAnalytic.metricType
      });

      this.logger.log(`Analytics created: ${savedAnalytic.metricType} for user ${savedAnalytic.userId}`);
      return savedAnalytic;
    } catch (error) {
      this.logger.error(`Failed to create analytic: ${error.message}`);
      throw error;
    }
  }

  async getUserAnalytics(userId: string, query: AnalyticsQueryDto): Promise<AnalyticsResponseDto> {
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

  async getRoomAnalytics(roomId: string, query: AnalyticsQueryDto): Promise<AnalyticsResponseDto> {
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

  private createBaseQuery(): SelectQueryBuilder<Analytic> {
    return this.analyticRepository
      .createQueryBuilder('analytic')
      .orderBy('analytic.createdAt', 'DESC');
  }

  private async applyFilters(queryBuilder: SelectQueryBuilder<Analytic>, query: AnalyticsQueryDto): Promise<void> {
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

  private async getAggregations(userId?: string, roomId?: string, query?: AnalyticsQueryDto) {
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
        `COUNT(CASE WHEN analytic.metricType = '${MetricType.VISIT}' THEN 1 END) as totalVisits`,
        `COUNT(CASE WHEN analytic.metricType = '${MetricType.TIP}' THEN 1 END) as totalTips`,
        `COUNT(CASE WHEN analytic.metricType = '${MetricType.REACTION}' THEN 1 END) as totalReactions`,
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

  private async groupData(data: Analytic[], groupBy: 'day' | 'week' | 'month') {
    const grouped = data.reduce((acc, item) => {
      let key: string;
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

    return Object.values(grouped).sort((a: any, b: any) => a.period.localeCompare(b.period));
  }

  // Helper methods for common analytics operations
  async trackVisit(userId: string, roomId?: string, metadata?: Record<string, any>): Promise<Analytic> {
    return this.createAnalytic({
      metricType: MetricType.VISIT,
      userId,
      roomId,
      value: 1,
      metadata
    });
  }

  async trackTip(userId: string, amount: number, roomId?: string, metadata?: Record<string, any>): Promise<Analytic> {
    return this.createAnalytic({
      metricType: MetricType.TIP,
      userId,
      roomId,
      value: amount,
      metadata
    });
  }

  async trackReaction(userId: string, roomId?: string, reactionType?: string): Promise<Analytic> {
    return this.createAnalytic({
      metricType: MetricType.REACTION,
      userId,
      roomId,
      value: 1,
      metadata: { reactionType }
    });
  }
}