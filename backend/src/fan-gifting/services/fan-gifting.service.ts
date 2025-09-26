import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FanGift } from '../entities/fan-gift.entity';
import { CreateFanGiftDto } from '../dto/create-fan-gift.dto';
import { GiftHistoryQueryDto } from '../dto/gift-history-query.dto';
import { StellarService } from './stellar.service';

@Injectable()
export class FanGiftingService {
  private readonly logger = new Logger(FanGiftingService.name);

  constructor(
    @InjectRepository(FanGift)
    private fanGiftRepository: Repository<FanGift>,
    private stellarService: StellarService,
  ) {}

  async createGift(fanId: string, createGiftDto: CreateFanGiftDto): Promise<FanGift> {
    try {
      this.logger.log(`Creating gift from fan ${fanId} to creator ${createGiftDto.creatorId}`);

      // Validate creator exists (you might want to check against a users table)
      if (fanId === createGiftDto.creatorId) {
        throw new BadRequestException('Cannot gift to yourself');
      }

      // Mock fan account - in real app, get from user service
      const fanAccount = {
        publicKey: `GFAN${Math.random().toString(36).substr(2, 52)}`,
        secretKey: 'mock_secret_key'
      };

      // Mock creator account
      const creatorPublicKey = `GCRE${Math.random().toString(36).substr(2, 52)}`;

      // Execute Stellar transfer
      const transferResult = await this.stellarService.transferTokens(
        fanAccount,
        creatorPublicKey,
        createGiftDto.amount.toString(),
        createGiftDto.stellarAsset,
        createGiftDto.message
      );

      if (!transferResult.success) {
        throw new BadRequestException(`Stellar transfer failed: ${transferResult.error}`);
      }

      // Create gift record
      const fanGift = this.fanGiftRepository.create({
        giftId: createGiftDto.giftId,
        fanId,
        creatorId: createGiftDto.creatorId,
        txId: transferResult.transactionId,
        giftType: createGiftDto.giftType,
        amount: createGiftDto.amount.toString(),
        stellarAsset: createGiftDto.stellarAsset,
        message: createGiftDto.message || null,
        status: 'completed'
      });

      const savedGift = await this.fanGiftRepository.save(fanGift);
      
      this.logger.log(`Gift created successfully: ${savedGift.id}`);

      // Here you could trigger analytics hooks
      await this.triggerAnalyticsHooks(savedGift);

      return savedGift;
    } catch (error) {
      this.logger.error(`Failed to create gift: ${error.message}`);
      
      // If we have a partial gift record, mark it as failed
      if (error.transactionId) {
        const failedGift = this.fanGiftRepository.create({
          giftId: createGiftDto.giftId,
          fanId,
          creatorId: createGiftDto.creatorId,
          txId: error.transactionId,
          giftType: createGiftDto.giftType,
          amount: createGiftDto.amount.toString(),
          stellarAsset: createGiftDto.stellarAsset,
          message: createGiftDto.message || null,
          status: 'failed'
        });
        
        await this.fanGiftRepository.save(failedGift);
      }
      
      throw error;
    }
  }

  async getGiftHistory(userId: string, query: GiftHistoryQueryDto) {
    const queryBuilder = this.fanGiftRepository
      .createQueryBuilder('gift')
      .where('gift.fanId = :userId OR gift.creatorId = :userId', { userId });

    if (query.status) {
      queryBuilder.andWhere('gift.status = :status', { status: query.status });
    }

    if (query.creatorId) {
      queryBuilder.andWhere('gift.creatorId = :creatorId', { creatorId: query.creatorId });
    }

    const [gifts, total] = await queryBuilder
      .orderBy('gift.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      data: gifts,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit)
    };
  }

  async getGiftById(giftId: string): Promise<FanGift> {
    const gift = await this.fanGiftRepository.findOne({ where: { id: giftId } });
    
    if (!gift) {
      throw new NotFoundException(`Gift with ID ${giftId} not found`);
    }

    return gift;
  }

  async getGiftStats(userId: string) {
    const [sentCount, sentSum, receivedCount, receivedSum] = await Promise.all([
      this.fanGiftRepository.count({ where: { fanId: userId, status: 'completed' } }),
      this.fanGiftRepository
        .createQueryBuilder('gift')
        .select('SUM(CAST(gift.amount AS DECIMAL))', 'total')
        .where('gift.fanId = :userId AND gift.status = :status', { userId, status: 'completed' })
        .getRawOne(),
      this.fanGiftRepository.count({ where: { creatorId: userId, status: 'completed' } }),
      this.fanGiftRepository
        .createQueryBuilder('gift')
        .select('SUM(CAST(gift.amount AS DECIMAL))', 'total')
        .where('gift.creatorId = :userId AND gift.status = :status', { userId, status: 'completed' })
        .getRawOne()
    ]);

    return {
      sent: {
        count: sentCount,
        totalAmount: sentSum?.total || '0'
      },
      received: {
        count: receivedCount,
        totalAmount: receivedSum?.total || '0'
      }
    };
  }

  private async triggerAnalyticsHooks(gift: FanGift): Promise<void> {
    try {
      // Here you would integrate with your analytics service
      // Examples: Mixpanel, Segment, custom analytics, etc.
      
      const analyticsEvent = {
        event: 'gift_sent',
        userId: gift.fanId,
        properties: {
          giftId: gift.giftId,
          creatorId: gift.creatorId,
          giftType: gift.giftType,
          amount: gift.amount,
          stellarAsset: gift.stellarAsset,
          txId: gift.txId,
          timestamp: gift.createdAt
        }
      };

      this.logger.log(`Analytics event triggered: ${JSON.stringify(analyticsEvent)}`);
      
      // Mock analytics call
      // await this.analyticsService.track(analyticsEvent);
      
    } catch (error) {
      this.logger.warn(`Failed to trigger analytics hooks: ${error.message}`);
      // Don't throw here - analytics shouldn't break the main flow
    }
  }
}
