import { Test, TestingModule } from '@nestjs/testing';
import { TipsController } from '../tips.controller';
import { TipsService } from '../tips.service';

describe('TipsController', () => {
  let controller: TipsController;
  let service: TipsService;

  const mockTipsService = {
    createTip: jest.fn(),
    getUserTips: jest.fn(),
    getTipAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipsController],
      providers: [
        {
          provide: TipsService,
          useValue: mockTipsService,
        },
      ],
    }).compile();

    controller = module.get<TipsController>(TipsController);
    service = module.get<TipsService>(TipsService);
  });

  describe('createTip', () => {
    it('should create a tip', async () => {
      const createTipDto = { amount: 10, receiverId: 'user2' };
      const req = { user: { id: 'user1' } };
      const expectedResult = {
        id: 'tip-id',
        amount: 10,
        receiverId: 'user2',
        senderId: 'user1',
        txId: 'stellar_abc',
        createdAt: new Date(),
      };

      mockTipsService.createTip.mockResolvedValue(expectedResult);

      const result = await controller.createTip(createTipDto, req);

      expect(service.createTip).toHaveBeenCalledWith(createTipDto, 'user1');
      expect(result).toBe(expectedResult);
    });
  });

  describe('getUserTips', () => {
    it('should return user tips', async () => {
      const userId = 'user1';
      const req = { user: { id: 'user1' } };
      const expectedTips = [
        {
          id: 'tip-1',
          amount: 10,
          receiverId: 'user1',
          senderId: 'user2',
          txId: 'tx-1',
          createdAt: new Date(),
        },
      ];

      mockTipsService.getUserTips.mockResolvedValue(expectedTips);

      const result = await controller.getUserTips(userId, req);

      expect(service.getUserTips).toHaveBeenCalledWith(userId, 'user1');
      expect(result).toBe(expectedTips);
    });
  });
});