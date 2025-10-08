// ==================== ENTITIES ====================

// gifting-behavior.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('gifting_behaviors')
@Index(['itemId', 'createdAt'])
@Index(['senderId', 'createdAt'])
@Index(['recipientId', 'createdAt'])
export class GiftingBehavior {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  itemId: string;

  @Column()
  itemName: string;

  @Column()
  senderId: string;

  @Column()
  recipientId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ nullable: true })
  occasion?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

// ==================== DTOs ====================

// create-gift.dto.ts
import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateGiftDto {
  @IsString()
  itemId: string;

  @IsString()
  itemName: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  recipientId: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

// query-gifts.dto.ts
import { IsOptional, IsDateString, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryGiftsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  @IsOptional()
  @IsString()
  senderId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 100;
}

// ==================== INTERFACES ====================

export interface PopularityRank {
  itemId: string;
  itemName: string;
  giftCount: number;
  totalValue: number;
  avgValue: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface ValueDistribution {
  itemId: string;
  itemName: string;
  ranges: {
    range: string;
    count: number;
    percentage: number;
  }[];
  median: number;
  mean: number;
  mode: number;
}

export interface TrendData {
  period: string;
  itemId: string;
  itemName: string;
  count: number;
  value: number;
}

export interface HeatmapData {
  itemId: string;
  itemName: string;
  hourOfDay: number;
  dayOfWeek: number;
  intensity: number;
}

export interface UserSegment {
  segmentName: string;
  userCount: number;
  avgGiftsGiven: number;
  avgGiftValue: number;
  topItems: { itemId: string; itemName: string; count: number }[];
  characteristics: Record<string, any>;
}

// ==================== SERVICE ====================

// gifting-behavior.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { GiftingBehavior } from './gifting-behavior.entity';
import { CreateGiftDto, QueryGiftsDto } from './dto';
import {
  PopularityRank,
  ValueDistribution,
  TrendData,
  HeatmapData,
  UserSegment,
} from './interfaces';

@Injectable()
export class GiftingBehaviorService {
  constructor(
    @InjectRepository(GiftingBehavior)
    private giftingRepo: Repository<GiftingBehavior>,
  ) {}

  // CREATE: Log gift transaction
  async logGift(dto: CreateGiftDto): Promise<GiftingBehavior> {
    const gift = this.giftingRepo.create(dto);
    return this.giftingRepo.save(gift);
  }

  // READ: Get popularity rankings
  async getPopularityRanks(period: { start: Date; end: Date }): Promise<PopularityRank[]> {
    const currentPeriod = await this.giftingRepo
      .createQueryBuilder('gift')
      .select('gift.itemId', 'itemId')
      .addSelect('gift.itemName', 'itemName')
      .addSelect('COUNT(*)', 'giftCount')
      .addSelect('SUM(gift.value)', 'totalValue')
      .addSelect('AVG(gift.value)', 'avgValue')
      .where('gift.createdAt BETWEEN :start AND :end', period)
      .groupBy('gift.itemId')
      .addGroupBy('gift.itemName')
      .orderBy('giftCount', 'DESC')
      .getRawMany();

    // Calculate previous period for trend
    const periodLength = period.end.getTime() - period.start.getTime();
    const prevStart = new Date(period.start.getTime() - periodLength);
    const prevEnd = period.start;

    const previousPeriod = await this.giftingRepo
      .createQueryBuilder('gift')
      .select('gift.itemId', 'itemId')
      .addSelect('COUNT(*)', 'giftCount')
      .where('gift.createdAt BETWEEN :start AND :end', {
        start: prevStart,
        end: prevEnd,
      })
      .groupBy('gift.itemId')
      .getRawMany();

    const prevMap = new Map(previousPeriod.map((p) => [p.itemId, parseInt(p.giftCount)]));

    return currentPeriod.map((item, index) => {
      const currentCount = parseInt(item.giftCount);
      const prevCount = prevMap.get(item.itemId) || 0;
      const change = prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : 100;

      return {
        itemId: item.itemId,
        itemName: item.itemName,
        giftCount: currentCount,
        totalValue: parseFloat(item.totalValue),
        avgValue: parseFloat(item.avgValue),
        rank: index + 1,
        trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
        trendPercentage: Math.round(change * 100) / 100,
      };
    });
  }

  // UPDATE: Get value distribution
  async getValueDistribution(itemId?: string): Promise<ValueDistribution[]> {
    const query = this.giftingRepo.createQueryBuilder('gift');

    if (itemId) {
      query.where('gift.itemId = :itemId', { itemId });
    }

    const gifts = await query.getMany();

    const groupedByItem = gifts.reduce((acc, gift) => {
      if (!acc[gift.itemId]) {
        acc[gift.itemId] = { itemName: gift.itemName, values: [] };
      }
      acc[gift.itemId].values.push(gift.value);
      return acc;
    }, {} as Record<string, { itemName: string; values: number[] }>);

    return Object.entries(groupedByItem).map(([itemId, data]) => {
      const values = data.values.sort((a, b) => a - b);
      const ranges = [
        { min: 0, max: 10, label: '$0-10' },
        { min: 10, max: 25, label: '$10-25' },
        { min: 25, max: 50, label: '$25-50' },
        { min: 50, max: 100, label: '$50-100' },
        { min: 100, max: Infinity, label: '$100+' },
      ];

      const distribution = ranges.map((range) => {
        const count = values.filter((v) => v >= range.min && v < range.max).length;
        return {
          range: range.label,
          count,
          percentage: Math.round((count / values.length) * 10000) / 100,
        };
      });

      const median = values[Math.floor(values.length / 2)];
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const mode = this.calculateMode(values);

      return {
        itemId,
        itemName: data.itemName,
        ranges: distribution,
        median,
        mean: Math.round(mean * 100) / 100,
        mode,
      };
    });
  }

  // DELETE: Get trend over time
  async getTrendOverTime(
    period: { start: Date; end: Date },
    interval: 'day' | 'week' | 'month' = 'day',
  ): Promise<TrendData[]> {
    const dateFormat = {
      day: 'YYYY-MM-DD',
      week: 'YYYY-IW',
      month: 'YYYY-MM',
    };

    const trends = await this.giftingRepo
      .createQueryBuilder('gift')
      .select(`TO_CHAR(gift.createdAt, '${dateFormat[interval]}')`, 'period')
      .addSelect('gift.itemId', 'itemId')
      .addSelect('gift.itemName', 'itemName')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(gift.value)', 'value')
      .where('gift.createdAt BETWEEN :start AND :end', period)
      .groupBy('period')
      .addGroupBy('gift.itemId')
      .addGroupBy('gift.itemName')
      .orderBy('period', 'ASC')
      .addOrderBy('count', 'DESC')
      .getRawMany();

    return trends.map((t) => ({
      period: t.period,
      itemId: t.itemId,
      itemName: t.itemName,
      count: parseInt(t.count),
      value: parseFloat(t.value),
    }));
  }

  // HEATMAPS: Get activity heatmap data
  async getHeatmapData(period: { start: Date; end: Date }): Promise<HeatmapData[]> {
    const heatmap = await this.giftingRepo
      .createQueryBuilder('gift')
      .select('gift.itemId', 'itemId')
      .addSelect('gift.itemName', 'itemName')
      .addSelect('EXTRACT(HOUR FROM gift.createdAt)', 'hourOfDay')
      .addSelect('EXTRACT(DOW FROM gift.createdAt)', 'dayOfWeek')
      .addSelect('COUNT(*)', 'intensity')
      .where('gift.createdAt BETWEEN :start AND :end', period)
      .groupBy('gift.itemId')
      .addGroupBy('gift.itemName')
      .addGroupBy('hourOfDay')
      .addGroupBy('dayOfWeek')
      .getRawMany();

    return heatmap.map((h) => ({
      itemId: h.itemId,
      itemName: h.itemName,
      hourOfDay: parseInt(h.hourOfDay),
      dayOfWeek: parseInt(h.dayOfWeek),
      intensity: parseInt(h.intensity),
    }));
  }

  // USER SEGMENTS: Analyze user behavior segments
  async getUserSegments(period: { start: Date; end: Date }): Promise<UserSegment[]> {
    const userStats = await this.giftingRepo
      .createQueryBuilder('gift')
      .select('gift.senderId', 'userId')
      .addSelect('COUNT(*)', 'giftCount')
      .addSelect('AVG(gift.value)', 'avgValue')
      .where('gift.createdAt BETWEEN :start AND :end', period)
      .groupBy('gift.senderId')
      .getRawMany();

    // Segment users by activity level
    const segments = {
      'High Value Gifters': userStats.filter((u) => parseFloat(u.avgValue) > 50),
      'Frequent Gifters': userStats.filter((u) => parseInt(u.giftCount) > 10),
      'Casual Gifters': userStats.filter(
        (u) => parseInt(u.giftCount) <= 10 && parseFloat(u.avgValue) <= 50,
      ),
    };

    const result: UserSegment[] = [];

    for (const [segmentName, users] of Object.entries(segments)) {
      if (users.length === 0) continue;

      const userIds = users.map((u) => u.userId);
      const topItems = await this.giftingRepo
        .createQueryBuilder('gift')
        .select('gift.itemId', 'itemId')
        .addSelect('gift.itemName', 'itemName')
        .addSelect('COUNT(*)', 'count')
        .where('gift.senderId IN (:...userIds)', { userIds })
        .andWhere('gift.createdAt BETWEEN :start AND :end', period)
        .groupBy('gift.itemId')
        .addGroupBy('gift.itemName')
        .orderBy('count', 'DESC')
        .limit(5)
        .getRawMany();

      result.push({
        segmentName,
        userCount: users.length,
        avgGiftsGiven:
          users.reduce((sum, u) => sum + parseInt(u.giftCount), 0) / users.length,
        avgGiftValue:
          users.reduce((sum, u) => sum + parseFloat(u.avgValue), 0) / users.length,
        topItems: topItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          count: parseInt(item.count),
        })),
        characteristics: {
          avgGiftsPerUser:
            Math.round(
              (users.reduce((sum, u) => sum + parseInt(u.giftCount), 0) / users.length) * 100,
            ) / 100,
          avgValuePerGift:
            Math.round(
              (users.reduce((sum, u) => sum + parseFloat(u.avgValue), 0) / users.length) * 100,
            ) / 100,
        },
      });
    }

    return result;
  }

  // QUERY: Pattern-based querying
  async queryGifts(dto: QueryGiftsDto): Promise<GiftingBehavior[]> {
    const query = this.giftingRepo.createQueryBuilder('gift');

    if (dto.startDate && dto.endDate) {
      query.where('gift.createdAt BETWEEN :start AND :end', {
        start: dto.startDate,
        end: dto.endDate,
      });
    }

    if (dto.itemId) {
      query.andWhere('gift.itemId = :itemId', { itemId: dto.itemId });
    }

    if (dto.senderId) {
      query.andWhere('gift.senderId = :senderId', { senderId: dto.senderId });
    }

    return query.orderBy('gift.createdAt', 'DESC').limit(dto.limit).getMany();
  }

  private calculateMode(values: number[]): number {
    const frequency = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return parseFloat(
      Object.entries(frequency).reduce((a, b) => (a[1] > b[1] ? a : b))[0],
    );
  }
}

