import { Test, TestingModule } from '@nestjs/testing';
import { FanGiftingController } from '../src/fan-gifting/controllers/fan-gifting.controller';
import { FanGiftingService } from '../src/fan-gifting/services/fan-gifting.service';
import { CreateFanGiftDto } from '../src/fan-gifting/dto/create-fan-gift.dto';

describe('FanGiftingController', () => {
  let controller: FanGiftingController;
  let service: FanGiftingService;

  const mockService = {
    createGift: jest.fn(),
    getGiftHistory: jest.fn(),
    getGiftStats: jest.fn(),
    getGiftById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FanGiftingController],
      providers: [
        {
          provide: FanGiftingService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FanGiftingController>(FanGiftingController);
    service = module.get<FanGiftingService>(FanGiftingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGift', () => {
    it('should create a gift', async () => {
      const createGiftDto: CreateFanGiftDto = {
        giftId: 'gift-uuid',
        creatorId: 'creator-uuid',
        giftType: 'collectible',
        amount: 10.5,
        stellarAsset: 'XLM',
        message: 'Great work!',
      };

      const mockRequest = {
        user: { id: 'fan-uuid' },
      };

      const expectedResult = {
        id: 'gift-record-uuid',
        ...createGiftDto,
        fanId: 'fan-uuid',
        txId: 'stellar-tx-123',
        status: 'completed',
      };

      mockService.createGift.mockResolvedValue(expectedResult);

      const result = await controller.createGift(createGiftDto, mockRequest);

      expect(service.createGift).toHaveBeenCalledWith('fan-uuid', createGiftDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGiftHistory', () => {
    it('should return gift history', async () => {
      const userId = 'user-uuid';
      const query = { page: 1, limit: 10 };
      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };

      mockService.getGiftHistory.mockResolvedValue(expectedResult);

      const result = await controller.getGiftHistory(userId, query);

      expect(service.getGiftHistory).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(expectedResult);
    });
  });
});

