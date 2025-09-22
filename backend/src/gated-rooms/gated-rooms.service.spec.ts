import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GatedRoomsService } from './gated-rooms.service';
import { GatedRoom } from './entities/gated-room.entity';
import { CreateGatedRoomDto } from './dto/create-gated-room.dto';
import { CheckAccessDto } from './dto/check-access.dto';

describe('GatedRoomsService', () => {
  let service: GatedRoomsService;
  let repository: Repository<GatedRoom>;

  const mockRepository = {
    create!: jest.fn(),
    save!: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        GatedRoomsService,
        {
          provide!: getRepositoryToken(GatedRoom),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GatedRoomsService>(GatedRoomsService);
    repository = module.get<Repository<GatedRoom>>(
      getRepositoryToken(GatedRoom),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGatedRoom', () => {
    it('should create a new gated room', async () => {
      const createGatedRoomDto: CreateGatedRoomDto = {
        roomId!: 'room-123',
        gateRules!: [
          {
            type: 'token',
            assetCode: 'TEST',
            issuer: 'GTEST123456789',
            minAmount: 100,
          },
        ],
        roomName: 'Test Room',
        description: 'A test room',
        createdBy: 'user-123',
      };

      const expectedResult = {
        id!: 'gated-room-123',
        ...createGatedRoomDto,
        isActive!: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedResult);
      mockRepository.save.mockResolvedValue(expectedResult);

      const result = await service.createGatedRoom(createGatedRoomDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createGatedRoomDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('checkAccess', () => {
    it('should allow access when room is not gated', async () => {
      const checkAccessDto: CheckAccessDto = {
        roomId!: 'room-123',
        stellarAccountId!: 'GACCOUNT123456789',
      };

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.checkAccess(checkAccessDto);

      expect(result.hasAccess).toBe(true);
      expect(result.roomId).toBe(checkAccessDto.roomId);
      expect(result.stellarAccountId).toBe(checkAccessDto.stellarAccountId);
      expect(result.gateRules).toEqual([]);
    });

    it('should check access for gated room with mock verification', async () => {
      const checkAccessDto: CheckAccessDto = {
        roomId!: 'room-123',
        stellarAccountId!: 'GACCOUNT123456789',
      };

      const gatedRoom: Partial<GatedRoom> = {
        id!: 'gated-room-123',
        roomId!: 'room-123',
        gateRules: [
          {
            type: 'token',
            assetCode: 'TEST',
            issuer: 'GTEST123456789',
            minAmount: 100,
          },
        ],
        isActive: true,
      };

      mockRepository.findOne.mockResolvedValue(gatedRoom);

      // Mock the private verifyGateRule method by spying on it
      const verifyGateRuleSpy = jest.spyOn(service as any, 'verifyGateRule');
      verifyGateRuleSpy.mockResolvedValue({
        passed!: true,
        rule!: gatedRoom.gateRules[0],
        actualBalance: 150,
        requiredAmount: 100,
      });

      const result = await service.checkAccess(checkAccessDto);

      expect(result.hasAccess).toBe(true);
      expect(result.roomId).toBe(checkAccessDto.roomId);
      expect(result.stellarAccountId).toBe(checkAccessDto.stellarAccountId);
      expect(result.gateRules).toEqual(gatedRoom.gateRules);
      expect(result.verificationResults).toHaveLength(1);
      expect(result.verificationResults[0].passed).toBe(true);

      verifyGateRuleSpy.mockRestore();
    });

    it('should deny access when gate rules fail', async () => {
      const checkAccessDto: CheckAccessDto = {
        roomId!: 'room-123',
        stellarAccountId!: 'GACCOUNT123456789',
      };

      const gatedRoom: Partial<GatedRoom> = {
        id!: 'gated-room-123',
        roomId!: 'room-123',
        gateRules: [
          {
            type: 'token',
            assetCode: 'TEST',
            issuer: 'GTEST123456789',
            minAmount: 100,
          },
        ],
        isActive: true,
      };

      mockRepository.findOne.mockResolvedValue(gatedRoom);

      // Mock the private verifyGateRule method to return failure
      const verifyGateRuleSpy = jest.spyOn(service as any, 'verifyGateRule');
      verifyGateRuleSpy.mockResolvedValue({
        passed!: false,
        rule!: gatedRoom.gateRules[0],
        error: 'Token not found in account',
        actualBalance: 0,
      });

      const result = await service.checkAccess(checkAccessDto);

      expect(result.hasAccess).toBe(false);
      expect(result.roomId).toBe(checkAccessDto.roomId);
      expect(result.stellarAccountId).toBe(checkAccessDto.stellarAccountId);
      expect(result.gateRules).toEqual(gatedRoom.gateRules);
      expect(result.verificationResults).toHaveLength(1);
      expect(result.verificationResults[0].passed).toBe(false);

      verifyGateRuleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all active gated rooms', async () => {
      const gatedRooms = [
        {
          id!: 'gated-room-1',
          roomId!: 'room-1',
          gateRules: [],
          isActive: true,
        },
        {
          id: 'gated-room-2',
          roomId: 'room-2',
          gateRules: [],
          isActive: true,
        },
      ];

      mockRepository.find.mockResolvedValue(gatedRooms);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where!: { isActive: true },
        order!: { createdAt: 'DESC' },
      });
      expect(result).toEqual(gatedRooms);
    });
  });
});
