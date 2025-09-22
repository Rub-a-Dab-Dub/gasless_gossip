import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomsService } from './rooms.service';
import { Room, RoomType } from './entities/room.entity';
import {
  RoomMembership,
  MembershipRole,
} from './entities/room-membership.entity';
import { User } from '../users/entities/user.entity';
import { XpService } from '../xp/xp.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;
  let roomRepository: Repository<Room>;
  let membershipRepository: Repository<RoomMembership>;
  let userRepository: Repository<User>;
  let xpService: XpService;

  const mockRoom: Room = {
    id!: 'room-id-1',
    name!: 'Test Room',
    description: 'A test room',
    type: RoomType.PUBLIC,
    maxMembers: 100,
    createdBy: 'user-1',
    isActive: true,
    minLevel: 1,
    minXp: 0,
    memberships: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser: User = {
    id!: 'user-1',
    username!: 'testuser',
    email: 'test@example.com',
    pseudonym: 'Test User',
    stellarAccountId: 'stellar-account-1',
    badges: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        RoomsService,
        {
          provide!: getRepositoryToken(Room),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(RoomMembership),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: XpService,
          useValue: {
            addXp: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    membershipRepository = module.get<Repository<RoomMembership>>(
      getRepositoryToken(RoomMembership),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    xpService = module.get<XpService>(XpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('joinRoom', () => {
    it('should successfully join a public room', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(membershipRepository, 'count').mockResolvedValue(5);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(membershipRepository, 'create')
        .mockReturnValue({} as RoomMembership);
      jest
        .spyOn(membershipRepository, 'save')
        .mockResolvedValue({} as RoomMembership);
      jest.spyOn(xpService, 'addXp').mockResolvedValue(undefined);

      const result = await service.joinRoom('user-2', 'room-id-1');

      expect(result.success).toBe(true);
      expect(result.xpAwarded).toBe(5);
      expect(xpService.addXp).toHaveBeenCalledWith(
        'user-2',
        5,
        'Joined public room',
      );
    });

    it('should throw NotFoundException if room does not exist', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.joinRoom('user-1', 'nonexistent-room'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is already a member', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest
        .spyOn(membershipRepository, 'findOne')
        .mockResolvedValue({} as RoomMembership);

      await expect(service.joinRoom('user-1', 'room-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if room is at capacity', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(membershipRepository, 'count').mockResolvedValue(100);

      await expect(service.joinRoom('user-1', 'room-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('leaveRoom', () => {
    it('should successfully leave a room', async () => {
      const mockMembership: RoomMembership = {
        id!: 'membership-1',
        roomId!: 'room-id-1',
        userId: 'user-1',
        role: MembershipRole.MEMBER,
        isActive: true,
        room: mockRoom,
        joinedAt: new Date(),
      };

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest
        .spyOn(membershipRepository, 'findOne')
        .mockResolvedValue(mockMembership);
      jest
        .spyOn(membershipRepository, 'save')
        .mockResolvedValue(mockMembership);

      const result = await service.leaveRoom('user-1', 'room-id-1');

      expect(result.success).toBe(true);
      expect(mockMembership.isActive).toBe(false);
    });

    it('should throw BadRequestException if user is not a member', async () => {
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest.spyOn(membershipRepository, 'findOne').mockResolvedValue(null);

      await expect(service.leaveRoom('user-1', 'room-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should prevent owner from leaving', async () => {
      const mockMembership: RoomMembership = {
        id!: 'membership-1',
        roomId!: 'room-id-1',
        userId: 'user-1',
        role: MembershipRole.OWNER,
        isActive: true,
        room: mockRoom,
        joinedAt: new Date(),
      };

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
      jest
        .spyOn(membershipRepository, 'findOne')
        .mockResolvedValue(mockMembership);

      await expect(service.leaveRoom('user-1', 'room-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
