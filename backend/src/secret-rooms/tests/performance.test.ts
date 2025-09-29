import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SecretRoomsService } from '../services/secret-rooms.service';
import { SecretRoom } from '../entities/secret-room.entity';
import { RoomInvitation } from '../entities/room-invitation.entity';
import { RoomMember } from '../entities/room-member.entity';

describe('SecretRoomsService Performance Tests', () => {
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

  describe('Performance with <200ms room creation', () => {
    it('should create rooms in under 200ms', async () => {
      const createDto = {
        name: 'Performance Test Room',
        description: 'Room for performance testing',
        isPrivate: false,
        maxUsers: 50,
        category: 'test',
        theme: 'dark',
        settings: {
          allowAnonymous: true,
          requireApproval: false,
          moderationLevel: 'low',
        },
        metadata: {
          tags: ['test', 'performance'],
          language: 'en',
        },
      };

      const mockRoom = {
        id: 'room-123',
        creatorId: 'user-123',
        name: 'Performance Test Room',
        description: 'Room for performance testing',
        roomCode: 'PERF1234',
        isPrivate: false,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
        category: 'test',
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
      mockSecretRoomRepo.findOne.mockResolvedValue(null); // Unique room code
      mockSecretRoomRepo.create.mockReturnValue(mockRoom);
      mockSecretRoomRepo.save.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.create.mockReturnValue(mockMember);
      mockRoomMemberRepo.save.mockResolvedValue(mockMember);

      const startTime = Date.now();
      const result = await service.createSecretRoom(createDto, 'user-123');
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(result.id).toBe('room-123');
      expect(processingTime).toBeLessThan(200); // Should be under 200ms
      expect(result.name).toBe('Performance Test Room');
      expect(result.isPrivate).toBe(false);

      console.log(`Room Creation Performance:
        Processing Time: ${processingTime}ms
        Room ID: ${result.id}
        Room Code: ${result.roomCode}
        Status: ${result.status}`);
    });

    it('should handle 10 concurrent room creations efficiently', async () => {
      const createDtos = Array.from({ length: 10 }, (_, i) => ({
        name: `Concurrent Room ${i + 1}`,
        description: `Room ${i + 1} for concurrent testing`,
        isPrivate: i % 2 === 0, // Alternate between private and public
        maxUsers: 50,
        category: 'test',
        theme: 'dark',
        settings: {
          allowAnonymous: true,
          requireApproval: false,
          moderationLevel: 'low',
        },
        metadata: {
          tags: ['test', 'concurrent'],
          language: 'en',
        },
      }));

      const mockRoom = {
        id: 'room-123',
        creatorId: 'user-123',
        name: 'Concurrent Room',
        description: 'Room for concurrent testing',
        roomCode: 'CONC1234',
        isPrivate: false,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
        category: 'test',
        theme: 'dark',
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
      mockSecretRoomRepo.findOne.mockResolvedValue(null); // Unique room code
      mockSecretRoomRepo.create.mockReturnValue(mockRoom);
      mockSecretRoomRepo.save.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.create.mockReturnValue(mockMember);
      mockRoomMemberRepo.save.mockResolvedValue(mockMember);

      const startTime = Date.now();
      
      // Create 10 rooms concurrently
      const promises = createDtos.map(dto => service.createSecretRoom(dto, 'user-123'));
      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(results).toHaveLength(10);
      expect(totalTime).toBeLessThan(2000); // Should complete in under 2 seconds
      expect(totalTime / 10).toBeLessThan(200); // Average < 200ms per room

      console.log(`Concurrent Room Creation Performance:
        Total Rooms: 10
        Total Time: ${totalTime}ms
        Average Time per Room: ${(totalTime / 10).toFixed(2)}ms
        Rooms per Second: ${(10 / (totalTime / 1000)).toFixed(2)}`);
    });

    it('should handle sustained room creation load', async () => {
      const createDto = {
        name: 'Sustained Load Room',
        description: 'Room for sustained load testing',
        isPrivate: false,
        maxUsers: 50,
        category: 'test',
      };

      const mockRoom = {
        id: 'room-123',
        creatorId: 'user-123',
        name: 'Sustained Load Room',
        description: 'Room for sustained load testing',
        roomCode: 'SUST1234',
        isPrivate: false,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
        category: 'test',
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
      mockSecretRoomRepo.findOne.mockResolvedValue(null); // Unique room code
      mockSecretRoomRepo.create.mockReturnValue(mockRoom);
      mockSecretRoomRepo.save.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.create.mockReturnValue(mockMember);
      mockRoomMemberRepo.save.mockResolvedValue(mockMember);

      const latencies: number[] = [];
      const iterations = 50; // 50 room creations

      // Process 50 room creations and measure latency
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        await service.createSecretRoom(createDto, 'user-123');
        
        const endTime = Date.now();
        latencies.push(endTime - startTime);
      }

      // Calculate statistics
      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);
      const minLatency = Math.min(...latencies);

      // Performance assertions
      expect(averageLatency).toBeLessThan(200); // Average < 200ms
      expect(maxLatency).toBeLessThan(500); // Max < 500ms
      expect(minLatency).toBeLessThan(100); // Min < 100ms

      console.log(`Sustained Room Creation Performance:
        Average Latency: ${averageLatency.toFixed(2)}ms
        Max Latency: ${maxLatency}ms
        Min Latency: ${minLatency}ms
        Total Operations: ${iterations}`);
    });
  });

  describe('Room access control performance', () => {
    it('should handle private room access checks efficiently', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Private Room',
        isPrivate: true,
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMember = {
        id: 'member-123',
        roomId: 'room-123',
        userId: 'user-123',
        role: 'member',
        status: 'active',
      };

      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.findOne.mockResolvedValue(mockMember);

      const startTime = Date.now();
      const result = await service.getSecretRoom('room-123', 'user-123');
      const endTime = Date.now();
      const accessTime = endTime - startTime;

      expect(result.id).toBe('room-123');
      expect(result.isPrivate).toBe(true);
      expect(accessTime).toBeLessThan(100); // Should be under 100ms

      console.log(`Private Room Access Performance:
        Access Time: ${accessTime}ms
        Room ID: ${result.id}
        Is Private: ${result.isPrivate}`);
    });

    it('should handle room member operations efficiently', async () => {
      const mockRoom = {
        id: 'room-123',
        roomCode: 'MEMBER123',
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

      const startTime = Date.now();
      const result = await service.joinRoom({
        roomCode: 'MEMBER123',
        nickname: 'Test User',
        isAnonymous: false,
      }, 'user-123');
      const endTime = Date.now();
      const joinTime = endTime - startTime;

      expect(result.roomId).toBe('room-123');
      expect(result.userId).toBe('user-123');
      expect(joinTime).toBeLessThan(150); // Should be under 150ms

      console.log(`Room Join Performance:
        Join Time: ${joinTime}ms
        Room ID: ${result.roomId}
        User ID: ${result.userId}
        Role: ${result.role}`);
    });
  });

  describe('Database query performance', () => {
    it('should fetch user rooms efficiently', async () => {
      const mockRooms = Array.from({ length: 20 }, (_, i) => ({
        id: `room-${i}`,
        creatorId: 'user-123',
        name: `User Room ${i}`,
        isPrivate: i % 2 === 0,
        isActive: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockSecretRoomRepo.createQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockRooms),
      });

      const startTime = Date.now();
      const result = await service.getUserRooms('user-123', 20);
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(result).toHaveLength(20);
      expect(queryTime).toBeLessThan(100); // Should be under 100ms

      console.log(`User Rooms Query Performance:
        Query Time: ${queryTime}ms
        Rooms Returned: ${result.length}
        Rooms per Second: ${(result.length / (queryTime / 1000)).toFixed(2)}`);
    });

    it('should handle room statistics queries efficiently', async () => {
      mockSecretRoomRepo.count
        .mockResolvedValueOnce(100) // total rooms
        .mockResolvedValueOnce(80) // active rooms
        .mockResolvedValueOnce(30) // private rooms
        .mockResolvedValueOnce(50) // public rooms
        .mockResolvedValueOnce(200) // rooms created today
        .mockResolvedValueOnce(500); // rooms created this week

      mockRoomMemberRepo.count.mockResolvedValue(1000); // total members

      const startTime = Date.now();
      const result = await service.getRoomStats();
      const endTime = Date.now();
      const statsTime = endTime - startTime;

      expect(result.totalRooms).toBe(100);
      expect(result.activeRooms).toBe(80);
      expect(result.privateRooms).toBe(30);
      expect(result.publicRooms).toBe(50);
      expect(statsTime).toBeLessThan(200); // Should be under 200ms

      console.log(`Room Statistics Query Performance:
        Query Time: ${statsTime}ms
        Total Rooms: ${result.totalRooms}
        Active Rooms: ${result.activeRooms}
        Private Rooms: ${result.privateRooms}
        Public Rooms: ${result.publicRooms}`);
    });

    it('should handle user room limit checks efficiently', async () => {
      mockSecretRoomRepo.count.mockResolvedValue(25); // User has 25 rooms

      const startTime = Date.now();
      const result = await service.getUserRoomLimit('user-123');
      const endTime = Date.now();
      const limitTime = endTime - startTime;

      expect(result.userId).toBe('user-123');
      expect(result.currentRooms).toBe(25);
      expect(result.maxRooms).toBe(100);
      expect(result.canCreateMore).toBe(true);
      expect(limitTime).toBeLessThan(50); // Should be under 50ms

      console.log(`User Room Limit Check Performance:
        Check Time: ${limitTime}ms
        Current Rooms: ${result.currentRooms}
        Max Rooms: ${result.maxRooms}
        Can Create More: ${result.canCreateMore}
        Remaining Slots: ${result.remainingSlots}`);
    });
  });

  describe('Concurrent operations performance', () => {
    it('should handle concurrent room operations efficiently', async () => {
      const mockRoom = {
        id: 'room-123',
        creatorId: 'user-123',
        name: 'Concurrent Test Room',
        roomCode: 'CONC1234',
        isPrivate: false,
        isActive: true,
        status: 'active',
        maxUsers: 50,
        currentUsers: 0,
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

      mockSecretRoomRepo.count.mockResolvedValue(5);
      mockSecretRoomRepo.findOne.mockResolvedValue(mockRoom);
      mockSecretRoomRepo.create.mockReturnValue(mockRoom);
      mockSecretRoomRepo.save.mockResolvedValue(mockRoom);
      mockRoomMemberRepo.create.mockReturnValue(mockMember);
      mockRoomMemberRepo.save.mockResolvedValue(mockMember);
      mockRoomMemberRepo.count.mockResolvedValue(1);

      const operations = [
        () => service.createSecretRoom({
          name: 'Concurrent Room 1',
          isPrivate: false,
        }, 'user-123'),
        () => service.getSecretRoom('room-123', 'user-123'),
        () => service.joinRoom({
          roomCode: 'CONC1234',
          nickname: 'Test User',
        }, 'user-456'),
        () => service.getUserRoomLimit('user-123'),
        () => service.getRoomStats(),
      ];

      const startTime = Date.now();
      const results = await Promise.all(operations.map(op => op()));
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(results).toHaveLength(5);
      expect(totalTime).toBeLessThan(500); // Should complete in under 500ms

      console.log(`Concurrent Operations Performance:
        Total Operations: 5
        Total Time: ${totalTime}ms
        Average Time per Operation: ${(totalTime / 5).toFixed(2)}ms
        Operations per Second: ${(5 / (totalTime / 1000)).toFixed(2)}`);
    });
  });
});
