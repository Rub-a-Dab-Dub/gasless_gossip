import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PumpRoom } from './entities/pump-room.entity';
import { PumpRoomsService } from './services/pump-rooms.service';
import { PumpRoomsController } from './controllers/pump-rooms.controller';
import { StellarService } from './services/stellar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PumpRoom]),
    ConfigModule
  ],
  controllers: [PumpRoomsController],
  providers: [PumpRoomsService, StellarService],
  exports: [PumpRoomsService, StellarService],
})
export class PumpRoomsModule {}

// tests/pump-rooms.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PumpRoomsService } from '../services/pump-rooms.service';
import { StellarService } from '../services/stellar.service';
import { PumpRoom } from '../entities/pump-room.entity';
import { CreatePumpRoomDto } from '../dto/create-pump-room.dto';
import { VoteDto } from '../dto/vote.dto';

describe('PumpRoomsService', () => {
  let service: PumpRoomsService;
  let repository: Repository<PumpRoom>;
  let stellarService: StellarService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockStellarService = {
    calculateRewardAmount: jest.fn(),
    executeRewardContract: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PumpRoomsService,
        {
          provide: getRepositoryToken(PumpRoom),
          useValue: mockRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
      ],
    }).compile();

    service = module.get<PumpRoomsService>(PumpRoomsService);
    repository = module.get<Repository<PumpRoom>>(getRepositoryToken(PumpRoom));
    stellarService = module.get<StellarService>(StellarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a new room successfully', async () => {
      const createDto: CreatePumpRoomDto = {
        roomId: 'test-room-1',
        predictions: [
          { id: 'pred1', title: 'Bitcoin will reach $100k' },
          { id: 'pred2', title: 'Ethereum will flip Bitcoin' }
        ]
      };

      const savedRoom = { id: 'uuid', ...createDto, votes: {}, totalVotes: 0 };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(savedRoom);
      mockRepository.save.mockResolvedValue(savedRoom);

      const result = await service.createRoom(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { roomId: createDto.roomId }
      });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(savedRoom);
    });

    it('should throw error if room already exists', async () => {
      const createDto: CreatePumpRoomDto = {
        roomId: 'existing-room',
        predictions: [{ id: 'pred1', title: 'Test prediction' }]
      };

      mockRepository.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.createRoom(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('vote', () => {
    it('should record vote successfully with Stellar reward', async () => {
      const voteDto: VoteDto = {
        roomId: 'test-room',
        predictionId: 'pred1',
        userId: 'user123',
        confidence: 80,
        stellarAddress: 'STELLAR_ADDRESS'
      };

      const room = {
        id: 'room-id',
        roomId: 'test-room',
        predictions: [{ id: 'pred1', title: 'Test prediction' }],
        votes: {},
        totalVotes: 0,
        isActive: true,
        endDate: null
      };

      const stellarReward = {
        transactionHash: 'stellar_tx_123',
        amount: 15,
        recipientAddress: 'STELLAR_ADDRESS'
      };

      mockRepository.findOne.mockResolvedValue(room);
      mockStellarService.calculateRewardAmount.mockReturnValue(15);
      mockStellarService.executeRewardContract.mockResolvedValue(stellarReward);
      mockRepository.save.mockResolvedValue({ ...room, totalVotes: 1 });

      const result = await service.vote(voteDto);

      expect(result.confidence).toBe(80);
      expect(result.stellarReward).toEqual(stellarReward);
      expect(mockStellarService.executeRewardContract).toHaveBeenCalledWith(
        'STELLAR_ADDRESS',
        15,
        'test-room',
        'pred1'
      );
    });

    it('should throw error for non-existent room', async () => {
      const voteDto: VoteDto = {
        roomId: 'non-existent',
        predictionId: 'pred1',
        userId: 'user123',
        confidence: 80
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.vote(voteDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw error for duplicate vote', async () => {
      const voteDto: VoteDto = {
        roomId: 'test-room',
        predictionId: 'pred1',
        userId: 'user123',
        confidence: 80
      };

      const room = {
        roomId: 'test-room',
        predictions: [{ id: 'pred1', title: 'Test prediction' }],
        votes: { 'user123_pred1': { existing: 'vote' } },
        totalVotes: 1,
        isActive: true,
        endDate: null
      };

      mockRepository.findOne.mockResolvedValue(room);

      await expect(service.vote(voteDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVotingData', () => {
    it('should return voting statistics', async () => {
      const room = {
        roomId: 'test-room',
        predictions: [
          { id: 'pred1', title: 'Bitcoin $100k' },
          { id: 'pred2', title: 'Ethereum flip' }
        ],
        votes: {
          'user1_pred1': { predictionId: 'pred1', confidence: 80 },
          'user2_pred1': { predictionId: 'pred1', confidence: 90 },
          'user3_pred2': { predictionId: 'pred2', confidence: 70 }
        },
        totalVotes: 3,
        isActive: true,
        endDate: null,
        createdAt: new Date()
      };

      mockRepository.findOne.mockResolvedValue(room);

      const result = await service.getVotingData('test-room');

      expect(result.totalVotes).toBe(3);
      expect(result.predictions).toHaveLength(2);
      expect(result.predictions[0].voteCount).toBe(2);
      expect(result.predictions[0].averageConfidence).toBe(85);
      expect(result.predictions[1].voteCount).toBe(1);
      expect(result.predictions[1].averageConfidence).toBe(70);
    });
  });
});