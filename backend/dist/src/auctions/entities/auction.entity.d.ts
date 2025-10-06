import { Bid } from './bid.entity';
export declare class Auction {
    id: string;
    giftId: string;
    highestBid: number;
    endTime: Date;
    status: 'ACTIVE' | 'ENDED' | 'CANCELLED';
    winnerId: string;
    stellarEscrowAccount: string;
    bids: Bid[];
    createdAt: Date;
    updatedAt: Date;
}
