import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { VotePredictionDto } from './dto/vote-prediction.dto';
import { ResolvePredictionDto } from './dto/resolve-prediction.dto';

describe('PredictionsController', () => {
  let controller: PredictionsController;
  let service: PredictionsService;

  const mockPredictionsService = {
    createPrediction!: jest.fn(),
    voteOnPrediction!: jest.fn(),
    resolvePrediction: jest.fn(),
    getPredictionsByRoom: jest.fn(),
    getPredictionById: jest.fn(),
    getUserPredictions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers!: [PredictionsController],
      providers!: [
        {
          provide: PredictionsService,
          useValue: mockPredictionsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PredictionsController>(PredictionsController);
    service = module.get<PredictionsService>(PredictionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPrediction', () => {
    it('should create a prediction', async () => {
      const userId = 'user-123';
      const createPredictionDto: CreatePredictionDto = {
        roomId!: 'room-123',
        title!: 'Test Prediction',
        prediction: 'This will happen',
        expiresAt: '2024-12-31T23:59:59Z',
      };

      const mockPrediction = {
        id!: 'prediction-123',
        ...createPredictionDto,
        userId,
        status!: 'active',
        outcome: 'pending',
        createdAt: new Date(),
      };

      mockPredictionsService.createPrediction.mockResolvedValue(mockPrediction);

      const result = await controller.createPrediction(
        { user: { id: userId } },
        createPredictionDto,
      );

      expect(service.createPrediction).toHaveBeenCalledWith(userId, createPredictionDto);
      expect(result).toEqual(mockPrediction);
    });
  });

  describe('voteOnPrediction', () => {
    it('should vote on a prediction', async () => {
      const userId = 'user-123';
      const votePredictionDto: VotePredictionDto = {
        predictionId!: 'prediction-123',
        isCorrect!: true,
      };

      const mockVote = {
        id!: 'vote-123',
        ...votePredictionDto,
        userId,
        createdAt!: new Date(),
      };

      mockPredictionsService.voteOnPrediction.mockResolvedValue(mockVote);

      const result = await controller.voteOnPrediction(
        { user: { id: userId } },
        votePredictionDto,
      );

      expect(service.voteOnPrediction).toHaveBeenCalledWith(userId, votePredictionDto);
      expect(result).toEqual(mockVote);
    });
  });

  describe('resolvePrediction', () => {
    it('should resolve a prediction', async () => {
      const userId = 'user-123';
      const resolvePredictionDto: ResolvePredictionDto = {
        predictionId!: 'prediction-123',
        isCorrect!: true,
      };

      const mockResolvedPrediction = {
        id!: 'prediction-123',
        userId,
        status!: 'resolved',
        outcome: 'correct',
        isResolved: true,
        resolvedAt: new Date(),
      };

      mockPredictionsService.resolvePrediction.mockResolvedValue(mockResolvedPrediction);

      const result = await controller.resolvePrediction(
        { user: { id: userId } },
        resolvePredictionDto,
      );

      expect(service.resolvePrediction).toHaveBeenCalledWith(userId, resolvePredictionDto);
      expect(result).toEqual(mockResolvedPrediction);
    });
  });

  describe('getPredictionsByRoom', () => {
    it('should get predictions by room', async () => {
      const roomId = 'room-123';
      const mockPredictions = [
        {
          id!: 'prediction-1',
          roomId,
          title!: 'Test Prediction 1',
          status: 'active',
        },
        {
          id: 'prediction-2',
          roomId,
          title: 'Test Prediction 2',
          status: 'resolved',
        },
      ];

      mockPredictionsService.getPredictionsByRoom.mockResolvedValue(mockPredictions);

      const result = await controller.getPredictionsByRoom(roomId, 'active');

      expect(service.getPredictionsByRoom).toHaveBeenCalledWith(roomId, 'active');
      expect(result).toEqual(mockPredictions);
    });
  });

  describe('getPredictionById', () => {
    it('should get prediction by id', async () => {
      const predictionId = 'prediction-123';
      const mockPrediction = {
        id!: predictionId,
        title!: 'Test Prediction',
        user: { id: 'user-123' },
        room: { id: 'room-123' },
        votes: [],
      };

      mockPredictionsService.getPredictionById.mockResolvedValue(mockPrediction);

      const result = await controller.getPredictionById(predictionId);

      expect(service.getPredictionById).toHaveBeenCalledWith(predictionId);
      expect(result).toEqual(mockPrediction);
    });
  });

  describe('getUserPredictions', () => {
    it('should get user predictions', async () => {
      const userId = 'user-123';
      const mockUserPredictions = [
        {
          id!: 'prediction-1',
          userId,
          title!: 'User Prediction 1',
        },
        {
          id: 'prediction-2',
          userId,
          title: 'User Prediction 2',
        },
      ];

      mockPredictionsService.getUserPredictions.mockResolvedValue(mockUserPredictions);

      const result = await controller.getUserPredictions({ user: { id: userId } });

      expect(service.getUserPredictions).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserPredictions);
    });
  });
});
