import { WalletService } from './services/wallet.service';
import { WalletSummaryDto, WalletStatsDto, RefreshBalanceDto, GetBalanceDto } from './dto/wallet.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getUserWalletBalance(userId: string, options: GetBalanceDto, req: any): Promise<WalletSummaryDto>;
    getCurrentUserWalletBalance(options: GetBalanceDto, req: any): Promise<WalletSummaryDto>;
    refreshUserBalances(dto: RefreshBalanceDto, req: any): Promise<{
        message: string;
        userId: string;
    }>;
    getWalletStats(): Promise<WalletStatsDto>;
    testBaseSepolia(req: any): Promise<{
        network: string;
        rpcUrl: string;
        chainId: number;
        status: string;
        testAddress: string;
        testAssets: string[];
    }>;
    testStellarTestnet(req: any): Promise<{
        network: string;
        horizonUrl: string;
        networkPassphrase: string;
        status: string;
        testAddress: string;
        testAssets: string[];
    }>;
    testPerformance(req: any): Promise<{
        message: string;
        testResults: {
            baseSepolia: {
                network: string;
                responseTime: string;
                assets: string[];
                status: string;
            };
            stellarTestnet: {
                network: string;
                responseTime: string;
                assets: string[];
                status: string;
            };
        };
        cacheStats: {
            hitRate: string;
            totalRequests: number;
            cacheHits: number;
            cacheMisses: number;
        };
        overallPerformance: {
            totalTime: string;
            averageTime: string;
            networksPerSecond: string;
        };
    }>;
    testCachePerformance(req: any): Promise<{
        message: string;
        cacheTestResults: {
            firstRequest: {
                responseTime: string;
                cacheHit: boolean;
                assets: number;
            };
            secondRequest: {
                responseTime: string;
                cacheHit: boolean;
                assets: number;
            };
            thirdRequest: {
                responseTime: string;
                cacheHit: boolean;
                assets: number;
            };
        };
        cachePerformance: {
            averageResponseTime: string;
            cacheHitRate: string;
            performanceImprovement: string;
        };
    }>;
}
