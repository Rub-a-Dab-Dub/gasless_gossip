import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModerationService } from '../moderation.service';
import { ModerationAction, ActionType } from '../entities/moderation-action.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('ModerationService', () => {
  let service: ModerationService;
  let repository: Repository<ModerationAction>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        {
          provide: getRepositoryToken(ModerationAction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
    repository = module.get<Repository<ModerationAction>>(getRepositoryToken(ModerationAction));
  });

  describe('createModerationAction', () => {
    it('should create a ban action successfully', async () => {
      const mockAction = {
        id: 'action-id',
        roomId: 'room-id',
        targetId: 'user-id',
        moderatorId: 'mod-id',
        actionType: ActionType.BAN,
        isActive: true,
      };

      mockRepository.findOne.mockResolvedValue(null); // No existing action
      mockRepository.create.mockReturnValue(mockAction);
      mockRepository.save.mockResolvedValue(mockAction);

      const dto = {
        roomId: 'room-id',
        targetId: 'user-id',
        actionType: ActionType.BAN,
      };

      const result = await service.createModerationAction('mod-id', dto);

      expect(result).toEqual(mockAction);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAction);
    });

    it('should prevent self-moderation', async () => {
      const dto = {
        roomId: 'room-id',
        targetId: 'mod-id',
        actionType: ActionType.BAN,
      };

      await expect(
        service.createModerationAction('mod-id', dto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should prevent duplicate active actions', async () => {
      const existingAction = { id: 'existing', isActive: true };
      mockRepository.findOne.mockResolvedValue(existingAction);

      const dto = {
        roomId: 'room-id',
        targetId: 'user-id',
        actionType: ActionType.BAN,
      };

      await expect(
        service.createModerationAction('mod-id', dto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('isUserBanned', () => {
    it('should return true for active ban', async () => {
      const banAction = {
        isActive: true,
        expiresAt: null,
      };
      mockRepository.findOne.mockResolvedValue(banAction);

      const result = await service.isUserBanned('user-id', 'room-id');

      expect(result).toBe(true);
    });

    it('should return false for expired ban', async () => {
      const banAction = {
        isActive: true,
        expiresAt: new Date(Date.now() - 1000), // Expired
      };
      mockRepository.findOne.mockResolvedValue(banAction);
      mockRepository.save.mockResolvedValue({ ...banAction, isActive: false });

      const result = await service.isUserBanned('user-id', 'room-id');

      expect(result).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith({ ...banAction, isActive: false });
    });
  });
});
