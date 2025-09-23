import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BlurredAvatarsService } from './blurred-avatars.service';
import { BlurredAvatar } from './entities/blurred-avatar.entity';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BlurredAvatarsService', () => {
  let service: BlurredAvatarsService;
  let repository: Repository<BlurredAvatar>;
  let configService: ConfigService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockBlurredAvatar: BlurredAvatar = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user123',
    blurLevel: 5,
    imageUrl: 'http://localhost:3001/uploads/blurred-avatars/user123_1234567890_blur5.jpg',
    originalImageUrl: 'http://example.com/original-avatar.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlurredAvatarsService,
        {
          provide: getRepositoryToken(BlurredAvatar),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<BlurredAvatarsService>(BlurredAvatarsService);
    repository = module.get<Repository<BlurredAvatar>>(getRepositoryToken(BlurredAvatar));
    configService = module.get<ConfigService>(ConfigService);

    // Setup default config values
    mockConfigService.get.mockImplementation((key: string, defaultValue?: string) => {
      const values = {
        UPLOAD_PATH: './uploads/blurred-avatars',
        BASE_URL: 'http://localhost:3001',
      };
      return values[key] || defaultValue;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBlurredAvatar', () => {
    it('should create a new blurred avatar', async () => {
      const createDto: CreateBlurredAvatarDto = {
        userId: 'user123',
        blurLevel: 7,
        originalImageUrl: 'http://example.com/original-avatar.jpg',
      };

      mockRepository.findOne.mockResolvedValue(null); // No existing avatar
      mockRepository.create.mockReturnValue(mockBlurredAvatar);
      mockRepository.save.mockResolvedValue(mockBlurredAvatar);

      // Mock the image processing
      jest.spyOn(service as any, 'processImage').mockResolvedValue('http://localhost:3001/uploads/blurred-avatars/user123_1234567890_blur7.jpg');

      const result = await service.createBlurredAvatar(createDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId: createDto.userId, isActive: true },
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockBlurredAvatar);
    });

    it('should update existing avatar if user already has one', async () => {
      const createDto: CreateBlurredAvatarDto = {
        userId: 'user123',
        blurLevel: 7,
        originalImageUrl: 'http://example.com/original-avatar.jpg',
      };

      mockRepository.findOne.mockResolvedValue(mockBlurredAvatar); // Existing avatar

      // Mock updateBlurredAvatar method
      jest.spyOn(service, 'updateBlurredAvatar').mockResolvedValue(mockBlurredAvatar);

      const result = await service.createBlurredAvatar(createDto);

      expect(service.updateBlurredAvatar).toHaveBeenCalledWith(mockBlurredAvatar.id, {
        blurLevel: createDto.blurLevel,
        originalImageUrl: createDto.originalImageUrl,
      });
      expect(result).toEqual(mockBlurredAvatar);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all active blurred avatars for a user', async () => {
      const avatars = [mockBlurredAvatar];
      mockRepository.find.mockResolvedValue(avatars);

      const result = await service.findAllByUserId('user123');

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user123', isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(avatars);
    });
  });

  describe('findLatestByUserId', () => {
    it('should return the latest blurred avatar for a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlurredAvatar);

      const result = await service.findLatestByUserId('user123');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user123', isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockBlurredAvatar);
    });

    it('should return null if no avatar exists', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findLatestByUserId('user123');

      expect(result).toBeNull();
    });
  });

  describe('updateBlurredAvatar', () => {
    it('should update an existing blurred avatar', async () => {
      const updateDto = { blurLevel: 8 };
      mockRepository.findOne.mockResolvedValue(mockBlurredAvatar);
      mockRepository.save.mockResolvedValue({ ...mockBlurredAvatar, blurLevel: 8 });

      // Mock the image processing
      jest.spyOn(service as any, 'processImage').mockResolvedValue('http://localhost:3001/uploads/blurred-avatars/user123_1234567890_blur8.jpg');

      const result = await service.updateBlurredAvatar(mockBlurredAvatar.id, updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockBlurredAvatar.id } });
      expect(repository.save).toHaveBeenCalled();
      expect(result.blurLevel).toBe(8);
    });

    it('should throw NotFoundException if avatar does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateBlurredAvatar('nonexistent', { blurLevel: 8 }))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a blurred avatar', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlurredAvatar);
      mockRepository.save.mockResolvedValue({ ...mockBlurredAvatar, isActive: false });

      await service.remove(mockBlurredAvatar.id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockBlurredAvatar.id } });
      expect(repository.save).toHaveBeenCalledWith({ ...mockBlurredAvatar, isActive: false });
    });

    it('should throw NotFoundException if avatar does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getBlurredAvatarStats', () => {
    it('should return stats for user avatars', async () => {
      const avatars = [mockBlurredAvatar, { ...mockBlurredAvatar, id: 'another-id' }];
      jest.spyOn(service, 'findAllByUserId').mockResolvedValue(avatars);

      const result = await service.getBlurredAvatarStats('user123');

      expect(result).toEqual({
        totalAvatars: 2,
        latestBlurLevel: mockBlurredAvatar.blurLevel,
        lastUpdated: mockBlurredAvatar.updatedAt,
      });
    });

    it('should return empty stats if no avatars exist', async () => {
      jest.spyOn(service, 'findAllByUserId').mockResolvedValue([]);

      const result = await service.getBlurredAvatarStats('user123');

      expect(result).toEqual({
        totalAvatars: 0,
        latestBlurLevel: null,
        lastUpdated: null,
      });
    });
  });
});
