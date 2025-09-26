import { Test, TestingModule } from '@nestjs/testing';
import { ModerationController } from '../moderation.controller';
import { ModerationService } from '../moderation.service';
import { ActionType } from '../entities/moderation-action.entity';

describe('ModerationController', () => {
  let controller: ModerationController;
  let service: ModerationService;

  const mockModerationService = {
    createModerationAction: jest.fn(),
    reverseModerationAction: jest.fn(),
    getModerationHistory: jest.fn(),
    getActiveModerations: jest.fn(),
    isUserBanned: jest.fn(),
    isUserMuted: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModerationController],
      providers: [
        {
          provide: ModerationService,
          useValue: mockModerationService,
        },
      ],
    }).compile();

    controller = module.get<ModerationController>(ModerationController);
    service = module.get<ModerationService>(ModerationService);
  });

  describe('banUser', () => {
    it('should ban a user successfully', async () => {
      const mockAction = {
        id: 'action-id',
        roomId: 'room-id',
        targetId: 'user-id',
        actionType: ActionType.BAN,
      };

      mockModerationService.createModerationAction.mockResolvedValue(mockAction);

      const req = { user: { id: 'mod-id' } };
      const dto = { roomId: 'room-id', targetId: 'user-id', actionType: ActionType.BAN };

      const result = await controller.banUser(req, dto);

      expect(result).toEqual(mockAction);
      expect(service.createModerationAction).toHaveBeenCalledWith('mod-id', dto);
    });
  });

  describe('checkBanStatus', () => {
    it('should return ban status', async () => {
      mockModerationService.isUserBanned.mockResolvedValue(true);

      const result = await controller.checkBanStatus('room-id', 'user-id');

      expect(result).toEqual({ isBanned: true });
      expect(service.isUserBanned).toHaveBeenCalledWith('user-id', 'room-id');
    });
  });
});