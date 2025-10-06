import { ConfigService } from '@nestjs/config';
export declare class StellarService {
    private configService;
    private readonly logger;
    private server;
    private networkPassphrase;
    constructor(configService: ConfigService);
    validateTransaction(transactionId: string): Promise<boolean>;
    getAccountDetails(accountId: string): Promise<any>;
    getTransactionDetails(transactionId: string): Promise<any>;
    getNetworkPassphrase(): string;
}
