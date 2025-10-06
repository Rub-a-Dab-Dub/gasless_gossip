import { ConfigService } from '@nestjs/config';
export declare class StellarNftService {
    private configService;
    private readonly logger;
    private readonly server;
    private readonly issuerKeypair;
    private readonly networkPassphrase;
    constructor(configService: ConfigService);
    mintNFT(recipientPublicKey: string, assetCode: string, metadata: any): Promise<{
        txId: string;
        assetCode: string;
        issuer: string;
    }>;
    generateUniqueAssetCode(userId: string, level: number): string;
}
