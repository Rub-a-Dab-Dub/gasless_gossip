import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReactionsTrackerService } from '../reactions-tracker.service';
import { ReactionTrack } from '../reactions-tracker.entity';
import { ReactionType } from '../dto/reaction-metrics-filter.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReactionsTrackerService', () => {
  let service: ReactionsTrackerService;
  let repository: Repository<ReactionTrack>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockReactionTrack: ReactionTrack = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    messageId: '123e4567-e89b-12d3-a456-426614174001',
    totalCount: 5,
    likeCount: 3,
    loveCount: 2,
    laughCount: 0,
    angryCount: 0,
    sadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsTrackerService,
        {
          provide: getRepositoryToken(ReactionTrack),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReactionsTrackerService>(ReactionsTrackerService);
    repository = module.get<Repository<ReactionTrack>>(getRepositoryToken(ReactionTrack));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReactionsByMessageId', () => {
    it('should return reaction track for existing message', async () => {
      mockRepository.findOne.mockResolvedValue(mockReactionTrack);

      const result = await service.getReactionsByMessageId(mockReactionTrack.messageId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { messageId: mockReactionTrack.messageId },
      });
      expect(result).toEqual(mockReactionTrack);
    });

    it('should return null for non-existing message', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getReactionsByMessageId('non-existing-id');

      expect(result).toBeNull();
    });
  });

  describe('aggregateReaction', () => {
    it('should create new reaction track if none exists', async () => {
      const reactionUpdate = {
        messageId: 'new-message-id',
        reactionType: ReactionType.LIKE,
        count: 1,
      };

      const newReactionTrack = {
        messageId: reactionUpdate.messageId,
        totalCount: 0,
        likeCount: 0,
        loveCount: 0,
        laughCount: 0,
        angryCount: 0,
        sadCount: 0,
      };

      const savedReactionTrack = {
        ...newReactionTrack,
        totalCount: 1,
        likeCount: 1,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newReactionTrack);
      mockRepository.save.mockResolvedValue(savedReactionTrack);

      const result = await service.aggregateReaction(reactionUpdate);

      expect(mockRepository.create).toHaveBeenCalledWith(newReactionTrack);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.totalCount).toBe(1);
      expect(result.likeCount).toBe(1);
    });

    it('should update existing reaction track', async () => {
      const reactionUpdate = {
        messageId: mockReactionTrack.messageId,
        reactionType: ReactionType.LOVE,
        count: 1,
      };

      const updatedTrack = {
        ...mockReactionTrack,
        totalCount: 6,
        loveCount: 3,
      };

      mockRepository.findOne.mockResolvedValue(mockReactionTrack);
      mockRepository.save.mockResolvedValue(updatedTrack);

      const result = await service.aggregateReaction(reactionUpdate);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.totalCount).toBe(6);
      expect(result.loveCount).toBe(3);
    });
  });

  describe('removeReaction', () => {
    it('should remove reaction from existing track', async () => {
      const reactionUpdate = {
        messageId: mockReactionTrack.messageId,
        reactionType: ReactionType.LIKE,
        count: 1,
      };

      const updatedTrack = {
        ...mockReactionTrack,
        totalCount: 4,
        likeCount: 2,
      };

      mockRepository.findOne.mockResolvedValue(mockReactionTrack);
      mockRepository.save.mockResolvedValue(updatedTrack);

      const result = await service.removeReaction(reactionUpdate);

      expect(result.totalCount).toBe(4);
      expect(result.likeCount).toBe(2);
    });

    it('should throw NotFoundException for non-existing message', async () => {
      const reactionUpdate = {
        messageId: 'non-existing-id',
        reactionType: ReactionType.LIKE,
        count: 1,
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.removeReaction(reactionUpdate)).rejects.toThrow(NotFoundException);
    });
  });
});

