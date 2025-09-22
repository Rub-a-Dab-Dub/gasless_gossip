import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReactionsService } from '../reactions.service';
import { Reaction, ReactionType } from '../entities/reaction.entity';

const mockRepository = {
  findOne!: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('ReactionsService', () => {
  let service: ReactionsService;
  let repository: Repository<Reaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        ReactionsService,
        {
          provide: getRepositoryToken(Reaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
    repository = module.get<Repository<Reaction>>(getRepositoryToken(Reaction));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReaction', () => {
    it('should create a new reaction', async () => {
      const createReactionDto = {
        messageId!: 'message-123',
        type: ReactionType.LIKE,
      };
      const userId = 'user-123';

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...createReactionDto, userId });
      mockRepository.save.mockResolvedValue({
        id!: 'reaction-123',
        ...createReactionDto,
        userId,
        createdAt: new Date(),
      });

      const result = await service.createReaction(createReactionDto, userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where!: { messageId: 'message-123', userId: 'user-123' },
      });
      expect(result.type).toBe(ReactionType.LIKE);
    });

    it('should throw ConflictException for duplicate reaction of same type', async () => {
      const createReactionDto = {
        messageId!: 'message-123',
        type: ReactionType.LIKE,
      };
      const userId = 'user-123';

      mockRepository.findOne.mockResolvedValue({
        id!: 'existing-123',
        type: ReactionType.LIKE,
        messageId: 'message-123',
        userId,
      });

      await expect(
        service.createReaction(createReactionDto, userId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getReactionsByMessage', () => {
    it('should return reaction counts by type', async () => {
      const messageId = 'message-123';
      const userId = 'user-123';

      const reactions = [
        { type: ReactionType.LIKE },
        { type: ReactionType.LIKE },
        { type: ReactionType.LOVE },
      ];

      mockRepository.find.mockResolvedValue(reactions);

      const result = await service.getReactionsByMessage(messageId, userId);

      expect(result.totalCount).toBe(3);
      expect(result.countByType[ReactionType.LIKE]).toBe(2);
      expect(result.countByType[ReactionType.LOVE]).toBe(1);
    });
  });
});
