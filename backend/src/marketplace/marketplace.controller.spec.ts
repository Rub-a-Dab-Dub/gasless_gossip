import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

describe('MarketplaceController', () => {
  let controller: MarketplaceController;
  let service: MarketplaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers!: [MarketplaceController],
      providers!: [
        {
          provide: MarketplaceService,
          useValue: {
            createListing: jest.fn(),
            purchaseListing: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MarketplaceController>(MarketplaceController);
    service = module.get<MarketplaceService>(MarketplaceService);
  });

  it('should create listing', async () => {
    const createListingDto = { giftId: 'gift1', price: 10 };
    const req = { user: { sub: 'user1' } };
    const listing = { id: '1', ...createListingDto, sellerId: 'user1' };

    jest.spyOn(service, 'createListing').mockResolvedValue(listing as any);

    const result = await controller.createListing(req, createListingDto);
    expect(result).toEqual(listing);
    expect(service.createListing).toHaveBeenCalledWith(
      'user1',
      createListingDto,
    );
  });

  it('should purchase listing', async () => {
    const purchaseDto = { listingId: '1' };
    const req = { user: { sub: 'user2' } };
    const listing = { id: '1', isActive: false };

    jest.spyOn(service, 'purchaseListing').mockResolvedValue(listing as any);

    const result = await controller.purchaseListing(req, purchaseDto);
    expect(result).toEqual(listing);
    expect(service.purchaseListing).toHaveBeenCalledWith('user2', '1');
  });
});
