import { Test, TestingModule } from '@nestjs/testing';
import { BlurredAvatarsController } from './blurred-avatars.controller';
import { BlurredAvatarsService } from './blurred-avatars.service';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';
import { UpdateBlurredAvatarDto } from './dto/update-blurred-avatar.dto';
import { BlurredAvatar } from './entities/blurred-avatar.entity';

describe('BlurredAvatarsController', () => {
  let controller: BlurredAvatarsController;
  let service: BlurredAvatarsService;

  const mockBlurredAvatarsService = {
    createBlurredAvatar: jest.fn(),
    findAllByUserId: jest.fn(),
    findLatestByUserId: jest.fn(),
    updateBlurredAvatar: jest.fn(),
    remove: jest.fn(),
    getBlurredAvatarStats: jest.fn(),
  };

  const mockBlurredAvatar: BlurredAvatar = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user123',
    blurLevel: 5,
    imageUrl: 'http://example.com/blurred-avatar.jpg',
    originalImageUrl: 'http://example.com/original-avatar.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlurredAvatarsController],
      providers: [
        {
          provide: BlurredAvatarsService,
          useValue: mockBlurredAvatarsService,
        },
      ],
    }).compile();

    controller = module.get<BlurredAvatarsController>(BlurredAvatarsController);
    service = module.get<BlurredAvatarsService>(BlurredAvatarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBlurredAvatar', () => {
    it('should create a blurred avatar', async () => {
      const createDto: CreateBlurredAvatarDto = {
        userId: 'user123',
        blurLevel: 7,
        originalImageUrl: 'http://example.com/original-avatar.jpg',
      };

      mockBlurredAvatarsService.createBlurredAvatar.mockResolvedValue(mockBlurredAvatar);

      const result = await controller.createBlurredAvatar(createDto);

      expect(service.createBlurredAvatar).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        success: true,
        message: 'Blurred avatar created successfully',
        data: mockBlurredAvatar,
      });
    });
  });

  describe('getBlurredAvatars', () => {
    it('should return latest blurred avatar when latest=true', async () => {
      mockBlurredAvatarsService.findLatestByUserId.mockResolvedValue(mockBlurredAvatar);

      const result = await controller.getBlurredAvatars('user123', 'true');

      expect(service.findLatestByUserId).toHaveBeenCalledWith('user123');
      expect(result).toEqual({
        success: true,
        message: 'Latest blurred avatar retrieved successfully',
        data: mockBlurredAvatar,
      });
    });

    it('should return all blurred avatars when latest is not specified', async () => {
      const avatars = [mockBlurredAvatar];
      mockBlurredAvatarsService.findAllByUserId.mockResolvedValue(avatars);

      const result = await controller.getBlurredAvatars('user123');

      expect(service.findAllByUserId).toHaveBeenCalledWith('user123');
      expect(result).toEqual({
        success: true,
        message: 'Blurred avatars retrieved successfully',
        data: avatars,
      });
    });
  });

  describe('getBlurredAvatarStats', () => {
    it('should return avatar stats', async () => {
      const stats = {
        totalAvatars: 3,
        latestBlurLevel: 5,
        lastUpdated: new Date(),
      };

      mockBlurredAvatarsService.getBlurredAvatarStats.mockResolvedValue(stats);

      const result = await controller.getBlurredAvatarStats('user123');

      expect(service.getBlurredAvatarStats).toHaveBeenCalledWith('user123');
      expect(result).toEqual({
        success: true,
        message: 'Blurred avatar stats retrieved successfully',
        data: stats,
      });
    });
  });

  describe('updateBlurredAvatar', () => {
    it('should update a blurred avatar', async () => {
      const updateDto: UpdateBlurredAvatarDto = {
        blurLevel: 8,
      };

      const updatedAvatar = { ...mockBlurredAvatar, blurLevel: 8 };
      mockBlurredAvatarsService.updateBlurredAvatar.mockResolvedValue(updatedAvatar);

      const result = await controller.updateBlurredAvatar('avatar123', updateDto);

      expect(service.updateBlurredAvatar).toHaveBeenCalledWith('avatar123', updateDto);
      expect(result).toEqual({
        success: true,
        message: 'Blurred avatar updated successfully',
        data: updatedAvatar,
      });
    });
  });

  describe('removeBlurredAvatar', () => {
    it('should remove a blurred avatar', async () => {
      mockBlurredAvatarsService.remove.mockResolvedValue(undefined);

      const result = await controller.removeBlurredAvatar('avatar123');

      expect(service.remove).toHaveBeenCalledWith('avatar123');
      expect(result).toEqual({
        success: true,
        message: 'Blurred avatar removed successfully',
      });
    });
  });
});
