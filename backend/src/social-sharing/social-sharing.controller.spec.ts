import { Test, TestingModule } from '@nestjs/testing';
import { SocialSharingController } from './social-sharing.controller';
import { SocialSharingService } from './social-sharing.service';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareQueryDto } from './dto/share-query.dto';
import { ContentType, Platform } from './entities/share.entity';
import { User } from '../users/entities/user.entity';

describe('SocialSharingController', () => {
  let controller: SocialSharingController;
  let service: SocialSharingService;

  const mockUser: User = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    pseudonym: 'Test User',
    stellarAccountId: 'GABC123...',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockShare = {
    id: 'share-123',
    userId: 'user-123',
    contentType: ContentType.SECRET,
    platform: Platform.X,
    shareUrl: 'https://whspr.app/secrets/shared',
    externalUrl: 'https://twitter.com/intent/tweet?url=...',
    shareText: 'Check this out!',
    xpAwarded: 22,
    isSuccessful: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialSharingController],
      providers: [
        {
          provide: SocialSharingService,
          useValue: {
            createShare: jest.fn(),
            getSharesByUser: jest.fn(),
            getAllShares: jest.fn(),
            getShareById: jest.fn(),
            getShareStats: jest.fn(),
            generateMockShareContent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SocialSharingController>(SocialSharingController);
    service = module.get<SocialSharingService>(SocialSharingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createShare', () => {
    it('should create a share', async () => {
      const createShareDto: CreateShareDto = {
        contentType: ContentType.SECRET,
        platform: Platform.X,
        shareText: 'Check this out!',
      };

      jest.spyOn(service, 'createShare').mockResolvedValue(mockShare as any);

      const result = await controller.createShare(createShareDto, mockUser);

      expect(service.createShare).toHaveBeenCalledWith(createShareDto, mockUser.id);
      expect(result).toEqual(mockShare);
    });
  });

  describe('getSharesByUser', () => {
    it('should get shares by user ID', async () => {
      const query: ShareQueryDto = { limit: 10, offset: 0 };
      const expectedResult = { shares: [mockShare], total: 1 };

      jest.spyOn(service, 'getSharesByUser').mockResolvedValue(expectedResult);

      const result = await controller.getSharesByUser('user-123', query);

      expect(service.getSharesByUser).toHaveBeenCalledWith('user-123', query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMyShares', () => {
    it('should get current user shares', async () => {
      const query: ShareQueryDto = { limit: 10, offset: 0 };
      const expectedResult = { shares: [mockShare], total: 1 };

      jest.spyOn(service, 'getSharesByUser').mockResolvedValue(expectedResult);

      const result = await controller.getMyShares(mockUser, query);

      expect(service.getSharesByUser).toHaveBeenCalledWith(mockUser.id, query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllShares', () => {
    it('should get all shares with filters', async () => {
      const query: ShareQueryDto = {
        contentType: ContentType.SECRET,
        platform: Platform.X,
        limit: 20,
        offset: 0,
      };
      const expectedResult = { shares: [mockShare], total: 1 };

      jest.spyOn(service, 'getAllShares').mockResolvedValue(expectedResult);

      const result = await controller.getAllShares(query);

      expect(service.getAllShares).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getShareById', () => {
    it('should get share by ID', async () => {
      jest.spyOn(service, 'getShareById').mockResolvedValue(mockShare as any);

      const result = await controller.getShareById('share-123');

      expect(service.getShareById).toHaveBeenCalledWith('share-123');
      expect(result).toEqual(mockShare);
    });
  });

  describe('getShareStats', () => {
    it('should get overall share statistics', async () => {
      const expectedStats = {
        totalShares: 100,
        totalXpAwarded: 2500,
        platformBreakdown: { [Platform.X]: 50, [Platform.FACEBOOK]: 30, [Platform.LINKEDIN]: 20 },
        contentTypeBreakdown: { [ContentType.SECRET]: 40, [ContentType.NFT]: 35, [ContentType.ACHIEVEMENT]: 25 },
      };

      jest.spyOn(service, 'getShareStats').mockResolvedValue(expectedStats);

      const result = await controller.getShareStats();

      expect(service.getShareStats).toHaveBeenCalledWith();
      expect(result).toEqual(expectedStats);
    });
  });

  describe('getMyShareStats', () => {
    it('should get user share statistics', async () => {
      const expectedStats = {
        totalShares: 10,
        totalXpAwarded: 250,
        platformBreakdown: { [Platform.X]: 5, [Platform.FACEBOOK]: 3, [Platform.LINKEDIN]: 2 },
        contentTypeBreakdown: { [ContentType.SECRET]: 4, [ContentType.NFT]: 3, [ContentType.ACHIEVEMENT]: 3 },
      };

      jest.spyOn(service, 'getShareStats').mockResolvedValue(expectedStats);

      const result = await controller.getMyShareStats(mockUser);

      expect(service.getShareStats).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expectedStats);
    });
  });

  describe('generateMockShare', () => {
    it('should generate mock share content', async () => {
      const mockContent = {
        shareText: 'Mock share text',
        metadata: { type: 'test' },
        suggestedPlatforms: ['x', 'facebook', 'linkedin', 'discord'],
      };

      jest.spyOn(service, 'generateMockShareContent').mockResolvedValue({
        shareText: 'Mock share text',
        metadata: { type: 'test' },
      });

      const result = await controller.generateMockShare('secret', mockUser);

      expect(service.generateMockShareContent).toHaveBeenCalledWith('secret', mockUser.id);
      expect(result).toEqual(mockContent);
    });
  });
});
