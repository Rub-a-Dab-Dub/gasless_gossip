import type { ConfigService } from "@nestjs/config";
import type { NftMetadata } from "../entities/nft.entity";
export interface MintNftResult {
    transactionId: string;
    assetCode: string;
    assetIssuer: string;
    contractAddress: string;
    tokenId: string;
}
export declare class StellarNftService {
    private configService;
    private readonly logger;
    private readonly server;
    private readonly networkPassphrase;
    private readonly sourceKeypair;
    constructor(configService: ConfigService);
    mintNft(recipientPublicKey: string, metadata: NftMetadata, collectionSymbol?: string): Promise<MintNftResult>;
    transferNft(fromPublicKey: string, toPublicKey: string, assetCode: string, assetIssuer: string): Promise<string>;
    getNftMetadata(assetCode: string, assetIssuer: string): Promise<NftMetadata | null>;
    verifyNftOwnership(publicKey: string, assetCode: string, assetIssuer: string): Promise<boolean>;
    private generateAssetCode;
    getTransactionDetails(transactionId: string): Promise<any>;
}
