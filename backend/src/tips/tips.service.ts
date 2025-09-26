import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tip } from './entities/tip.entity';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipResponseDto } from './dto/tip-response.dto';
import { TipsAnalyticsDto } from './dto/tips-analytics.dto';
import { StellarService } from './services/stellar.service';
import { AnalyticsService } from './services/analytics.service';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tip)
    private tipsRepository: Repository<Tip>,
    private stellarService: StellarService,
    private analyticsService: AnalyticsService,
  ) {}

  async createTip(createTipDto: CreateTipDto, senderId: string): Promise<TipResponseDto> {
    // Prevent self-tipping
    if (createTipDto.receiverId === senderId) {
      throw new BadRequestException('Cannot tip yourself');
    }

    // Mock user validation - replace with actual user service
    const receiver = await this.validateUser(createTipDto.receiverId);
    const sender = await this.validateUser(senderId);

    try {
      // Process Stellar transaction
      const stellarTransaction = await this.stellarService.transferTokens({
        amount: createTipDto.amount,
        receiverPublicKey: receiver.stellarPublicKey || 'mock_receiver_key',
        senderPrivateKey: sender.stellarPrivateKey || 'mock_sender_key',
        memo: `Whisper tip from ${sender.username}`
      });

      // Save tip to database
      const tip = this.tipsRepository.create({
        amount: createTipDto.amount,
        receiverId: createTipDto.receiverId,
        senderId,
        txId: stellarTransaction.hash,
      });

      const savedTip = await this.tipsRepository.save(tip);

      // Emit analytics events
      this.analyticsService.emitTipEvent({
        eventType: 'tip_sent',
        userId: senderId,
        amount: createTipDto.amount,
        txId: stellarTransaction.hash,
        timestamp: savedTip.createdAt
      });

      this.analyticsService.emitTipEvent({
        eventType: 'tip_received',
        userId: createTipDto.receiverId,
        amount: createTipDto.amount,
        txId: stellarTransaction.hash,
        timestamp: savedTip.createdAt
      });

      return this.mapToResponseDto(savedTip);
    } catch (error) {
      throw new BadRequestException(`Failed to process tip: ${error.message}`);
    }
  }

  async getUserTips(userId: string, requestingUserId?: string): Promise<TipResponseDto[]> {
    // Basic privacy check - users can see their own tips, others see limited info
    const isOwnProfile = userId === requestingUserId;

    const queryBuilder = this.tipsRepository
      .createQueryBuilder('tip')
      .leftJoinAndSelect('tip.sender', 'sender')
      .leftJoinAndSelect('tip.receiver', 'receiver')
      .where('tip.receiverId = :userId OR tip.senderId = :userId', { userId })
      .orderBy('tip.createdAt', 'DESC');

    if (!isOwnProfile) {
      // Non-owners can only see tips where the user is the receiver
      queryBuilder.andWhere('tip.receiverId = :userId', { userId });
    }

    const tips = await queryBuilder.getMany();
    return tips.map(tip => this.mapToResponseDto(tip, !isOwnProfile));
  }

  async getTipAnalytics(userId: string): Promise<TipsAnalyticsDto> {
    const [received, sent] = await Promise.all([
      this.tipsRepository
        .createQueryBuilder('tip')
        .select('COUNT(*)', 'count')
        .addSelect('SUM(tip.amount)', 'total')
        .where('tip.receiverId = :userId', { userId })
        .getRawOne(),
      this.tipsRepository
        .createQueryBuilder('tip')
        .select('COUNT(*)', 'count')
        .addSelect('SUM(tip.amount)', 'total')
        .where('tip.senderId = :userId', { userId })
        .getRawOne()
    ]);

    return {
      totalTipsReceived: parseInt(received.count) || 0,
      totalTipsSent: parseInt(sent.count) || 0,
      totalAmountReceived: parseFloat(received.total) || 0,
      totalAmountSent: parseFloat(sent.total) || 0,
      tipCount: (parseInt(received.count) || 0) + (parseInt(sent.count) || 0)
    };
  }

  private async validateUser(userId: string): Promise<any> {
    // Mock user validation - replace with actual UserService
    const mockUsers = {
      'user1': { id: 'user1', username: 'alice', stellarPublicKey: 'GALICE...', stellarPrivateKey: 'SALICE...' },
      'user2': { id: 'user2', username: 'bob', stellarPublicKey: 'GBOB...', stellarPrivateKey: 'SBOB...' },
      'user3': { id: 'user3', username: 'charlie', stellarPublicKey: 'GCHARLIE...', stellarPrivateKey: 'SCHARLIE...' }
    };

    const user = mockUsers[userId];
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  private mapToResponseDto(tip: Tip, limitedInfo = false): TipResponseDto {
    const response: TipResponseDto = {
      id: tip.id,
      amount: tip.amount,
      receiverId: tip.receiverId,
      senderId: limitedInfo ? null : tip.senderId, // Hide sender for privacy
      txId: tip.txId,
      createdAt: tip.createdAt,
    };

    if (tip.receiver) {
      response.receiver = {
        id: tip.receiver.id,
        username: tip.receiver.username
      };
    }

    if (tip.sender && !limitedInfo) {
      response.sender = {
        id: tip.sender.id,
        username: tip.sender.username
      };
    }

    return response;
  }
}
