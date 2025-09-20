import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { StartAuctionDto } from './dto/start-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { StellarService } from './stellar.service';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    private stellarService: StellarService,
  ) {}

  async startAuction(startAuctionDto: StartAuctionDto): Promise<Auction> {
    const endTime = new Date(startAuctionDto.endTime);
    
    if (endTime <= new Date()) {
      throw new BadRequestException('End time must be in the future');
    }

    // Create Stellar escrow account for this auction
    const stellarEscrowAccount = await this.stellarService.createEscrowAccount();

    const auction = this.auctionRepository.create({
      giftId: startAuctionDto.giftId,
      endTime,
      highestBid: startAuctionDto.startingBid || 0,
      stellarEscrowAccount,
      status: 'ACTIVE'
    });

    return await this.auctionRepository.save(auction);
  }

  async placeBid(placeBidDto: PlaceBidDto): Promise<Bid> {
    const auction = await this.auctionRepository.findOne({
      where: { id: placeBidDto.auctionId },
      relations: ['bids']
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('Auction is not active');
    }

    if (new Date() >= auction.endTime) {
      throw new BadRequestException('Auction has ended');
    }

    if (placeBidDto.amount <= auction.highestBid) {
      throw new BadRequestException(`Bid must be higher than current highest bid of ${auction.highestBid}`);
    }

    // Process Stellar payment to escrow
    const stellarTransactionId = await this.stellarService.processEscrowPayment(
      placeBidDto.bidderId,
      auction.stellarEscrowAccount,
      placeBidDto.amount
    );

    // Create bid record
    const bid = this.bidRepository.create({
      auctionId: placeBidDto.auctionId,
      bidderId: placeBidDto.bidderId,
      amount: placeBidDto.amount,
      stellarTransactionId
    });

    await this.bidRepository.save(bid);

    // Update auction with new highest bid
    auction.highestBid = placeBidDto.amount;
    await this.auctionRepository.save(auction);

    // Refund previous highest bidder if exists
    await this.refundPreviousBidders(auction, placeBidDto.bidderId);

    return bid;
  }

  async getAuctionById(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['bids']
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    return auction;
  }

  async getActiveAuctions(): Promise<Auction[]> {
    return await this.auctionRepository.find({
      where: {
        status: 'ACTIVE',
        endTime: MoreThan(new Date())
      },
      relations: ['bids'],
      order: { endTime: 'ASC' }
    });
  }

  private async refundPreviousBidders(auction: Auction, currentBidderId: string): Promise<void> {
    const previousBids = auction.bids
      .filter(bid => bid.bidderId !== currentBidderId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    for (const bid of previousBids) {
      await this.stellarService.refundBidder(
        auction.stellarEscrowAccount,
        bid.bidderId,
        bid.amount,
        bid.stellarTransactionId
      );
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async resolveExpiredAuctions(): Promise<void> {
    const expiredAuctions = await this.auctionRepository.find({
      where: {
        status: 'ACTIVE',
        endTime: MoreThan(new Date())
      },
      relations: ['bids']
    });

    for (const auction of expiredAuctions) {
      await this.resolveAuction(auction);
    }
  }

  private async resolveAuction(auction: Auction): Promise<void> {
    if (auction.bids.length === 0) {
      // No bids, just mark as ended
      auction.status = 'ENDED';
      await this.auctionRepository.save(auction);
      return;
    }

    // Find winning bid (highest amount)
    const winningBid = auction.bids
      .sort((a, b) => b.amount - a.amount)[0];

    // Transfer escrowed funds to gift owner
    await this.stellarService.transferToGiftOwner(
      auction.stellarEscrowAccount,
      auction.giftId,
      winningBid.amount
    );

    // Update auction with winner
    auction.status = 'ENDED';
    auction.winnerId = winningBid.bidderId;
    await this.auctionRepository.save(auction);

    // Transfer the digital collectible to winner
    await this.stellarService.transferGiftToWinner(
      auction.giftId,
      winningBid.bidderId
    );
  }
}