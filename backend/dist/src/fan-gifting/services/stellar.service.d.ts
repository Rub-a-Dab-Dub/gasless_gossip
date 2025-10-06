import { ConfigService } from '@nestjs/config';
import { StellarTransferResult, StellarAccount } from '../interfaces/stellar.interface';
export declare class StellarService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    transferTokens(fromAccount: StellarAccount, toPublicKey: string, amount: string, assetCode?: string, memo?: string): Promise<StellarTransferResult>;
    getAccountBalance(publicKey: string, assetCode?: string): Promise<string>;
    validatePublicKey(publicKey: string): boolean;
}
