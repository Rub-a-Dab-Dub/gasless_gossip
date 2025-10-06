import { Nft } from "./nft.entity";
export declare class NftTransferHistory {
    id: string;
    nftId: string;
    nft: Nft;
    fromAddress: string;
    toAddress: string;
    fromUserId?: string;
    toUserId?: string;
    transactionId: string;
    blockNumber?: number;
    gasUsed?: number;
    transferType: "mint" | "transfer" | "burn";
    timestamp: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
}
