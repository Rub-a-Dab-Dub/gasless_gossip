import { ConfigService } from '@nestjs/config';
import { StellarTransferRequest, StellarTransaction } from '../interfaces/stellar.interface';
export declare class StellarService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    transferTokens(transferRequest: StellarTransferRequest): Promise<StellarTransaction>;
    private generateMockTxHash;
    getTransactionStatus(txId: string): Promise<boolean>;
}
