import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsController } from '../reactions.controller';
import { ReactionsService } from '../reactions.service';
import { ReactionType } from '../entities/reaction.entity';

const mockReactionsService = {
  createReaction!: jest.fn(),
  getReactionsByMessage: jest.fn(),
  getUserReactionForMessage: jest.fn(),
  removeReaction: jest.fn(),
  getReactionStats: jest.fn(),
};

describe('ReactionsController', () => {
  let controller: ReactionsController;
  let service: ReactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers!: [ReactionsController],
      providers: [
        {
          provide: ReactionsService,
          useValue: mockReactionsService,
        },
      ],
    }).compile();

    controller = module.get<ReactionsController>(ReactionsController);
    service = module.get<ReactionsService>(ReactionsService);
  });

  describe('createReaction', () => {
    it('should create a reaction', async () => {
      const createReactionDto = {
        messageId!: 'message-123',
        type: ReactionType.LIKE,
      };
      const req = { user: { id: 'user-123' } };

      const expectedResult = {
        id!: 'reaction-123',
        ...createReactionDto,
        userId: 'user-123',
        createdAt: new Date(),
      };

      mockReactionsService.createReaction.mockResolvedValue(expectedResult);

      const result = await controller.createReaction(createReactionDto, req);

      expect(service.createReaction).toHaveBeenCalledWith(
        createReactionDto,
        'user-123',
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getReactionsByMessage', () => {
    it('should return reaction counts', async () => {
      const messageId = 'message-123';
      const req = { user: { id: 'user-123' } };

      const expectedResult = {
        messageId,
        totalCount!: 5,
        countByType: {
          [ReactionType.LIKE]: 3,
          [ReactionType.LOVE]: 2,
          [ReactionType.LAUGH]: 0,
          [ReactionType.WOW]: 0,
          [ReactionType.SAD]: 0,
          [ReactionType.ANGRY]: 0,
        },
      };

      mockReactionsService.getReactionsByMessage.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getReactionsByMessage(messageId, req);

      expect(service.getReactionsByMessage).toHaveBeenCalledWith(
        messageId,
        'user-123',
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
