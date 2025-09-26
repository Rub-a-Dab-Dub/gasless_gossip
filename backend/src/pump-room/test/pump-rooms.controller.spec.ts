import { Test, TestingModule } from '@nestjs/testing';
import { PumpRoomsController } from '../controllers/pump-rooms.controller';
import { PumpRoomsService } from '../services/pump-rooms.service';
import { CreatePumpRoomDto } from '../dto/create-pump-room.dto';
import { VoteDto } from '../dto/vote.dto';

describe('PumpRoomsController', () => {
  let controller: PumpRoomsController;
  let service: PumpRoomsService;

  const mockService = {
    createRoom: jest.fn(),
    vote: jest.fn(),
    getRoomById: jest.fn(),
    getVotingData: jest.fn(),
    getAllActiveRooms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PumpRoomsController],
      providers: [
        {
          provide: PumpRoomsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PumpRoomsController>(PumpRoomsController);
    service = module.get<PumpRoomsService>(PumpRoomsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create room and return success response', async () => {
      const createDto: CreatePumpRoomDto = {
        roomId: 'test-room',
        predictions: [{ id: 'pred1', title: 'Test prediction' }]
      };

      const createdRoom = { id: 'uuid', ...createDto };
      mockService.createRoom.mockResolvedValue(createdRoom);

      const result = await controller.createRoom(createDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Pump room created successfully');
      expect(result.data).toEqual(createdRoom);
    });
  });

  describe('vote', () => {
    it('should record vote and return success response', async () => {
      const voteDto: VoteDto = {
        roomId: 'test-room',
        predictionId: 'pred1',
        userId: 'user123',
        confidence: 80
      };

      const voteResult = { voteId: 'vote123', ...voteDto, timestamp: new Date() };
      mockService.vote.mockResolvedValue(voteResult);

      const result = await controller.vote(voteDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Vote recorded successfully');
      expect(result.data).toEqual(voteResult);
    });
  });

  describe('getVotingData', () => {
    it('should return voting data', async () => {
      const roomId = 'test-room';
      const votingData = {
        roomId,
        totalVotes: 5,
        predictions: []
      };

      mockService.getVotingData.mockResolvedValue(votingData);

      const result = await controller.getVotingData(roomId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(votingData);
    });
  });
});