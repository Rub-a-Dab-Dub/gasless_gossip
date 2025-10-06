import { TokenGiftService } from './services/token-gift.service';
import { CreateTokenGiftDto, TokenGiftResponseDto, GasEstimateDto, PaymasterStatusDto } from './dto/token-gift.dto';
export declare class TokenGiftController {
    private readonly tokenGiftService;
    constructor(tokenGiftService: TokenGiftService);
    createTokenGift(dto: CreateTokenGiftDto, req: any): Promise<TokenGiftResponseDto>;
    getTokenGift(giftId: string): Promise<TokenGiftResponseDto>;
    getUserTokenGifts(userId: string, limit?: number, req: any): Promise<import("./dto/token-gift.dto").TokenGiftDto[]>;
    getTokenGiftTransactions(giftId: string): Promise<import("./dto/token-gift.dto").TokenGiftTransactionDto[]>;
    estimateGas(dto: CreateTokenGiftDto): Promise<GasEstimateDto>;
    getPaymasterStatus(network: string): Promise<PaymasterStatusDto>;
    getPerformanceMetrics(): Promise<{
        totalGifts: number;
        completedGifts: number;
        averageProcessingTime: number;
        successRate: number;
    }>;
    testStellarTestnet(dto: CreateTokenGiftDto, req: any): Promise<TokenGiftResponseDto>;
    testBaseSepolia(dto: CreateTokenGiftDto, req: any): Promise<TokenGiftResponseDto>;
    getStellarTestnetStatus(): Promise<{
        network: string;
        horizonUrl: string;
        networkPassphrase: string;
        status: string;
    }>;
    getBaseSepoliaStatus(): Promise<{
        network: string;
        rpcUrl: string;
        chainId: number;
        status: string;
    }>;
    simulateTransaction(dto: CreateTokenGiftDto): Promise<{
        simulated: boolean;
        estimatedGas: GasEstimateDto;
        paymasterStatus: PaymasterStatusDto;
        processingTime: string;
    }>;
}
