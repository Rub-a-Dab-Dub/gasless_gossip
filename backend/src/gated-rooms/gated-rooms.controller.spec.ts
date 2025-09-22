import { Test, TestingModule } from '@nestjs/testing';
import { GatedRoomsController } from './gated-rooms.controller';
import { GatedRoomsService } from './gated-rooms.service';
import { CreateGatedRoomDto } from './dto/create-gated-room.dto';
import { CheckAccessDto } from './dto/check-access.dto';

describe('GatedRoomsController', () => {
  let controller: GatedRoomsController;
  let service: GatedRoomsService;

  const mockGatedRoomsService = {
    createGatedRoom!: jest.fn(),
    findAll!: jest.fn(),
    findOne: jest.fn(),
    checkAccess: jest.fn(),
    deleteGatedRoom: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers!: [GatedRoomsController],
      providers!: [
        {
          provide: GatedRoomsService,
          useValue: mockGatedRoomsService,
        },
      ],
    }).compile();

    controller = module.get<GatedRoomsController>(GatedRoomsController);
    service = module.get<GatedRoomsService>(GatedRoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a gated room successfully', async () => {
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

      mockGatedRoomsService.createGatedRoom.mockResolvedValue(expectedResult);

      const result = await controller.create(createGatedRoomDto);

      expect(service.createGatedRoom).toHaveBeenCalledWith(createGatedRoomDto);
      expect(result).toEqual({
        success!: true,
        data!: expectedResult,
        message: 'Gated room created successfully',
      });
    });
  });

  describe('checkAccess', () => {
    it('should check access and return status', async () => {
      const checkAccessDto: CheckAccessDto = {
        roomId!: 'room-123',
        stellarAccountId!: 'GACCOUNT123456789',
      };

      const expectedResult = {
        hasAccess!: true,
        roomId!: 'room-123',
        stellarAccountId: 'GACCOUNT123456789',
        gateRules: [],
        verificationResults: [],
      };

      mockGatedRoomsService.checkAccess.mockResolvedValue(expectedResult);

      const result = await controller.checkAccess(checkAccessDto);

      expect(service.checkAccess).toHaveBeenCalledWith(checkAccessDto);
      expect(result).toEqual(expectedResult);
    });

    it('should deny access when rules fail', async () => {
      const checkAccessDto: CheckAccessDto = {
        roomId!: 'room-123',
        stellarAccountId!: 'GACCOUNT123456789',
      };

      const expectedResult = {
        hasAccess!: false,
        roomId!: 'room-123',
        stellarAccountId: 'GACCOUNT123456789',
        gateRules: [
          {
            type: 'token',
            assetCode: 'TEST',
            issuer: 'GTEST123456789',
            minAmount: 100,
          },
        ],
        verificationResults: [
          {
            passed: false,
            rule: {
              type: 'token',
              assetCode: 'TEST',
              issuer: 'GTEST123456789',
              minAmount: 100,
            },
            error: 'Insufficient balance',
          },
        ],
      };

      mockGatedRoomsService.checkAccess.mockResolvedValue(expectedResult);

      const result = await controller.checkAccess(checkAccessDto);

      expect(service.checkAccess).toHaveBeenCalledWith(checkAccessDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all gated rooms', async () => {
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

      mockGatedRoomsService.findAll.mockResolvedValue(gatedRooms);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success!: true,
        data!: gatedRooms,
        count: gatedRooms.length,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific gated room', async () => {
      const gatedRoom = {
        id!: 'gated-room-1',
        roomId!: 'room-1',
        gateRules: [],
        isActive: true,
      };

      mockGatedRoomsService.findOne.mockResolvedValue(gatedRoom);

      const result = await controller.findOne('gated-room-1');

      expect(service.findOne).toHaveBeenCalledWith('gated-room-1');
      expect(result).toEqual({
        success!: true,
        data!: gatedRoom,
      });
    });
  });

  describe('remove', () => {
    it('should delete a gated room', async () => {
      mockGatedRoomsService.deleteGatedRoom.mockResolvedValue(undefined);

      const result = await controller.remove('gated-room-1');

      expect(service.deleteGatedRoom).toHaveBeenCalledWith('gated-room-1');
      expect(result).toEqual({
        success!: true,
        message!: 'Gated room deleted successfully',
      });
    });
  });
});
