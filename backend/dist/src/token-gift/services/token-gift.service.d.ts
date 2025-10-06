import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TokenGift } from '../entities/token-gift.entity';
import { TokenGiftTransaction } from '../entities/token-gift-transaction.entity';
import { CreateTokenGiftDto, TokenGiftDto, TokenGiftTransactionDto, TokenGiftResponseDto, GasEstimateDto, PaymasterStatusDto } from '../dto/token-gift.dto';
export declare class TokenGiftService {
    private readonly tokenGiftRepo;
    private readonly transactionRepo;
    private readonly configService;
    private readonly logger;
    private stellarServer;
    private stellarNetwork;
    constructor(tokenGiftRepo: Repository<TokenGift>, transactionRepo: Repository<TokenGiftTransaction>, configService: ConfigService);
    createTokenGift(dto: CreateTokenGiftDto, senderId: string): Promise<TokenGiftResponseDto>;
    private processTokenGift;
    private processStellarTransaction;
    private processBasePaymasterTransaction;
    private createStellarTransaction;
    private estimateGasCosts;
    private checkPaymasterStatus;
    getTokenGift(giftId: string): Promise<TokenGiftResponseDto>;
    getUserTokenGifts(userId: string, limit?: number): Promise<TokenGiftDto[]>;
    getTokenGiftTransactions(giftId: string): Promise<TokenGiftTransactionDto[]>;
    getGasEstimate(dto: CreateTokenGiftDto): Promise<GasEstimateDto>;
    getPaymasterStatus(network: string): Promise<PaymasterStatusDto>;
    getPerformanceMetrics(): Promise<{
        totalGifts: number;
        completedGifts: number;
        averageProcessingTime: number;
        successRate: number;
    }>;
    private mapGiftToDto;
    private mapTransactionToDto;
}
