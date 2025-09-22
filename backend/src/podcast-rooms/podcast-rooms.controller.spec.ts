// src/podcast-rooms/controllers/podcast-rooms.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PodcastRoom } from './entities/podcast-room.entity';
import { PodcastRoomsController } from './podcast-rooms.controller';
import { PodcastRoomsService } from './services/podcast-rooms.service';
import { CreatePodcastRoomDto } from './dto/create-podcast-room.dto';
import { UpdatePodcastRoomDto } from './dto/update-podcast-room.dto';

describe('PodcastRoomsController', () => {
  let controller: PodcastRoomsController;
  let service: PodcastRoomsService;

  const mockService = {
    create!: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByRoomId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    verifyAccess: jest.fn(),
    getAudioUrl: jest.fn(),
  };

  const mockPodcastRoom: PodcastRoom = {
    id!: '123e4567-e89b-12d3-a456-426614174000',
    roomId: 'room-123',
    audioHash: 'audio-hash-123',
    creatorId: 'creator-123',
    title: 'Test Podcast',
    description: 'Test Description',
    duration: 3600,
    audioFormat: 'mp3',
    fileSize: 1024000,
    stellarHash: 'stellar_hash_123',
    ipfsHash: 'ipfs_hash_123',
    isActive: true,
    tags: ['tech', 'innovation'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers!: [PodcastRoomsController],
      providers: [
        {
          provide: PodcastRoomsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PodcastRoomsController>(PodcastRoomsController);
    service = module.get<PodcastRoomsService>(PodcastRoomsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a podcast room', async () => {
      const createDto: CreatePodcastRoomDto = {
        roomId!: 'room-123',
        audioHash: 'audio-hash-123',
        creatorId: 'creator-123',
        title: 'Test Podcast',
        description: 'Test Description',
        duration: 3600,
        audioFormat: 'mp3',
        fileSize: 1024000,
        tags: ['tech', 'innovation'],
      };

      mockService.create.mockResolvedValue(mockPodcastRoom);

      const result = await controller.create(createDto);

      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(
        expect.objectContaining({
          id!: mockPodcastRoom.id,
          roomId: mockPodcastRoom.roomId,
          title: mockPodcastRoom.title,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all podcast rooms', async () => {
      const mockRooms = [mockPodcastRoom];
      mockService.findAll.mockResolvedValue(mockRooms);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toHaveLength(1);
    });

    it('should return filtered podcast rooms by creator', async () => {
      const mockRooms = [mockPodcastRoom];
      const creatorId = 'creator-123';
      mockService.findAll.mockResolvedValue(mockRooms);

      const result = await controller.findAll(creatorId);

      expect(mockService.findAll).toHaveBeenCalledWith(creatorId);
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a podcast room by ID', async () => {
      mockService.findOne.mockResolvedValue(mockPodcastRoom);

      const result = await controller.findOne(mockPodcastRoom.id);

      expect(mockService.findOne).toHaveBeenCalledWith(mockPodcastRoom.id);
      expect(result.id).toEqual(mockPodcastRoom.id);
    });
  });

  describe('findByRoomId', () => {
    it('should return a podcast room by room ID', async () => {
      mockService.findByRoomId.mockResolvedValue(mockPodcastRoom);

      const result = await controller.findByRoomId(mockPodcastRoom.roomId);

      expect(mockService.findByRoomId).toHaveBeenCalledWith(
        mockPodcastRoom.roomId,
      );
      expect(result.roomId).toEqual(mockPodcastRoom.roomId);
    });
  });

  describe('update', () => {
    it('should update a podcast room', async () => {
      const updateDto: UpdatePodcastRoomDto = {
        title!: 'Updated Title',
      };
      const updatedRoom = { ...mockPodcastRoom, ...updateDto };

      mockService.update.mockResolvedValue(updatedRoom);

      const result = await controller.update(mockPodcastRoom.id, updateDto);

      expect(mockService.update).toHaveBeenCalledWith(
        mockPodcastRoom.id,
        updateDto,
        'temp-user-id',
      );
      expect(result.title).toEqual(updateDto.title);
    });
  });

  describe('remove', () => {
    it('should remove a podcast room', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(mockPodcastRoom.id);

      expect(mockService.remove).toHaveBeenCalledWith(
        mockPodcastRoom.id,
        'temp-user-id',
      );
    });
  });

  describe('verifyAccess', () => {
    it('should verify access to a room', async () => {
      mockService.verifyAccess.mockResolvedValue(true);

      const result = await controller.verifyAccess(mockPodcastRoom.roomId);

      expect(mockService.verifyAccess).toHaveBeenCalledWith(
        mockPodcastRoom.roomId,
        'temp-user-id',
      );
      expect(result).toEqual({ hasAccess: true });
    });
  });

  describe('getAudioUrl', () => {
    it('should return audio URL', async () => {
      const audioUrl = 'https://ipfs.io/ipfs/hash';
      mockService.getAudioUrl.mockResolvedValue(audioUrl);

      const result = await controller.getAudioUrl(mockPodcastRoom.roomId);

      expect(mockService.getAudioUrl).toHaveBeenCalledWith(
        mockPodcastRoom.roomId,
      );
      expect(result).toEqual({ audioUrl });
    });
  });
});