// ==================== CONTROLLER ====================

// gifting-behavior.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GiftingBehaviorService } from './gifting-behavior.service';
import { CreateGiftDto, QueryGiftsDto } from './dto';

// Uncomment and configure your auth guard
// @UseGuards(AdminGuard)
@Controller('admin/gifting-analytics')
export class GiftingBehaviorController {
  constructor(private readonly giftingService: GiftingBehaviorService) {}

  @Post('log')
  @HttpCode(HttpStatus.CREATED)
  async logGift(@Body() dto: CreateGiftDto) {
    return this.giftingService.logGift(dto);
  }

  @Get('popularity-ranks')
  async getPopularityRanks(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const period = {
      start: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(endDate || Date.now()),
    };
    return this.giftingService.getPopularityRanks(period);
  }

  @Get('value-distribution')
  async getValueDistribution(@Query('itemId') itemId?: string) {
    return this.giftingService.getValueDistribution(itemId);
  }

  @Get('trends')
  async getTrends(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('interval') interval: 'day' | 'week' | 'month' = 'day',
  ) {
    const period = {
      start: new Date(startDate || Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date(endDate || Date.now()),
    };
    return this.giftingService.getTrendOverTime(period, interval);
  }

  @Get('heatmap')
  async getHeatmap(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const period = {
      start: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(endDate || Date.now()),
    };
    return this.giftingService.getHeatmapData(period);
  }

  @Get('user-segments')
  async getUserSegments(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const period = {
      start: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(endDate || Date.now()),
    };
    return this.giftingService.getUserSegments(period);
  }

  @Get('query')
  async queryGifts(@Query() dto: QueryGiftsDto) {
    return this.giftingService.queryGifts(dto);
  }

  @Get('market-insights')
  async getMarketInsights(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const period = {
      start: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(endDate || Date.now()),
    };

    const [ranks, heatmap, segments, trends] = await Promise.all([
      this.giftingService.getPopularityRanks(period),
      this.giftingService.getHeatmapData(period),
      this.giftingService.getUserSegments(period),
      this.giftingService.getTrendOverTime(period, 'week'),
    ]);

    return {
      popularityRanks: ranks.slice(0, 10),
      activityHeatmap: heatmap,
      userSegments: segments,
      trends: trends,
      insights: {
        topGrowingItem: ranks.find((r) => r.trend === 'up'),
        mostValuableSegment: segments.sort((a, b) => b.avgGiftValue - a.avgGiftValue)[0],
        peakActivityTimes: this.findPeakTimes(heatmap),
      },
    };
  }

  private findPeakTimes(heatmap: any[]) {
    const hourlyActivity = heatmap.reduce((acc, h) => {
      acc[h.hourOfDay] = (acc[h.hourOfDay] || 0) + h.intensity;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(hourlyActivity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour, intensity]) => ({ hour: parseInt(hour), intensity }));
  }
}

// ==================== MODULE ====================

// gifting-behavior.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftingBehavior } from './gifting-behavior.entity';
import { GiftingBehaviorService } from './gifting-behavior.service';
import { GiftingBehaviorController } from './gifting-behavior.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GiftingBehavior])],
  controllers: [GiftingBehaviorController],
  providers: [GiftingBehaviorService],
  exports: [GiftingBehaviorService],
})
export class GiftingBehaviorModule {}