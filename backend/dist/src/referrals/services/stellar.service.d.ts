import { ConfigService } from '@nestjs/config';
import { StellarTransactionResult } from '../interfaces/stellar.interface';
export declare class StellarService {
    private configService;
    private readonly logger;
    private server;
    private rewardConfig;
    constructor(configService: ConfigService);
    distributeReward(recipientPublicKey: string, amount?: number): Promise<StellarTransactionResult>;
    validateStellarAccount(publicKey: string): Promise<boolean>;
}
