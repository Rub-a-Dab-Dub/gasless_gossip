import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SocialSharingService } from './social-sharing.service';
import { Share, ContentType, Platform } from './entities/share.entity';
import { User } from '../users/entities/user.entity';
import { XpService } from '../xp/xp.service';

describe('SocialSharingService', () => {
  let service: SocialSharingService;
  let shareRepository: Repository<Share>;
  let userRepository: Repository<User>;
  let xpService: XpService;

  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    pseudonym: 'Test User',
    stellarAccountId: 'GABC123...',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockShare = {
    id: 'share-123',
    userId: 'user-123',
    contentType: ContentType.SECRET,
    platform: Platform.X,
    shareUrl: 'https://whspr.app/secrets/shared',
    externalUrl: 'https://twitter.com/intent/tweet?url=...',
    shareText: 'Check this out!',
    xpAwarded: 22, // 15 base + 50% X platform bonus
    isSuccessful: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialSharingService,
        {
          provide: getRepositoryToken(Share),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'APP_BASE_URL') return 'https://whspr.app';
              return null;
            }),
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

    service = module.get<SocialSharingService>(SocialSharingService);
    shareRepository = module.get<Repository<Share>>(getRepositoryToken(Share));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    xpService = module.get<XpService>(XpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShare', () => {
    it('should create a share and award XP', async () => {
      const createShareDto = {
        contentType: ContentType.SECRET,
        platform: Platform.X,
        shareText: 'Check this out!',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(shareRepository, 'create').mockReturnValue(mockShare as Share);
      jest.spyOn(shareRepository, 'save').mockResolvedValue(mockShare as Share);
      jest.spyOn(xpService, 'addXp').mockResolvedValue(undefined);

      const result = await service.createShare(createShareDto, 'user-123');

      expect(result).toEqual(mockShare);
      expect(xpService.addXp).toHaveBeenCalledWith('user-123', 22, 'social_share');
      expect(shareRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          contentType: ContentType.SECRET,
          platform: Platform.X,
          userId: 'user-123',
          xpAwarded: 22,
        }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const createShareDto = {
        contentType: ContentType.SECRET,
        platform: Platform.X,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createShare(createShareDto, 'nonexistent-user')).rejects.toThrow(
        'User not found',
      );
    });

    it('should handle XP award failure gracefully', async () => {
      const createShareDto = {
        contentType: ContentType.SECRET,
        platform: Platform.X,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(shareRepository, 'create').mockReturnValue(mockShare as Share);
      jest.spyOn(shareRepository, 'save')
        .mockResolvedValueOnce(mockShare as Share)
        .mockResolvedValueOnce({ ...mockShare, isSuccessful: false } as Share);
      jest.spyOn(xpService, 'addXp').mockRejectedValue(new Error('XP service error'));

      const result = await service.createShare(createShareDto, 'user-123');

      expect(result.isSuccessful).toBe(false);
      expect(result.errorMessage).toBe('XP award failed');
    });
  });

  describe('getSharesByUser', () => {
    it('should return user shares with pagination', async () => {
      const query = { limit: 10, offset: 0 };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockShare], 1]),
      };

      jest.spyOn(shareRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getSharesByUser('user-123', query);

      expect(result).toEqual({ shares: [mockShare], total: 1 });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('share.userId = :userId', { userId: 'user-123' });
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0);
    });
  });

  describe('generateMockShareContent', () => {
    it('should generate appropriate content for different content types', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      const secretContent = await service.generateMockShareContent(ContentType.SECRET, 'user-123');
      expect(secretContent.shareText).toContain('secret');
      expect(secretContent.metadata.type).toBe('secret_discovery');

      const achievementContent = await service.generateMockShareContent(ContentType.ACHIEVEMENT, 'user-123');
      expect(achievementContent.shareText).toContain('Achievement');
      expect(achievementContent.metadata.type).toBe('milestone_reached');
    });
  });

  describe('getShareStats', () => {
    it('should return correct statistics', async () => {
      const mockShares = [
        { ...mockShare, platform: Platform.X, contentType: ContentType.SECRET, xpAwarded: 22 },
        { ...mockShare, platform: Platform.FACEBOOK, contentType: ContentType.GIFT, xpAwarded: 12 },
        { ...mockShare, platform: Platform.X, contentType: ContentType.NFT, xpAwarded: 37 },
      ];

      const mockQueryBuilder = {
        getMany: jest.fn().mockResolvedValue(mockShares),
      };

      jest.spyOn(shareRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const stats = await service.getShareStats();

      expect(stats.totalShares).toBe(3);
      expect(stats.totalXpAwarded).toBe(71);
      expect(stats.platformBreakdown[Platform.X]).toBe(2);
      expect(stats.platformBreakdown[Platform.FACEBOOK]).toBe(1);
      expect(stats.contentTypeBreakdown[ContentType.SECRET]).toBe(1);
      expect(stats.contentTypeBreakdown[ContentType.GIFT]).toBe(1);
      expect(stats.contentTypeBreakdown[ContentType.NFT]).toBe(1);
    });
  });
});
