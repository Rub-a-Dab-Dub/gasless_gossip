import type { Repository } from "typeorm";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import type { Nft, NftMetadata } from "../entities/nft.entity";
import type { NftCollection } from "../entities/nft-collection.entity";
import type { StellarNftService } from "./stellar-nft.service";
import type { UpdateNftDto } from "../dto/update-nft.dto";
export interface MintNftOptions {
    userId: string;
    metadata: NftMetadata;
    recipientStellarAddress: string;
    collectionId?: string;
    mintPrice?: string;
}
export interface TransferNftOptions {
    nftId: string;
    fromUserId: string;
    toUserId: string;
    toStellarAddress: string;
}
export declare class NftsService {
    private nftRepository;
    private collectionRepository;
    private stellarNftService;
    private eventEmitter;
    private readonly logger;
    constructor(nftRepository: Repository<Nft>, collectionRepository: Repository<NftCollection>, stellarNftService: StellarNftService, eventEmitter: EventEmitter2);
    mintNft(options: MintNftOptions): Promise<Nft>;
    transferNft(options: TransferNftOptions): Promise<Nft>;
    findNftsByUser(userId: string): Promise<Nft[]>;
    findNftById(id: string): Promise<Nft>;
    findNftByTxId(txId: string): Promise<Nft>;
    updateNftMetadata(id: string, updateData: UpdateNftDto): Promise<Nft>;
    calculateRarityScore(nftId: string): Promise<number>;
    verifyNftOwnership(nftId: string, userId: string): Promise<boolean>;
    private validateMetadata;
}
