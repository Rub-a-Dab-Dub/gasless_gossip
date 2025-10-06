import { ConfigService } from '@nestjs/config';
export declare class StellarVotingService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    getAccountBalance(accountId: string): Promise<number>;
    recordVoteOnStellar(accountId: string, proposalId: string, choice: string, weight: number): Promise<string>;
    validateStellarTransaction(transactionHash: string): Promise<boolean>;
}
