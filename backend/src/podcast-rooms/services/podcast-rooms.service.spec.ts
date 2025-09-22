// src/podcast-rooms/services/podcast-rooms.service.spec.ts
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IPFSService } from './ipfs.service';
import { StellarService } from './stellar.service';
import { PodcastRoom } from '../entities/podcast-room.entity';
import { PodcastRoomsService } from './podcast-rooms.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePodcastRoomDto } from '../dto/create-podcast-room.dto';
import { UpdatePodcastRoomDto } from '../dto/update-podcast-room.dto';

describe('PodcastRoomsService', () => {
  let service: PodcastRoomsService;
  let repository: Repository<PodcastRoom>;
  let stellarService: StellarService;
  let ipfsService: IPFSService;

  const mockRepository = {
    create!: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockStellarService = {
    generateHash!: jest.fn(),
    storeMetadata: jest.fn(),
    verifyHash: jest.fn(),
  };

  const mockIPFSService = {
    uploadAudio!: jest.fn(),
    getAudioUrl: jest.fn(),
    pinContent: jest.fn(),
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
      providers!: [
        PodcastRoomsService,
        {
          provide: getRepositoryToken(PodcastRoom),
          useValue: mockRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
        {
          provide: IPFSService,
          useValue: mockIPFSService,
        },
      ],
    }).compile();

    service = module.get<PodcastRoomsService>(PodcastRoomsService);
    repository = module.get<Repository<PodcastRoom>>(
      getRepositoryToken(PodcastRoom),
    );
    stellarService = module.get<StellarService>(StellarService);
    ipfsService = module.get<IPFSService>(IPFSService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
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

    it('should create a podcast room successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockStellarService.generateHash.mockResolvedValue('stellar_hash_123');
      mockStellarService.storeMetadata.mockResolvedValue('tx_hash_123');
      mockRepository.create.mockReturnValue(mockPodcastRoom);
      mockRepository.save.mockResolvedValue(mockPodcastRoom);

      const result = await service.create(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where!: { roomId: createDto.roomId },
      });
      expect(mockStellarService.generateHash).toHaveBeenCalledWith(
        createDto.audioHash,
      );
      expect(mockStellarService.storeMetadata).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPodcastRoom);
    });

    it('should throw ConflictException if room ID already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all active podcast rooms', async () => {
      const mockRooms = [mockPodcastRoom];
      mockRepository.find.mockResolvedValue(mockRooms);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where!: { isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockRooms);
    });

    it('should filter by creator ID when provided', async () => {
      const mockRooms = [mockPodcastRoom];
      const creatorId = 'creator-123';
      mockRepository.find.mockResolvedValue(mockRooms);

      const result = await service.findAll(creatorId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where!: { creatorId, isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockRooms);
    });
  });

  describe('findOne', () => {
    it('should return a podcast room by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);

      const result = await service.findOne(mockPodcastRoom.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where!: { id: mockPodcastRoom.id, isActive: true },
      });
      expect(result).toEqual(mockPodcastRoom);
    });

    it('should throw NotFoundException if podcast room not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdatePodcastRoomDto = {
      title!: 'Updated Title',
      description: 'Updated Description',
    };

    it('should update a podcast room successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);
      const updatedRoom = { ...mockPodcastRoom, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedRoom);

      const result = await service.update(
        mockPodcastRoom.id,
        updateDto,
        mockPodcastRoom.creatorId,
      );

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.title).toEqual(updateDto.title);
      expect(result.description).toEqual(updateDto.description);
    });

    it('should throw ForbiddenException if user is not the creator', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);

      await expect(
        service.update(mockPodcastRoom.id, updateDto, 'different-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should soft delete a podcast room successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);
      const updatedRoom = { ...mockPodcastRoom, isActive: false };
      mockRepository.save.mockResolvedValue(updatedRoom);

      await service.remove(mockPodcastRoom.id, mockPodcastRoom.creatorId);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should throw ForbiddenException if user is not the creator', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);

      await expect(
        service.remove(mockPodcastRoom.id, 'different-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('verifyAccess', () => {
    it('should return true for active rooms', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);

      const result = await service.verifyAccess(
        mockPodcastRoom.roomId,
        'any-user',
      );

      expect(result).toBe(true);
    });

    it('should throw NotFoundException for non-existent rooms', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.verifyAccess('non-existent-room', 'any-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAudioUrl', () => {
    it('should return audio URL from IPFS', async () => {
      mockRepository.findOne.mockResolvedValue(mockPodcastRoom);
      mockIPFSService.getAudioUrl.mockReturnValue('https://ipfs.io/ipfs/hash');

      const result = await service.getAudioUrl(mockPodcastRoom.roomId);

      expect(mockIPFSService.getAudioUrl).toHaveBeenCalledWith(
        mockPodcastRoom.ipfsHash,
      );
      expect(result).toBe('https://ipfs.io/ipfs/hash');
    });

    it('should throw NotFoundException if no IPFS hash exists', async () => {
      const roomWithoutIpfs = { ...mockPodcastRoom, ipfsHash: null };
      mockRepository.findOne.mockResolvedValue(roomWithoutIpfs);

      await expect(service.getAudioUrl(mockPodcastRoom.roomId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
