import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PredictionsService } from './predictions.service';
import { Prediction, PredictionStatus, PredictionOutcome } from './entities/prediction.entity';
import { PredictionVote } from './entities/prediction-vote.entity';
import { StellarService } from '../stellar/stellar.service';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PredictionsService', () => {
  let service: PredictionsService;
  let predictionRepository: Repository<Prediction>;
  let predictionVoteRepository: Repository<PredictionVote>;
  let stellarService: StellarService;
  let dataSource: DataSource;

  const mockPredictionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPredictionVoteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockStellarService = {
    distributeReward: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictionsService,
        {
          provide: getRepositoryToken(Prediction),
          useValue: mockPredictionRepository,
        },
        {
          provide: getRepositoryToken(PredictionVote),
          useValue: mockPredictionVoteRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<PredictionsService>(PredictionsService);
    predictionRepository = module.get<Repository<Prediction>>(getRepositoryToken(Prediction));
    predictionVoteRepository = module.get<Repository<PredictionVote>>(getRepositoryToken(PredictionVote));
    stellarService = module.get<StellarService>(StellarService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPrediction', () => {
    it('should create a prediction successfully', async () => {
      const userId = 'user-123';
      const createPredictionDto = {
        roomId: 'room-123',
        title: 'Test Prediction',
        description: 'Test Description',
        prediction: 'This will happen in the future',
        expiresAt: '2024-12-31T23:59:59Z',
      };

      const mockPrediction = {
        id: 'prediction-123',
        ...createPredictionDto,
        userId,
        status: PredictionStatus.ACTIVE,
        outcome: PredictionOutcome.PENDING,
        createdAt: new Date(),
      };

      mockPredictionRepository.create.mockReturnValue(mockPrediction);
      mockPredictionRepository.save.mockResolvedValue(mockPrediction);

      const result = await service.createPrediction(userId, createPredictionDto);

      expect(mockPredictionRepository.create).toHaveBeenCalledWith({
        roomId: createPredictionDto.roomId,
        userId,
        title: createPredictionDto.title,
        description: createPredictionDto.description,
        prediction: createPredictionDto.prediction,
        expiresAt: new Date(createPredictionDto.expiresAt),
        status: PredictionStatus.ACTIVE,
        outcome: PredictionOutcome.PENDING,
      });
      expect(result).toEqual(mockPrediction);
    });

    it('should throw BadRequestException if expiration date is in the past', async () => {
      const userId = 'user-123';
      const createPredictionDto = {
        roomId: 'room-123',
        title: 'Test Prediction',
        prediction: 'This will happen in the future',
        expiresAt: '2020-01-01T00:00:00Z', // Past date
      };

      await expect(service.createPrediction(userId, createPredictionDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('voteOnPrediction', () => {
    it('should vote on a prediction successfully', async () => {
      const userId = 'user-123';
      const votePredictionDto = {
        predictionId: 'prediction-123',
        isCorrect: true,
      };

      const mockPrediction = {
        id: 'prediction-123',
        status: PredictionStatus.ACTIVE,
        expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
        room: { id: 'room-123' },
      };

      const mockVote = {
        id: 'vote-123',
        ...votePredictionDto,
        userId,
        createdAt: new Date(),
      };

      mockPredictionRepository.findOne.mockResolvedValue(mockPrediction);
      mockPredictionVoteRepository.findOne.mockResolvedValue(null); // No existing vote
      mockPredictionVoteRepository.create.mockReturnValue(mockVote);
      mockPredictionVoteRepository.save.mockResolvedValue(mockVote);
      mockPredictionRepository.update.mockResolvedValue({});

      const result = await service.voteOnPrediction(userId, votePredictionDto);

      expect(mockPredictionVoteRepository.create).toHaveBeenCalledWith({
        predictionId: votePredictionDto.predictionId,
        userId,
        isCorrect: votePredictionDto.isCorrect,
      });
      expect(result).toEqual(mockVote);
    });

    it('should throw NotFoundException if prediction does not exist', async () => {
      const userId = 'user-123';
      const votePredictionDto = {
        predictionId: 'non-existent',
        isCorrect: true,
      };

      mockPredictionRepository.findOne.mockResolvedValue(null);

      await expect(service.voteOnPrediction(userId, votePredictionDto))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user has already voted', async () => {
      const userId = 'user-123';
      const votePredictionDto = {
        predictionId: 'prediction-123',
        isCorrect: true,
      };

      const mockPrediction = {
        id: 'prediction-123',
        status: PredictionStatus.ACTIVE,
        expiresAt: new Date(Date.now() + 86400000),
      };

      const existingVote = {
        id: 'existing-vote',
        predictionId: 'prediction-123',
        userId,
        isCorrect: false,
      };

      mockPredictionRepository.findOne.mockResolvedValue(mockPrediction);
      mockPredictionVoteRepository.findOne.mockResolvedValue(existingVote);

      await expect(service.voteOnPrediction(userId, votePredictionDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('resolvePrediction', () => {
    it('should resolve a prediction and distribute rewards', async () => {
      const userId = 'user-123';
      const resolvePredictionDto = {
        predictionId: 'prediction-123',
        isCorrect: true,
      };

      const mockPrediction = {
        id: 'prediction-123',
        userId,
        isResolved: false,
        votes: [
          {
            id: 'vote-1',
            userId: 'voter-1',
            isCorrect: true,
            user: { id: 'voter-1' },
          },
          {
            id: 'vote-2',
            userId: 'voter-2',
            isCorrect: false,
            user: { id: 'voter-2' },
          },
        ],
      };

      const correctVotes = [
        {
          id: 'vote-1',
          userId: 'voter-1',
          isCorrect: true,
          user: { id: 'voter-1' },
        },
      ];

      mockPredictionRepository.findOne.mockResolvedValue(mockPrediction);
      mockPredictionVoteRepository.find.mockResolvedValue(correctVotes);
      mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);
      mockPredictionRepository.save.mockResolvedValue({
        ...mockPrediction,
        status: PredictionStatus.RESOLVED,
        outcome: PredictionOutcome.CORRECT,
        isResolved: true,
      });

      const result = await service.resolvePrediction(userId, resolvePredictionDto);

      expect(result.status).toBe(PredictionStatus.RESOLVED);
      expect(result.outcome).toBe(PredictionOutcome.CORRECT);
      expect(result.isResolved).toBe(true);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the prediction creator', async () => {
      const userId = 'user-123';
      const resolvePredictionDto = {
        predictionId: 'prediction-123',
        isCorrect: true,
      };

      const mockPrediction = {
        id: 'prediction-123',
        userId: 'different-user',
        isResolved: false,
      };

      mockPredictionRepository.findOne.mockResolvedValue(mockPrediction);

      await expect(service.resolvePrediction(userId, resolvePredictionDto))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('getPredictionsByRoom', () => {
    it('should return predictions for a room', async () => {
      const roomId = 'room-123';
      const mockPredictions = [
        {
          id: 'prediction-1',
          roomId,
          title: 'Test Prediction 1',
          status: PredictionStatus.ACTIVE,
        },
        {
          id: 'prediction-2',
          roomId,
          title: 'Test Prediction 2',
          status: PredictionStatus.RESOLVED,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPredictions),
      };

      mockPredictionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getPredictionsByRoom(roomId);

      expect(result).toEqual(mockPredictions);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('prediction.roomId = :roomId', { roomId });
    });
  });

  describe('getPredictionById', () => {
    it('should return a prediction by id', async () => {
      const predictionId = 'prediction-123';
      const mockPrediction = {
        id: predictionId,
        title: 'Test Prediction',
        user: { id: 'user-123' },
        room: { id: 'room-123' },
        votes: [],
      };

      mockPredictionRepository.findOne.mockResolvedValue(mockPrediction);

      const result = await service.getPredictionById(predictionId);

      expect(result).toEqual(mockPrediction);
    });

    it('should throw NotFoundException if prediction does not exist', async () => {
      const predictionId = 'non-existent';

      mockPredictionRepository.findOne.mockResolvedValue(null);

      await expect(service.getPredictionById(predictionId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserPredictions', () => {
    it('should return predictions created by a user', async () => {
      const userId = 'user-123';
      const mockPredictions = [
        {
          id: 'prediction-1',
          userId,
          title: 'Test Prediction 1',
        },
        {
          id: 'prediction-2',
          userId,
          title: 'Test Prediction 2',
        },
      ];

      mockPredictionRepository.find.mockResolvedValue(mockPredictions);

      const result = await service.getUserPredictions(userId);

      expect(result).toEqual(mockPredictions);
      expect(mockPredictionRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['room', 'votes'],
        order: { createdAt: 'DESC' },
      });
    });
  });
});
