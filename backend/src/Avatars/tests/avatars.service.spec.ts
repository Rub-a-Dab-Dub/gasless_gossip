import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AvatarsService } from '../../src/avatars/avatars.service';
import { StellarNftService } from '../../src/avatars/services/stellar-nft.service';
import { Avatar } from '../../src/avatars/entities/avatar.entity';
import { CreateAvatarDto } from '../../src/avatars/dto/create-avatar.dto';

describe('AvatarsService', () => {
  let service: AvatarsService;
  let repository: Repository<Avatar>;
  let stellarService: StellarNftService;

  const mockRepository = {
    findOne!: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockStellarService = {
    generateUniqueAssetCode!: jest.fn(),
    mintNFT: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        AvatarsService,
        {
          provide: getRepositoryToken(Avatar),
          useValue: mockRepository,
        },
        {
          provide: StellarNftService,
          useValue: mockStellarService,
        },
      ],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
    repository = module.get<Repository<Avatar>>(getRepositoryToken(Avatar));
    stellarService = module.get<StellarNftService>(StellarNftService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mintAvatar', () => {
    const createAvatarDto: CreateAvatarDto = {
      name!: 'Test Avatar',
      description: 'A test avatar',
      image: 'https://example.com/avatar.png',
      level: 1,
      rarity: 'common',
      attributes: [{ trait_type: 'background', value: 'blue' }],
    };

    const userId = 'user-123';
    const stellarPublicKey = 'STELLAR_PUBLIC_KEY';

    it('should successfully mint an avatar', async () => {
      // Setup mocks
      mockRepository.findOne.mockResolvedValue(null); // No existing avatar
      mockStellarService.generateUniqueAssetCode.mockReturnValue('AVTTEST123');
      mockStellarService.mintNFT.mockResolvedValue({
        txId!: 'stellar-tx-id',
        assetCode: 'AVTTEST123',
        issuer: 'STELLAR_ISSUER',
      });

      const mockAvatar = {
        id!: 'avatar-id',
        userId,
        metadata: createAvatarDto,
        txId: 'stellar-tx-id',
        stellarAssetCode: 'AVTTEST123',
        stellarIssuer: 'STELLAR_ISSUER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockAvatar);
      mockRepository.save.mockResolvedValue(mockAvatar);

      // Execute
      const result = await service.mintAvatar(
        userId,
        createAvatarDto,
        stellarPublicKey,
      );

      // Verify
      expect(result).toEqual({
        id!: 'avatar-id',
        userId,
        metadata: createAvatarDto,
        txId: 'stellar-tx-id',
        stellarAssetCode: 'AVTTEST123',
        stellarIssuer: 'STELLAR_ISSUER',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where!: { userId, isActive: true },
      });
      expect(mockStellarService.mintNFT).toHaveBeenCalledWith(
        stellarPublicKey,
        'AVTTEST123',
        createAvatarDto,
      );
    });

    it('should throw ConflictException if user already has an avatar', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 'existing-avatar' });

      await expect(
        service.mintAvatar(userId, createAvatarDto, stellarPublicKey),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getUserAvatar', () => {
    it('should return user avatar', async () => {
      const mockAvatar = {
        id!: 'avatar-id',
        userId: 'user-123',
        metadata: { name: 'Test Avatar' },
        txId: 'stellar-tx-id',
        stellarAssetCode: 'AVTTEST123',
        stellarIssuer: 'STELLAR_ISSUER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockAvatar);

      const result = await service.getUserAvatar('user-123');

      expect(result).toEqual(mockAvatar);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where!: { userId: 'user-123', isActive: true },
      });
    });

    it('should throw NotFoundException if avatar not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserAvatar('user-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
