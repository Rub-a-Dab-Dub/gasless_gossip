import type { Repository } from "typeorm";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Nft } from "../entities/nft.entity";
import type { NftTransferHistory } from "../entities/nft-transfer-history.entity";
import type { StellarNftService } from "./stellar-nft.service";
export interface TransferLogEntry {
    nftId: string;
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
}
export declare class TransferLoggerService {
    private nftRepository;
    private transferHistoryRepository;
    private stellarNftService;
    private eventEmitter;
    private readonly logger;
    constructor(nftRepository: Repository<Nft>, transferHistoryRepository: Repository<NftTransferHistory>, stellarNftService: StellarNftService, eventEmitter: EventEmitter2);
    logTransfer(entry: TransferLogEntry): Promise<void>;
    getTransferHistory(nftId: string): Promise<NftTransferHistory[]>;
    getTransferHistoryByUser(userId: string): Promise<NftTransferHistory[]>;
    getTransferHistoryByAddress(address: string): Promise<NftTransferHistory[]>;
    syncTransferFromStellar(transactionId: string): Promise<void>;
    validateTransferIntegrity(nftId: string): Promise<boolean>;
    getTransferStatistics(timeframe?: "day" | "week" | "month" | "year"): Promise<{
        totalTransfers: number;
        mints: number;
        transfers: number;
        burns: number;
        uniqueNfts: number;
        uniqueUsers: number;
    }>;
}
