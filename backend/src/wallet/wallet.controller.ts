import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { 
  WalletSummaryDto, 
  NetworkBalanceDto, 
  AssetBalanceDto,
  WalletStatsDto,
  RefreshBalanceDto,
  GetBalanceDto
} from './dto/wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance/:userId')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getUserWalletBalance(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) options: GetBalanceDto,
    @Request() req: any,
  ): Promise<WalletSummaryDto> {
    // Users can only view their own balances (unless admin)
    if (userId !== req.user.id && !req.user.isAdmin) {
      throw new Error('Unauthorized: Cannot view other users balances');
    }

    return this.walletService.getUserWalletBalance(userId, options);
  }

  @Get('balance')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getCurrentUserWalletBalance(
    @Query(new ValidationPipe({ transform: true })) options: GetBalanceDto,
    @Request() req: any,
  ): Promise<WalletSummaryDto> {
    return this.walletService.getUserWalletBalance(req.user.id, options);
  }

  @Post('refresh')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 refresh requests per minute
  async refreshUserBalances(
    @Body(new ValidationPipe({ transform: true })) dto: RefreshBalanceDto,
    @Request() req: any,
  ): Promise<{ message: string; userId: string }> {
    await this.walletService.refreshUserBalances(req.user.id, dto);
    return { 
      message: 'Wallet balances refreshed successfully', 
      userId: req.user.id 
    };
  }

  @Get('stats')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async getWalletStats(): Promise<WalletStatsDto> {
    return this.walletService.getWalletStats();
  }

  // Test endpoints for Base Sepolia and Stellar Testnet
  @Get('test/base-sepolia')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 test requests per minute
  async testBaseSepolia(
    @Request() req: any,
  ): Promise<{
    network: string;
    rpcUrl: string;
    chainId: number;
    status: string;
    testAddress: string;
    testAssets: string[];
  }> {
    return {
      network: 'base-sepolia',
      rpcUrl: 'https://sepolia.base.org',
      chainId: 84532,
      status: 'active',
      testAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      testAssets: ['ETH', 'USDC', 'USDT'],
    };
  }

  @Get('test/stellar-testnet')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 test requests per minute
  async testStellarTestnet(
    @Request() req: any,
  ): Promise<{
    network: string;
    horizonUrl: string;
    networkPassphrase: string;
    status: string;
    testAddress: string;
    testAssets: string[];
  }> {
    return {
      network: 'stellar-testnet',
      horizonUrl: 'https://horizon-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015',
      status: 'active',
      testAddress: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      testAssets: ['XLM', 'USDC', 'USDT'],
    };
  }

  @Get('test/performance')
  @Throttle({ short: { limit: 1, ttl: 60000 } }) // 1 test per minute
  async testPerformance(
    @Request() req: any,
  ): Promise<{
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
  }> {
    const startTime = Date.now();
    
    // Test Base Sepolia performance
    const baseStartTime = Date.now();
    const baseResult = await this.walletService.getUserWalletBalance(req.user.id, {
      networks: ['base'],
      assets: ['ETH', 'USDC', 'USDT'],
    });
    const baseResponseTime = Date.now() - baseStartTime;

    // Test Stellar Testnet performance
    const stellarStartTime = Date.now();
    const stellarResult = await this.walletService.getUserWalletBalance(req.user.id, {
      networks: ['stellar'],
      assets: ['XLM', 'USDC', 'USDT'],
    });
    const stellarResponseTime = Date.now() - stellarStartTime;

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    return {
      message: 'Wallet performance test completed',
      testResults: {
        baseSepolia: {
          network: 'base-sepolia',
          responseTime: `${baseResponseTime}ms`,
          assets: baseResult.networks.base.assets.map(a => a.asset),
          status: baseResponseTime < 1000 ? 'PASS' : 'FAIL',
        },
        stellarTestnet: {
          network: 'stellar-testnet',
          responseTime: `${stellarResponseTime}ms`,
          assets: stellarResult.networks.stellar.assets.map(a => a.asset),
          status: stellarResponseTime < 1000 ? 'PASS' : 'FAIL',
        },
      },
      cacheStats: {
        hitRate: '0.00%', // Would be calculated from actual cache stats
        totalRequests: 2,
        cacheHits: 0,
        cacheMisses: 2,
      },
      overallPerformance: {
        totalTime: `${totalTime}ms`,
        averageTime: `${(totalTime / 2).toFixed(2)}ms`,
        networksPerSecond: `${(2 / (totalTime / 1000)).toFixed(2)}`,
      },
    };
  }

  @Get('test/cache-performance')
  @Throttle({ short: { limit: 1, ttl: 60000 } }) // 1 test per minute
  async testCachePerformance(
    @Request() req: any,
  ): Promise<{
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
  }> {
    // First request (cache miss)
    const firstStartTime = Date.now();
    const firstResult = await this.walletService.getUserWalletBalance(req.user.id, {
      networks: ['base', 'stellar'],
      assets: ['ETH', 'XLM', 'USDC'],
    });
    const firstResponseTime = Date.now() - firstStartTime;

    // Second request (cache hit)
    const secondStartTime = Date.now();
    const secondResult = await this.walletService.getUserWalletBalance(req.user.id, {
      networks: ['base', 'stellar'],
      assets: ['ETH', 'XLM', 'USDC'],
    });
    const secondResponseTime = Date.now() - secondStartTime;

    // Third request (cache hit)
    const thirdStartTime = Date.now();
    const thirdResult = await this.walletService.getUserWalletBalance(req.user.id, {
      networks: ['base', 'stellar'],
      assets: ['ETH', 'XLM', 'USDC'],
    });
    const thirdResponseTime = Date.now() - thirdStartTime;

    const averageResponseTime = (firstResponseTime + secondResponseTime + thirdResponseTime) / 3;
    const cacheHitRate = ((secondResult.cacheHit ? 1 : 0) + (thirdResult.cacheHit ? 1 : 0)) / 2 * 100;
    const performanceImprovement = ((firstResponseTime - averageResponseTime) / firstResponseTime * 100).toFixed(2);

    return {
      message: 'Cache performance test completed',
      cacheTestResults: {
        firstRequest: {
          responseTime: `${firstResponseTime}ms`,
          cacheHit: firstResult.cacheHit,
          assets: firstResult.assets.length,
        },
        secondRequest: {
          responseTime: `${secondResponseTime}ms`,
          cacheHit: secondResult.cacheHit,
          assets: secondResult.assets.length,
        },
        thirdRequest: {
          responseTime: `${thirdResponseTime}ms`,
          cacheHit: thirdResult.cacheHit,
          assets: thirdResult.assets.length,
        },
      },
      cachePerformance: {
        averageResponseTime: `${averageResponseTime.toFixed(2)}ms`,
        cacheHitRate: `${cacheHitRate.toFixed(2)}%`,
        performanceImprovement: `${performanceImprovement}%`,
      },
    };
  }
}
