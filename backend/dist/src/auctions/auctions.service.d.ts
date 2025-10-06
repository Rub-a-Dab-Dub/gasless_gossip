import { Repository } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';
import { StartAuctionDto } from './dto/start-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { StellarService } from './stellar.service';
export declare class AuctionsService {
    private auctionRepository;
    private bidRepository;
    private stellarService;
    constructor(auctionRepository: Repository<Auction>, bidRepository: Repository<Bid>, stellarService: StellarService);
    startAuction(startAuctionDto: StartAuctionDto): Promise<Auction>;
    placeBid(placeBidDto: PlaceBidDto): Promise<Bid>;
    getAuctionById(id: string): Promise<Auction>;
    getActiveAuctions(): Promise<Auction[]>;
    private refundPreviousBidders;
    resolveExpiredAuctions(): Promise<void>;
    private resolveAuction;
}
