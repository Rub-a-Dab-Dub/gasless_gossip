import { Test, TestingModule } from '@nestjs/testing';
import { ReputationController } from './reputation.controller';
import { ReputationService } from './reputation.service';

describe('ReputationController', () => {
  let controller: ReputationController;
  let service: ReputationService;

  beforeEach(async () => {
    service = {
      getReputation: jest.fn(),
      updateReputation: jest.fn(),
      calculateReputationFromActions: jest.fn(),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReputationController],
      providers: [{ provide: ReputationService, useValue: service }],
    }).compile();
    controller = module.get<ReputationController>(ReputationController);
  });

  it('should get reputation for user', async () => {
    const reputation = { id: 1, userId: 1, score: 10 };
    (service.getReputation as jest.Mock).mockResolvedValue(reputation);
    const result = await controller.getReputation('1');
    expect(result).toEqual(reputation);
  });

  it('should update reputation', async () => {
    const dto = { userId: 1, scoreChange: 5 };
    const updatedReputation = { id: 1, userId: 1, score: 15 };
    (service.updateReputation as jest.Mock).mockResolvedValue(updatedReputation);
    const result = await controller.updateReputation(dto);
    expect(result).toEqual(updatedReputation);
  });

  it('should calculate reputation from actions', async () => {
    const reputation = { id: 1, userId: 1, score: 17.0 };
    (service.calculateReputationFromActions as jest.Mock).mockResolvedValue(reputation);
    const result = await controller.calculateReputation('1');
    expect(result).toEqual(reputation);
  });
});