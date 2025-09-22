import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsModule } from './predictions.module';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { PredictionVote } from './entities/prediction-vote.entity';
import { StellarService } from '../stellar/stellar.service';

describe('PredictionsModule Integration', () => {
  let module: TestingModule;
  let service: PredictionsService;
  let controller: PredictionsController;

  const mockPredictionRepository = {
    create!: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPredictionVoteRepository = {
    create!: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockStellarService = {
    distributeReward!: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports!: [PredictionsModule],
    })
      .overrideProvider(getRepositoryToken(Prediction))
      .useValue(mockPredictionRepository)
      .overrideProvider(getRepositoryToken(PredictionVote))
      .useValue(mockPredictionVoteRepository)
      .overrideProvider(StellarService)
      .useValue(mockStellarService)
      .compile();

    service = module.get<PredictionsService>(PredictionsService);
    controller = module.get<PredictionsController>(PredictionsController);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should have all required dependencies', () => {
    expect(service).toBeInstanceOf(PredictionsService);
    expect(controller).toBeInstanceOf(PredictionsController);
  });

  describe('Module Structure', () => {
    it('should have PredictionsService', () => {
      expect(service).toBeDefined();
    });

    it('should have PredictionsController', () => {
      expect(controller).toBeDefined();
    });

    it('should have repository dependencies', () => {
      expect(mockPredictionRepository).toBeDefined();
      expect(mockPredictionVoteRepository).toBeDefined();
    });

    it('should have StellarService', () => {
      expect(mockStellarService).toBeDefined();
    });
  });
});
