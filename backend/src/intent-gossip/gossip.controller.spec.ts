import { Test, TestingModule } from '@nestjs/testing';
import { GossipController } from './gossip.controller';
import { IntentGossipService } from './intent-gossip.service';

describe('GossipController', () => {
  let controller: GossipController;
  let intentGossipService: IntentGossipService;

  const mockIntentGossipService = {
    broadcastIntent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GossipController],
      providers: [
        {
          provide: IntentGossipService,
          useValue: mockIntentGossipService,
        },
      ],
    }).compile();

    controller = module.get<GossipController>(GossipController);
    intentGossipService = module.get<IntentGossipService>(IntentGossipService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('broadcastIntent', () => {
    it('should call the service to broadcast intent', async () => {
      const req = { user: { id: 'test-user-id' } };
      const broadcastIntentDto = {
        type: 'chat_message',
        payload: { message: 'Hello World' },
        chains: ['base', 'stellar'],
      };

      mockIntentGossipService.broadcastIntent.mockResolvedValue(undefined);

      const result = await controller.broadcastIntent(req, broadcastIntentDto);

      expect(intentGossipService.broadcastIntent).toHaveBeenCalledWith(
        'test-user-id',
        broadcastIntentDto,
      );
      expect(result).toEqual({
        success: true,
        message: 'Intent broadcast successfully',
      });
    });
  });
});