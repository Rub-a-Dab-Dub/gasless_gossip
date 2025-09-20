import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionsService } from '../auctions.service';
import { StellarService } from '../stellar.service';
import { Auction } from '../entities/auction.entity';
import { Bid } from '../entities/bid.entity';

describe('AuctionsService', () => {
  let service: AuctionsService;
  let auctionRepo: Repository<Auction>;
  let bidRepo: Repository<Bid>;
  let stellarService: StellarService;

  const mockAuctionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockBidRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockStellarService = {
    createEscrowAccount: jest.fn(),
    processEscrowPayment: jest.fn(),
    refundBidder: jest.fn(),
    transferToGiftOwner: jest.fn(),
    transferGiftToWinner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        { provide: getRepositoryToken(Auction), useValue: mockAuctionRepo },
        { provide: getRepositoryToken(Bid), useValue: mockBidRepo },
        { provide: StellarService, useValue: mockStellarService },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
    auctionRepo = module.get<Repository<Auction>>(getRepositoryToken(Auction));
    bidRepo = module.get<Repository<Bid>>(getRepositoryToken(Bid));
    stellarService = module.get<StellarService>(StellarService);
  });

  describe('startAuction', () => {
    it('should create a new auction successfully', async () => {
      const startAuctionDto = {
        giftId: 'gift-123',
        endTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
        startingBid: 10
      };

      const mockEscrowAccount = 'GCTEST123...';
      const mockAuction = {
        id: 'auction-123',
        giftId: startAuctionDto.giftId,
        highestBid: startAuctionDto.startingBid,
        stellarEscrowAccount: mockEscrowAccount,
        status: 'ACTIVE'
      };

      mockStellarService.createEscrowAccount.mockResolvedValue(mockEscrowAccount);
      mockAuctionRepo.create.mockReturnValue(mockAuction);
      mockAuctionRepo.save.mockResolvedValue(mockAuction);

      const result = await service.startAuction(startAuctionDto);

      expect(mockStellarService.createEscrowAccount).toHaveBeenCalled();
      expect(mockAuctionRepo.create).toHaveBeenCalled();
      expect(mockAuctionRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockAuction);
    });

    it('should throw error if end time is in the past', async () => {
      const startAuctionDto = {
        giftId: 'gift-123',
        endTime: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
      };

      await expect(service.startAuction(startAuctionDto))
        .rejects
        .toThrow('End time must be in the future');
    });
  });

  describe('placeBid', () => {
    it('should place a valid bid successfully', async () => {
      const placeBidDto = {
        auctionId: 'auction-123',
        bidderId: 'bidder-123',
        amount: 15
      };

      const mockAuction = {
        id: 'auction-123',
        status: 'ACTIVE',
        endTime: new Date(Date.now() + 86400000), // 24 hours from now
        highestBid: 10,
        stellarEscrowAccount: 'GCTEST123...',
        bids: []
      };

      const mockBid = {
        id: 'bid-123',
        auctionId: placeBidDto.auctionId,
        bidderId: placeBidDto.bidderId,
        amount: placeBidDto.amount,
        stellarTransactionId: 'stellar_tx_123'
      };

      mockAuctionRepo.findOne.mockResolvedValue(mockAuction);
      mockStellarService.processEscrowPayment.mockResolvedValue('stellar_tx_123');
      mockBidRepo.create.mockReturnValue(mockBid);
      mockBidRepo.save.mockResolvedValue(mockBid);
      mockAuctionRepo.save.mockResolvedValue({ ...mockAuction, highestBid: 15 });

      const result = await service.placeBid(placeBidDto);

      expect(mockStellarService.processEscrowPayment).toHaveBeenCalledWith(
        placeBidDto.bidderId,
        mockAuction.stellarEscrowAccount,
        placeBidDto.amount
      );
      expect(result).toEqual(mockBid);
    });

    it('should reject bid lower than highest bid', async () => {
      const placeBidDto = {
        auctionId: 'auction-123',
        bidderId: 'bidder-123',
        amount: 5 // Lower than current highest bid
      };

      const mockAuction = {
        id: 'auction-123',
        status: 'ACTIVE',
        endTime: new Date(Date.now() + 86400000),
        highestBid: 10,
        bids: []
      };

      mockAuctionRepo.findOne.mockResolvedValue(mockAuction);

      await expect(service.placeBid(placeBidDto))
        .rejects
        .toThrow('Bid must be higher than current highest bid of 10');
    });
  });
});