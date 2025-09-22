import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GiftLog } from './entities/gift-log.entity';
import { CreateGiftLogDto } from './dto/create-gift-log.dto';
import { GiftHistoryQueryDto } from './dto/gift-history-query.dto';
import { GiftGivenEvent } from './events/gift-given.event';
import { GiftAnalyticsEvent } from './events/gift-analytics.event';

@Injectable()
export class GiftsGivenService {
  private readonly logger = new Logger(GiftsGivenService.name);

  constructor(
    @InjectRepository(GiftLog)
    private readonly giftLogRepository: Repository<GiftLog>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async logGift(createGiftLogDto: CreateGiftLogDto): Promise<GiftLog> {
    try {
      const giftLog = this.giftLogRepository.create(createGiftLogDto);
      const savedLog = await this.giftLogRepository.save(giftLog);

      // Emit analytics events
      this.emitGiftEvents(savedLog);

      this.logger.log(`Gift logged: ${savedLog.id} by user ${savedLog.userId}`);
      return savedLog;
    } catch (error) {
      this.logger.error('Failed to log gift', error);
      throw error;
    }
  }

  async getUserGiftHistory(
    userId: string,
    query: GiftHistoryQueryDto
  ): Promise<{ gifts: GiftLog[]; total: number; page: number; totalPages: number }> {
    const { startDate, endDate, page = 1, limit = 20, giftType } = query;

    const queryBuilder = this.giftLogRepository
      .createQueryBuilder('gift_log')
      .where('gift_log.userId = :userId', { userId });

    // Apply date filters
    if (startDate && endDate) {
      queryBuilder.andWhere('gift_log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('gift_log.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('gift_log.createdAt <= :endDate', { endDate });
    }

    // Apply gift type filter
    if (giftType) {
      queryBuilder.andWhere('gift_log.giftType = :giftType', { giftType });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder
      .orderBy('gift_log.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    const [gifts, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      gifts,
      total,
      page,
      totalPages,
    };
  }

  async getGiftAnalytics(userId: string): Promise<{
    totalGifts: number;
    totalValue: number;
    giftsByType: Array<{ giftType: string; count: number; totalValue: number }>;
    recentActivity: GiftLog[];
  }> {
    const totalGifts = await this.giftLogRepository.count({ where: { userId } });

    const valueResult = await this.giftLogRepository
      .createQueryBuilder('gift_log')
      .select('SUM(gift_log.giftValue)', 'total')
      .where('gift_log.userId = :userId', { userId })
      .andWhere('gift_log.giftValue IS NOT NULL')
      .getRawOne();

    const giftsByType = await this.giftLogRepository
      .createQueryBuilder('gift_log')
      .select(['gift_log.giftType as giftType'])
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(gift_log.giftValue)', 'totalValue')
      .where('gift_log.userId = :userId', { userId })
      .groupBy('gift_log.giftType')
      .getRawMany();

    const recentActivity = await this.giftLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalGifts,
      totalValue: parseFloat(valueResult?.total || '0'),
      giftsByType: giftsByType.map(item => ({
        giftType: item.giftType || 'Unknown',
        count: parseInt(item.count),
        totalValue: parseFloat(item.totalValue || '0'),
      })),
      recentActivity,
    };
  }

  private emitGiftEvents(giftLog: GiftLog): void {
    // Emit gift given event
    const giftGivenEvent = new GiftGivenEvent(
      giftLog.giftId,
      giftLog.userId,
      giftLog.recipientId,
      giftLog.giftType,
      giftLog.giftValue
    );
    this.eventEmitter.emit('gift.given', giftGivenEvent);

    // Emit analytics events
    const senderAnalyticsEvent = new GiftAnalyticsEvent(
      giftLog.userId,
      'gift_sent',
      {
        giftId: giftLog.giftId,
        giftType: giftLog.giftType,
        giftValue: giftLog.giftValue,
        recipientId: giftLog.recipientId,
      }
    );
    this.eventEmitter.emit('analytics.gift', senderAnalyticsEvent);

    // If recipient exists, emit recipient analytics
    if (giftLog.recipientId) {
      const recipientAnalyticsEvent = new GiftAnalyticsEvent(
        giftLog.recipientId,
        'gift_received',
        {
          giftId: giftLog.giftId,
          giftType: giftLog.giftType,
          giftValue: giftLog.giftValue,
          recipientId: giftLog.userId, // sender becomes recipient in this context
        }
      );
      this.eventEmitter.emit('analytics.gift', recipientAnalyticsEvent);
    }
  }
}