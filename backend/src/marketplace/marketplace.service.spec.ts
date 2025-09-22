import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceService } from './marketplace.service';
import { Listing } from './entities/listing.entity';
import { StellarService } from '../stellar/stellar.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let repository: Repository<Listing>;
  let stellarService: StellarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [
        MarketplaceService,
        {
          provide: getRepositoryToken(Listing),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: StellarService,
          useValue: {
            mintBadgeToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MarketplaceService>(MarketplaceService);
    repository = module.get<Repository<Listing>>(getRepositoryToken(Listing));
    stellarService = module.get<StellarService>(StellarService);
  });

  it('should create a listing', async () => {
    const createListingDto = { giftId: 'gift1', price: 10 };
    const listing = { id: '1', sellerId: 'user1', ...createListingDto };

    jest.spyOn(repository, 'create').mockReturnValue(listing as any);
    jest.spyOn(repository, 'save').mockResolvedValue(listing as any);

    const result = await service.createListing('user1', createListingDto);
    expect(result).toEqual(listing);
  });

  it('should purchase a listing', async () => {
    const listing = { id: '1', sellerId: 'user1', price: 10, isActive: true };
    jest.spyOn(repository, 'findOne').mockResolvedValue(listing as any);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue({ ...listing, isActive: false } as any);

    const result = await service.purchaseListing('user2', '1');
    expect(result.isActive).toBe(false);
  });

  it('should throw error when purchasing own listing', async () => {
    const listing = { id: '1', sellerId: 'user1', price: 10, isActive: true };
    jest.spyOn(repository, 'findOne').mockResolvedValue(listing as any);

    await expect(service.purchaseListing('user1', '1')).rejects.toThrow(
      BadRequestException,
    );
  });
});
