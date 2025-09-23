import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FanGiftingService } from '../src/fan-gifting/services/fan-gifting.service';
import { StellarService } from '../src/fan-gifting/services/stellar.service';
import { FanGift } from '../src/fan-gifting/entities/fan-gift.entity';
import { CreateFanGiftDto } from '../src/fan-gifting/dto/create-fan-gift.dto';

describe('FanGiftingService', () => {
  let service: FanGiftingService;
  let repository: Repository<FanGift>;
  let stellarService: StellarService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const mockStellarService = {
    transferTokens: jest.fn(),
    getAccountBalance: jest.fn(),
    validatePublicKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FanGiftingService,
        {
          provide: getRepositoryToken(FanGift),
          useValue: mockRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
      ],
    }).compile();

    service = module.get<FanGiftingService>(FanGiftingService);
    repository = module.get<Repository<FanGift>>(getRepositoryToken(FanGift));
    stellarService = module.get<StellarService>(StellarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGift', () => {
    it('should create a gift successfully', async () => {
      const fanId = 'fan-uuid';
      const createGiftDto: CreateFanGiftDto = {
        giftId: 'gift-uuid',
        creatorId: 'creator-uuid',
        giftType: 'collectible',
        amount: 10.5,
        stellarAsset: 'XLM',
        message: 'Great work!',
      };

      const mockStellarResult = {
        success: true,
        transactionId: 'stellar-tx-123',
        ledger: 50000001,
      };

      const mockGift = {
        id: 'gift-record-uuid',
        ...createGiftDto,
        fanId,
        txId: mockStellarResult.transactionId,
        amount: createGiftDto.amount.toString(),
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockStellarService.transferTokens.mockResolvedValue(mockStellarResult);
      mockRepository.create.mockReturnValue(mockGift);
      mockRepository.save.mockResolvedValue(mockGift);

      const result = await service.createGift(fanId, createGiftDto);

      expect(mockStellarService.transferTokens).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String),
        '10.5',
        'XLM',
        'Great work!'
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockGift);
      expect(result).toEqual(mockGift);
    });

    it('should throw error when gifting to self', async () => {
      const fanId = 'same-uuid';
      const createGiftDto: CreateFanGiftDto = {
        giftId: 'gift-uuid',
        creatorId: 'same-uuid', // Same as fanId
        giftType: 'collectible',
        amount: 10.5,
        stellarAsset: 'XLM',
      };

      await expect(service.createGift(fanId, createGiftDto))
        .rejects
        .toThrow('Cannot gift to yourself');
    });

    it('should handle stellar transfer failure', async () => {
      const fanId = 'fan-uuid';
      const createGiftDto: CreateFanGiftDto = {
        giftId: 'gift-uuid',
        creatorId: 'creator-uuid',
        giftType: 'collectible',
        amount: 10.5,
        stellarAsset: 'XLM',
      };

      const mockStellarResult = {
        success: false,
        error: 'Insufficient balance',
      };

      mockStellarService.transferTokens.mockResolvedValue(mockStellarResult);

      await expect(service.createGift(fanId, createGiftDto))
        .rejects
        .toThrow('Stellar transfer failed: Insufficient balance');
    });
  });

  describe('getGiftHistory', () => {
    it('should return paginated gift history', async () => {
      const userId = 'user-uuid';
      const query = { page: 1, limit: 10 };

      const mockGifts = [
        { id: 'gift1', fanId: userId, creatorId: 'creator1' },
        { id: 'gift2', fanId: 'fan1', creatorId: userId },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockGifts, 2]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getGiftHistory(userId, query);

      expect(result).toEqual({
        data: mockGifts,
        total: 2,
        page: 1,
        totalPages: 1,
      });
    });
  });
});
