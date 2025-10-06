import type { Repository } from "typeorm";
import type { NftsService } from "../services/nfts.service";
import type { Nft } from "../entities/nft.entity";
import type { NftCollection } from "../entities/nft-collection.entity";
export declare class SampleDataService {
    private nftsService;
    private nftRepository;
    private collectionRepository;
    private readonly logger;
    constructor(nftsService: NftsService, nftRepository: Repository<Nft>, collectionRepository: Repository<NftCollection>);
    generateSampleNfts(count?: number): Promise<Nft[]>;
    createSampleCollection(): Promise<NftCollection>;
    testNftOperations(): Promise<void>;
    private getRandomRarity;
    private getRandomBackground;
    private getRandomEyes;
    private getRandomAccessory;
    private getRandomPrice;
}
