import { Controller, Post, Get, Body, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Adjust based on your auth implementation
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipResponseDto } from './dto/tip-response.dto';
import { TipsAnalyticsDto } from './dto/tips-analytics.dto';

@Controller('tips')
@UseGuards(AuthGuard('jwt')) // Enforce authentication on all endpoints
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  async createTip(
    @Body() createTipDto: CreateTipDto,
    @Request() req: any
  ): Promise<TipResponseDto> {
    const senderId = req.user.id; // Extract user ID from JWT token
    return this.tipsService.createTip(createTipDto, senderId);
  }

  @Get(':userId')
  async getUserTips(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Request() req: any
  ): Promise<TipResponseDto[]> {
    const requestingUserId = req.user.id;
    return this.tipsService.getUserTips(userId, requestingUserId);
  }

  @Get(':userId/analytics')
  async getUserTipAnalytics(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Request() req: any
  ): Promise<TipsAnalyticsDto> {
    const requestingUserId = req.user.id;
    
    // Only allow users to see their own analytics
    if (userId !== requestingUserId) {
      throw new Error('Access denied: Can only view your own analytics');
    }
    
    return this.tipsService.getTipAnalytics(userId);
  }
}

// src/tips/tips.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { StellarService } from './services/stellar.service';
import { AnalyticsService } from './services/analytics.service';
import { Tip } from './entities/tip.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tip]),
    ConfigModule,
    EventEmitterModule.forRoot() // Enable event emitting
  ],
  controllers: [TipsController],
  providers: [TipsService, StellarService, AnalyticsService],
  exports: [TipsService, StellarService, AnalyticsService] // Export for use in other modules
})
export class TipsModule {}

// src/tips/tests/tips.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipsService } from '../tips.service';
import { StellarService } from '../services/stellar.service';
import { AnalyticsService } from '../services/analytics.service';
import { Tip } from '../entities/tip.entity';
import { BadRequestException } from '@nestjs/common';

describe('TipsService', () => {
  let service: TipsService;
  let repository: Repository<Tip>;
  let stellarService: StellarService;
  let analyticsService: AnalyticsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    })),
  };

  const mockStellarService = {
    transferTokens: jest.fn(),
    getTransactionStatus: jest.fn(),
  };

  const mockAnalyticsService = {
    emitTipEvent: jest.fn(),
    trackUserEngagement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipsService,
        {
          provide: getRepositoryToken(Tip),
          useValue: mockRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    service = module.get<TipsService>(TipsService);
    repository = module.get<Repository<Tip>>(getRepositoryToken(Tip));
    stellarService = module.get<StellarService>(StellarService);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('createTip', () => {
    it('should create a tip successfully', async () => {
      const createTipDto = { amount: 10, receiverId: 'user2' };
      const senderId = 'user1';
      
      const mockStellarTx = {
        hash: 'stellar_abc123',
        amount: '10',
        from: 'mock_sender',
        to: 'mock_receiver',
        timestamp: new Date(),
      };

      const mockTip = {
        id: 'tip-id',
        amount: 10,
        receiverId: 'user2',
        senderId: 'user1',
        txId: 'stellar_abc123',
        createdAt: new Date(),
      };

      mockStellarService.transferTokens.mockResolvedValue(mockStellarTx);
      mockRepository.create.mockReturnValue(mockTip);
      mockRepository.save.mockResolvedValue(mockTip);

      const result = await service.createTip(createTipDto, senderId);

      expect(mockStellarService.transferTokens).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith({
        amount: 10,
        receiverId: 'user2',
        senderId: 'user1',
        txId: 'stellar_abc123',
      });
      expect(mockAnalyticsService.emitTipEvent).toHaveBeenCalledTimes(2);
      expect(result.txId).toBe('stellar_abc123');
    });

    it('should throw error when trying to tip yourself', async () => {
      const createTipDto = { amount: 10, receiverId: 'user1' };
      const senderId = 'user1';

      await expect(service.createTip(createTipDto, senderId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUserTips', () => {
    it('should return user tips', async () => {
      const userId = 'user1';
      const mockTips = [
        {
          id: 'tip-1',
          amount: 10,
          receiverId: 'user1',
          senderId: 'user2',
          txId: 'tx-1',
          createdAt: new Date(),
        },
      ];

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getMany.mockResolvedValue(mockTips);

      const result = await service.getUserTips(userId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('tip');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('tip-1');
    });
  });
});
