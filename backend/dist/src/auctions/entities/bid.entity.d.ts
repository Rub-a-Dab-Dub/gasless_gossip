import { Auction } from './auction.entity';
export declare class Bid {
    id: string;
    auctionId: string;
    bidderId: string;
    amount: number;
    stellarTransactionId: string;
    auction: Auction;
    createdAt: Date;
}
