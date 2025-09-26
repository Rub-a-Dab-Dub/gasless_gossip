import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { AuthGuard } from '../auth/auth.guard';

const mockSessionsService = {
  findByUserId: jest.fn(),
  revoke: jest.fn(),
  findById: jest.fn(),
};

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return sessions for user', async () => {
      const userId = 'user1';
      const sessions = [
        { id: '1', userId, createdAt: new Date(), expiresAt: new Date() },
      ];
      const req = { user: { sub: userId } };

      mockSessionsService.findByUserId.mockResolvedValue(sessions);

      const result = await controller.findByUserId(userId, req);

      expect(service.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(sessions);
    });
  });

  describe('revoke', () => {
    it('should revoke session', async () => {
      const sessionId = '1';
      const req = { user: { sub: 'user1' } };
      const session = { id: sessionId, userId: 'user1' };

      mockSessionsService.findById.mockResolvedValue(session);
      mockSessionsService.revoke.mockResolvedValue(undefined);

      await controller.revoke(sessionId, req);

      expect(service.findById).toHaveBeenCalledWith(sessionId);
      expect(service.revoke).toHaveBeenCalledWith(sessionId);
    });
  });
});