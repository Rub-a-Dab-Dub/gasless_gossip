import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { GiftsGivenService } from './gifts-given.service';
import { GiftLog } from './entities/gift-log.entity';
import { CreateGiftLogDto } from './dto/create-gift-log.dto';

describe('GiftsGivenService', () => {
  let service: GiftsGivenService;
  let repository: Repository<GiftLog>;
  let eventEmitter: EventEmitter2;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftsGivenService,
        {
          provide: getRepositoryToken(GiftLog),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<GiftsGivenService>(GiftsGivenService);
    repository = module.get<Repository<GiftLog>>(getRepositoryToken(GiftLog));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logGift', () => {
    it('should log a gift and emit events', async () => {
      const createGiftLogDto: CreateGiftLogDto = {
        giftId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        recipientId: '123e4567-e89b-12d3-a456-426614174002',
        giftType: 'flower',
        giftValue: 10.50,
      };

      const mockGiftLog = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        ...createGiftLogDto,
        createdAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockGiftLog);
      mockRepository.save.mockResolvedValue(mockGiftLog);

      const result = await service.logGift(createGiftLogDto);

      expect(repository.create).toHaveBeenCalledWith(createGiftLogDto);
      expect(repository.save).toHaveBeenCalledWith(mockGiftLog);
      expect(eventEmitter.emit).toHaveBeenCalledWith('gift.given', expect.any(Object));
      expect(eventEmitter.emit).toHaveBeenCalledWith('analytics.gift', expect.any(Object));
      expect(result).toEqual(mockGiftLog);
    });
  });

  describe('getUserGiftHistory', () => {
    it('should return paginated gift history', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const query = { page: 1, limit: 20 };

      const mockGifts = [
        {
          id: '1',
          giftId: '123e4567-e89b-12d3-a456-426614174000',
          userId,
          createdAt: new Date(),
        },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockGifts, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getUserGiftHistory(userId, query);

      expect(result).toEqual({
        gifts: mockGifts,
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });
  });
});
