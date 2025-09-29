import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SecretRoomsService } from '../services/secret-rooms.service';
import { SecretRoom } from '../entities/secret-room.entity';
import { RoomInvitation } from '../entities/room-invitation.entity';
import { RoomMember } from '../entities/room-member.entity';

describe('SecretRoomsService', () => {
  let service: SecretRoomsService;
  let mockSecretRoomRepo: any;
  let mockRoomInvitationRepo: any;
  let mockRoomMemberRepo: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockSecretRoomRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockRoomInvitationRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    mockRoomMemberRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config = {
          MAX_ROOMS_PER_USER: 100,
        };
        return config[key] || defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretRoomsService,
        {
          provide: getRepositoryToken(SecretRoom),
          useValue: mockSecretRoomRepo,
        },
        {
          provide: getRepositoryToken(RoomInvitation),
          useValue: mockRoomInvitationRepo,
        },
        {
          provide: getRepositoryToken(RoomMember),
          useValue: mockRoomMemberRepo,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SecretRoomsService>(SecretRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSecretRoom', () => {
    it('should create a secret room successfully', async () => {
      const createDto = {
        name: 'Test Secret Room',
        description: 'A room for testing',
        isPrivate: true,
        maxUsers: 50,
        category: 'gossip',
        theme: 'dark',
        settings: {
          allowAnonymous: true,
          requireApproval: false,
          moderationLevel: 'medium',
        },
        metadata: {
          tags: ['test', 'gossip'],
          language: 'en',
        },
      };

      const mockRoom = {
        id: 'room-123',
        creatorId: 'user-123',
        name: 'Test Secret Room',
        description: 'A room for testing',
        roomCode: 'ABC12345',
        isPrivate: true,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
        category: 'gossip',
        theme: 'dark',
        settings: createDto.settings,
        metadata: createDto.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMember = {
        id: 'member-123',
        roomId: 'room-123',
        userId: 'user-123',
        role: 'owner',
        status: 'active',
        canInvite: true,
        canModerate: true,
        joinedAt: new Date(),
        updatedAt: new Date(),
      };

      mockSecretRoomRepo.count.mockResolvedValue(5); // User has 5 rooms, under limit
      mockSecretRoomRepo.create.mockReturnValue(mockRoom);
      mockSecretRoomRepo.save.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.create.mockReturnValue(mockMember);
      mockRoomMemberRepo.save.mockResolvedValue(mockMember);

      const result = await service.createSecretRoom(createDto, 'user-123');

      expect(result.id).toBe('room-123');
      expect(result.name).toBe('Test Secret Room');
      expect(result.isPrivate).toBe(true);
      expect(result.creatorId).toBe('user-123');
      expect(mockSecretRoomRepo.create).toHaveBeenCalled();
      expect(mockSecretRoomRepo.save).toHaveBeenCalled();
    });

    it('should enforce user room limit', async () => {
      const createDto = {
        name: 'Test Room',
        isPrivate: false,
      };

      mockSecretRoomRepo.count.mockResolvedValue(100); // User has reached limit

      await expect(service.createSecretRoom(createDto, 'user-123'))
        .rejects.toThrow('User has reached the maximum limit of 100 rooms');
    });

    it('should generate unique room codes', async () => {
      const createDto = {
        name: 'Test Room',
        isPrivate: false,
      };

      mockSecretRoomRepo.count.mockResolvedValue(5);
      mockSecretRoomRepo.findOne
        .mockResolvedValueOnce({ roomCode: 'EXISTING' }) // First attempt exists
        .mockResolvedValueOnce(null); // Second attempt is unique
      mockSecretRoomRepo.create.mockReturnValue({
        id: 'room-123',
        roomCode: 'UNIQUE123',
        name: 'Test Room',
        isPrivate: false,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockSecretRoomRepo.save.mockResolvedValue({
        id: 'room-123',
        roomCode: 'UNIQUE123',
        name: 'Test Room',
        isPrivate: false,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockRoomMemberRepo.create.mockReturnValue({});
      mockRoomMemberRepo.save.mockResolvedValue({});

      const result = await service.createSecretRoom(createDto, 'user-123');

      expect(result.roomCode).toBe('UNIQUE123');
      expect(mockSecretRoomRepo.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('getSecretRoom', () => {
    it('should return room details', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Test Room',
        isPrivate: false,
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);

      const result = await service.getSecretRoom('room-123', 'user-123');

      expect(result.id).toBe('room-123');
      expect(result.name).toBe('Test Room');
    });

    it('should throw NotFoundException for non-existent room', async () => {
      mockSecretRoomRepo.findOne.mockResolvedValue(null);

      await expect(service.getSecretRoom('non-existent', 'user-123'))
        .rejects.toThrow('Secret room not found');
    });

    it('should check access for private rooms', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Private Room',
        isPrivate: true,
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.findOne.mockResolvedValue(null); // User is not a member

      await expect(service.getSecretRoom('room-123', 'user-123'))
        .rejects.toThrow('Access denied to private room');
    });
  });

  describe('joinRoom', () => {
    it('should allow user to join room', async () => {
      const mockRoom = {
        id: 'room-123',
        roomCode: 'ABC12345',
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 5,
      };

      const mockMember = {
        id: 'member-123',
        roomId: 'room-123',
        userId: 'user-123',
        role: 'member',
        status: 'active',
        canInvite: true,
        canModerate: false,
        joinedAt: new Date(),
        updatedAt: new Date(),
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.findOne.mockResolvedValue(null); // User is not already a member
      mockRoomMemberRepo.create.mockReturnValue(mockMember);
      mockRoomMemberRepo.save.mockResolvedValue(mockMember);
      mockRoomMemberRepo.count.mockResolvedValue(6); // Updated member count
      mockSecretRoomRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.joinRoom({
        roomCode: 'ABC12345',
        nickname: 'Test User',
        isAnonymous: false,
      }, 'user-123');

      expect(result.roomId).toBe('room-123');
      expect(result.userId).toBe('user-123');
      expect(result.role).toBe('member');
    });

    it('should prevent joining full rooms', async () => {
      const mockRoom = {
        id: 'room-123',
        roomCode: 'ABC12345',
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 50, // Room is full
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);

      await expect(service.joinRoom({
        roomCode: 'ABC12345',
        nickname: 'Test User',
      }, 'user-123'))
        .rejects.toThrow('Room is at maximum capacity');
    });

    it('should prevent joining inactive rooms', async () => {
      const mockRoom = {
        id: 'room-123',
        roomCode: 'ABC12345',
        isActive: false,
        status: 'inactive',
        maxUsers: 50,
        currentUsers: 5,
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);

      await expect(service.joinRoom({
        roomCode: 'ABC12345',
        nickname: 'Test User',
      }, 'user-123'))
        .rejects.toThrow('Room is not active');
    });
  });

  describe('inviteUser', () => {
    it('should create invitation for user', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Test Room',
      };

      const mockInviter = {
        id: 'member-123',
        roomId: 'room-123',
        userId: 'user-123',
        canInvite: true,
        status: 'active',
      };

      const mockInvitation = {
        id: 'invitation-123',
        roomId: 'room-123',
        invitedBy: 'user-123',
        invitedUserId: 'user-456',
        invitationCode: 'INV123456789',
        status: 'pending',
        role: 'member',
        expiresInDays: 7,
        createdAt: new Date(),
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.findOne.mockResolvedValue(mockInviter);
      mockRoomInvitationRepo.findOne.mockResolvedValue(null); // Unique invitation code
      mockRoomInvitationRepo.create.mockReturnValue(mockInvitation);
      mockRoomInvitationRepo.save.mockResolvedValue(mockInvitation);

      const result = await service.inviteUser('room-123', {
        userId: 'user-456',
        message: 'Join my room!',
        role: 'member',
        expiresInDays: 7,
      }, 'user-123');

      expect(result.roomId).toBe('room-123');
      expect(result.invitedUserId).toBe('user-456');
      expect(result.status).toBe('pending');
    });

    it('should prevent non-members from inviting', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Test Room',
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.findOne.mockResolvedValue(null); // User is not a member

      await expect(service.inviteUser('room-123', {
        userId: 'user-456',
      }, 'user-123'))
        .rejects.toThrow('User does not have permission to invite others');
    });
  });

  describe('getUserRoomLimit', () => {
    it('should return user room limit information', async () => {
      mockSecretRoomRepo.count.mockResolvedValue(25); // User has 25 rooms

      const result = await service.getUserRoomLimit('user-123');

      expect(result.userId).toBe('user-123');
      expect(result.currentRooms).toBe(25);
      expect(result.maxRooms).toBe(100);
      expect(result.canCreateMore).toBe(true);
      expect(result.remainingSlots).toBe(75);
    });

    it('should indicate when user has reached limit', async () => {
      mockSecretRoomRepo.count.mockResolvedValue(100); // User has reached limit

      const result = await service.getUserRoomLimit('user-123');

      expect(result.currentRooms).toBe(100);
      expect(result.canCreateMore).toBe(false);
      expect(result.remainingSlots).toBe(0);
    });
  });

  describe('getRoomStats', () => {
    it('should return room statistics', async () => {
      mockSecretRoomRepo.count
        .mockResolvedValueOnce(100) // total rooms
        .mockResolvedValueOnce(80) // active rooms
        .mockResolvedValueOnce(30) // private rooms
        .mockResolvedValueOnce(50) // public rooms
        .mockResolvedValueOnce(200) // rooms created today
        .mockResolvedValueOnce(500); // rooms created this week

      mockRoomMemberRepo.count.mockResolvedValue(1000); // total members

      const result = await service.getRoomStats();

      expect(result.totalRooms).toBe(100);
      expect(result.activeRooms).toBe(80);
      expect(result.privateRooms).toBe(30);
      expect(result.publicRooms).toBe(50);
      expect(result.totalMembers).toBe(1000);
      expect(result.averageMembersPerRoom).toBe(10);
      expect(result.roomsCreatedToday).toBe(200);
      expect(result.roomsCreatedThisWeek).toBe(500);
    });
  });
});
