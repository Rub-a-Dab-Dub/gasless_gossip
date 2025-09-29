import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../services/wallet.service';
import { WalletBalance } from '../entities/wallet-balance.entity';

describe('WalletService Performance Tests', () => {
  let service: WalletService;
  let mockWalletBalanceRepo: any;
  let mockCacheManager: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockWalletBalanceRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config = {
          BASE_RPC_URL: 'https://sepolia.base.org',
          STELLAR_NETWORK: 'testnet',
          REDIS_HOST: 'localhost',
          REDIS_PORT: 6379,
        };
        return config[key] || defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(WalletBalance),
          useValue: mockWalletBalanceRepo,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  describe('Performance with <1s response time', () => {
    it('should return balances in under 1 second', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          decimals: 18,
          assetType: 'native',
          walletAddress: '0x1234...',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'balance-2',
          userId: 'user-123',
          network: 'stellar',
          asset: 'XLM',
          balance: '10000000',
          formattedBalance: '10.0',
          symbol: 'XLM',
          decimals: 7,
          assetType: 'native',
          walletAddress: 'G1234...',
          usdValue: '5.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const startTime = Date.now();
      const result = await service.getUserWalletBalance('user-123');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(result.userId).toBe('user-123');
      expect(responseTime).toBeLessThan(1000); // Should be under 1 second
      expect(result.totalUsdValue).toBe('2005.00');
      expect(result.networks.base.assets).toHaveLength(1);
      expect(result.networks.stellar.assets).toHaveLength(1);

      console.log(`Wallet Balance Performance:
        Response Time: ${responseTime}ms
        User ID: ${result.userId}
        Total USD Value: ${result.totalUsdValue}
        Base Assets: ${result.networks.base.assets.length}
        Stellar Assets: ${result.networks.stellar.assets.length}`);
    });

    it('should handle cached responses efficiently', async () => {
      const cachedBalance = {
        userId: 'user-123',
        totalUsdValue: '2005.00',
        networks: {
          base: { 
            totalUsdValue: '2000.00', 
            assets: [{ asset: 'ETH', symbol: 'ETH', balance: '1.0' }] 
          },
          stellar: { 
            totalUsdValue: '5.00', 
            assets: [{ asset: 'XLM', symbol: 'XLM', balance: '10.0' }] 
          },
        },
        assets: [],
        lastUpdated: new Date(),
        cacheHit: true,
        responseTime: 50,
      };

      mockCacheManager.get.mockResolvedValue(cachedBalance);

      const startTime = Date.now();
      const result = await service.getUserWalletBalance('user-123');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(result.cacheHit).toBe(true);
      expect(responseTime).toBeLessThan(100); // Should be under 100ms for cached responses
      expect(result.totalUsdValue).toBe('2005.00');

      console.log(`Cached Response Performance:
        Response Time: ${responseTime}ms
        Cache Hit: ${result.cacheHit}
        Total USD Value: ${result.totalUsdValue}
        Performance Improvement: ${((1000 - responseTime) / 1000 * 100).toFixed(2)}%`);
    });

    it('should handle concurrent balance requests efficiently', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const startTime = Date.now();
      
      // Make 10 concurrent requests
      const promises = Array.from({ length: 10 }, (_, i) =>
        service.getUserWalletBalance(`user-${i}`)
      );
      
      const results = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(results).toHaveLength(10);
      expect(totalTime).toBeLessThan(2000); // Should complete in under 2 seconds
      expect(totalTime / 10).toBeLessThan(200); // Average < 200ms per request

      console.log(`Concurrent Requests Performance:
        Total Requests: 10
        Total Time: ${totalTime}ms
        Average Time per Request: ${(totalTime / 10).toFixed(2)}ms
        Requests per Second: ${(10 / (totalTime / 1000)).toFixed(2)}`);
    });

    it('should handle sustained load efficiently', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const latencies: number[] = [];
      const iterations = 50; // 50 balance requests

      // Process 50 balance requests and measure latency
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        await service.getUserWalletBalance(`user-${i}`);
        
        const endTime = Date.now();
        latencies.push(endTime - startTime);
      }

      // Calculate statistics
      const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      const maxLatency = Math.max(...latencies);
      const minLatency = Math.min(...latencies);

      // Performance assertions
      expect(averageLatency).toBeLessThan(1000); // Average < 1 second
      expect(maxLatency).toBeLessThan(2000); // Max < 2 seconds
      expect(minLatency).toBeLessThan(500); // Min < 500ms

      console.log(`Sustained Load Performance:
        Average Latency: ${averageLatency.toFixed(2)}ms
        Max Latency: ${maxLatency}ms
        Min Latency: ${minLatency}ms
        Total Operations: ${iterations}`);
    });
  });

  describe('Cache performance with >80% hit rate', () => {
    it('should achieve high cache hit rate', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // First request (cache miss)
      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      await service.getUserWalletBalance('user-123');
      expect(service['cacheStats'].cacheMisses).toBe(1);
      expect(service['cacheStats'].totalRequests).toBe(1);

      // Subsequent requests (cache hits)
      const cachedBalance = {
        userId: 'user-123',
        totalUsdValue: '2000.00',
        networks: { base: { totalUsdValue: '2000.00', assets: [] }, stellar: { totalUsdValue: '0.00', assets: [] } },
        assets: [],
        lastUpdated: new Date(),
        cacheHit: true,
        responseTime: 50,
      };

      mockCacheManager.get.mockResolvedValue(cachedBalance);

      // Make 9 more requests (should all be cache hits)
      for (let i = 0; i < 9; i++) {
        await service.getUserWalletBalance('user-123');
      }

      const hitRate = (service['cacheStats'].cacheHits / service['cacheStats'].totalRequests) * 100;
      expect(hitRate).toBeGreaterThan(80); // Should achieve >80% hit rate

      console.log(`Cache Hit Rate Performance:
        Total Requests: ${service['cacheStats'].totalRequests}
        Cache Hits: ${service['cacheStats'].cacheHits}
        Cache Misses: ${service['cacheStats'].cacheMisses}
        Hit Rate: ${hitRate.toFixed(2)}%`);
    });

    it('should handle cache expiration efficiently', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Simulate cache expiration by returning null
      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const startTime = Date.now();
      const result = await service.getUserWalletBalance('user-123');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(result.cacheHit).toBe(false);
      expect(responseTime).toBeLessThan(1000); // Should still be under 1 second
      expect(mockCacheManager.set).toHaveBeenCalled(); // Should cache the result

      console.log(`Cache Expiration Performance:
        Response Time: ${responseTime}ms
        Cache Hit: ${result.cacheHit}
        Cache Set: ${mockCacheManager.set.mock.calls.length > 0}`);
    });
  });

  describe('Network-specific performance', () => {
    it('should handle Base Sepolia requests efficiently', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'balance-2',
          userId: 'user-123',
          network: 'base',
          asset: 'USDC',
          balance: '1000000',
          formattedBalance: '1.0',
          symbol: 'USDC',
          usdValue: '1.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const startTime = Date.now();
      const result = await service.getUserWalletBalance('user-123', {
        networks: ['base'],
        assets: ['ETH', 'USDC'],
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(result.networks.base.assets).toHaveLength(2);
      expect(result.networks.base.assets[0].asset).toBe('ETH');
      expect(result.networks.base.assets[1].asset).toBe('USDC');
      expect(responseTime).toBeLessThan(1000); // Should be under 1 second

      console.log(`Base Sepolia Performance:
        Response Time: ${responseTime}ms
        Network: ${result.networks.base.assets[0].network}
        Assets: ${result.networks.base.assets.length}
        ETH Balance: ${result.networks.base.assets[0].formattedBalance}
        USDC Balance: ${result.networks.base.assets[1].formattedBalance}`);
    });

    it('should handle Stellar Testnet requests efficiently', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'stellar',
          asset: 'XLM',
          balance: '10000000',
          formattedBalance: '10.0',
          symbol: 'XLM',
          usdValue: '5.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'balance-2',
          userId: 'user-123',
          network: 'stellar',
          asset: 'USDC',
          balance: '1000000',
          formattedBalance: '1.0',
          symbol: 'USDC',
          usdValue: '1.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const startTime = Date.now();
      const result = await service.getUserWalletBalance('user-123', {
        networks: ['stellar'],
        assets: ['XLM', 'USDC'],
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(result.networks.stellar.assets).toHaveLength(2);
      expect(result.networks.stellar.assets[0].asset).toBe('XLM');
      expect(result.networks.stellar.assets[1].asset).toBe('USDC');
      expect(responseTime).toBeLessThan(1000); // Should be under 1 second

      console.log(`Stellar Testnet Performance:
        Response Time: ${responseTime}ms
        Network: ${result.networks.stellar.assets[0].network}
        Assets: ${result.networks.stellar.assets.length}
        XLM Balance: ${result.networks.stellar.assets[0].formattedBalance}
        USDC Balance: ${result.networks.stellar.assets[1].formattedBalance}`);
    });

    it('should handle multi-network requests efficiently', async () => {
      const mockBalances = [
        {
          id: 'balance-1',
          userId: 'user-123',
          network: 'base',
          asset: 'ETH',
          balance: '1000000000000000000',
          formattedBalance: '1.0',
          symbol: 'ETH',
          usdValue: '2000.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'balance-2',
          userId: 'user-123',
          network: 'stellar',
          asset: 'XLM',
          balance: '10000000',
          formattedBalance: '10.0',
          symbol: 'XLM',
          usdValue: '5.00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockBalances),
      });

      const startTime = Date.now();
      const result = await service.getUserWalletBalance('user-123', {
        networks: ['base', 'stellar'],
        assets: ['ETH', 'XLM'],
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(result.networks.base.assets).toHaveLength(1);
      expect(result.networks.stellar.assets).toHaveLength(1);
      expect(result.totalUsdValue).toBe('2005.00');
      expect(responseTime).toBeLessThan(1000); // Should be under 1 second

      console.log(`Multi-Network Performance:
        Response Time: ${responseTime}ms
        Total USD Value: ${result.totalUsdValue}
        Base Assets: ${result.networks.base.assets.length}
        Stellar Assets: ${result.networks.stellar.assets.length}
        ETH Balance: ${result.networks.base.assets[0].formattedBalance}
        XLM Balance: ${result.networks.stellar.assets[0].formattedBalance}`);
    });
  });

  describe('Database query performance', () => {
    it('should fetch wallet statistics efficiently', async () => {
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ count: '100' }),
        getRawMany: jest.fn().mockResolvedValue([
          { asset: 'ETH', symbol: 'ETH', userCount: '80' },
          { asset: 'XLM', symbol: 'XLM', userCount: '60' },
        ]),
      });

      mockWalletBalanceRepo.count
        .mockResolvedValueOnce(500) // total assets
        .mockResolvedValueOnce(250) // base assets
        .mockResolvedValueOnce(250); // stellar assets

      const startTime = Date.now();
      const result = await service.getWalletStats();
      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(result.totalUsers).toBe(100);
      expect(result.totalAssets).toBe(500);
      expect(result.networks.base.users).toBe(50);
      expect(result.networks.stellar.users).toBe(50);
      expect(queryTime).toBeLessThan(500); // Should be under 500ms

      console.log(`Wallet Statistics Query Performance:
        Query Time: ${queryTime}ms
        Total Users: ${result.totalUsers}
        Total Assets: ${result.totalAssets}
        Base Users: ${result.networks.base.users}
        Stellar Users: ${result.networks.stellar.users}`);
    });
  });
});
