import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from '../polls.controller';
import { PollsService } from '../services/polls.service';

describe('PollsController', () => {
  let controller: PollsController;

  const mockService = {
    createPoll: jest.fn(),
    vote: jest.fn(),
    listPollsForRoom: jest.fn(),
  } as unknown as PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        {
          provide: PollsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PollsController>(PollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


