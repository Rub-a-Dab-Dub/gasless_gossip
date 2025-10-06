import { AuctionsService } from './auctions.service';
import { StartAuctionDto } from './dto/start-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
export declare class AuctionsController {
    private readonly auctionsService;
    constructor(auctionsService: AuctionsService);
    startAuction(startAuctionDto: StartAuctionDto): Promise<{
        success: boolean;
        data: import("./entities/auction.entity").Auction;
        message: string;
    }>;
    placeBid(placeBidDto: PlaceBidDto): Promise<{
        success: boolean;
        data: import("./entities/bid.entity").Bid;
        message: string;
    }>;
    getAuctionStatus(id: string): Promise<{
        success: boolean;
        data: import("./entities/auction.entity").Auction;
        message: string;
    }>;
    getActiveAuctions(): Promise<{
        success: boolean;
        data: import("./entities/auction.entity").Auction[];
        message: string;
    }>;
}
