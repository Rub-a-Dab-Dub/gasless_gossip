"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const wallet_service_1 = require("../services/wallet.service");
const wallet_balance_entity_1 = require("../entities/wallet-balance.entity");
describe('WalletService Performance Tests', () => {
    let service;
    let mockWalletBalanceRepo;
    let mockCacheManager;
    let mockConfigService;
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
            get: jest.fn((key, defaultValue) => {
                const config = {
                    BASE_RPC_URL: 'https://sepolia.base.org',
                    STELLAR_NETWORK: 'testnet',
                    REDIS_HOST: 'localhost',
                    REDIS_PORT: 6379,
                };
                return config[key] || defaultValue;
            }),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                wallet_service_1.WalletService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(wallet_balance_entity_1.WalletBalance),
                    useValue: mockWalletBalanceRepo,
                },
                {
                    provide: cache_manager_1.CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(wallet_service_1.WalletService);
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
            expect(responseTime).toBeLessThan(1000);
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
            expect(responseTime).toBeLessThan(100);
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
            const promises = Array.from({ length: 10 }, (_, i) => service.getUserWalletBalance(`user-${i}`));
            const results = await Promise.all(promises);
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            expect(results).toHaveLength(10);
            expect(totalTime).toBeLessThan(2000);
            expect(totalTime / 10).toBeLessThan(200);
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
            const latencies = [];
            const iterations = 50;
            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                await service.getUserWalletBalance(`user-${i}`);
                const endTime = Date.now();
                latencies.push(endTime - startTime);
            }
            const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
            const maxLatency = Math.max(...latencies);
            const minLatency = Math.min(...latencies);
            expect(averageLatency).toBeLessThan(1000);
            expect(maxLatency).toBeLessThan(2000);
            expect(minLatency).toBeLessThan(500);
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
            for (let i = 0; i < 9; i++) {
                await service.getUserWalletBalance('user-123');
            }
            const hitRate = (service['cacheStats'].cacheHits / service['cacheStats'].totalRequests) * 100;
            expect(hitRate).toBeGreaterThan(80);
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
            expect(responseTime).toBeLessThan(1000);
            expect(mockCacheManager.set).toHaveBeenCalled();
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
            expect(responseTime).toBeLessThan(1000);
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
            expect(responseTime).toBeLessThan(1000);
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
            expect(responseTime).toBeLessThan(1000);
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
                .mockResolvedValueOnce(500)
                .mockResolvedValueOnce(250)
                .mockResolvedValueOnce(250);
            const startTime = Date.now();
            const result = await service.getWalletStats();
            const endTime = Date.now();
            const queryTime = endTime - startTime;
            expect(result.totalUsers).toBe(100);
            expect(result.totalAssets).toBe(500);
            expect(result.networks.base.users).toBe(50);
            expect(result.networks.stellar.users).toBe(50);
            expect(queryTime).toBeLessThan(500);
            console.log(`Wallet Statistics Query Performance:
        Query Time: ${queryTime}ms
        Total Users: ${result.totalUsers}
        Total Assets: ${result.totalAssets}
        Base Users: ${result.networks.base.users}
        Stellar Users: ${result.networks.stellar.users}`);
        });
    });
});
//# sourceMappingURL=performance.test.js.map