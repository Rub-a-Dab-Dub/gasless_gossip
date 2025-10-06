import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';
export declare class StellarService {
    private configService;
    private readonly logger;
    private readonly server;
    private readonly issuerKeypair;
    private readonly distributorKeypair;
    constructor(configService: ConfigService);
    createMemecoinAsset(assetCode: string): Promise<StellarSdk.Asset>;
    distributeToRecipients(recipients: string[], amount: number, assetCode?: string): Promise<string>;
    establishTrustline(userPublicKey: string, assetCode: string): Promise<string>;
    getIssuerPublicKey(): string;
    getDistributorPublicKey(): string;
}
