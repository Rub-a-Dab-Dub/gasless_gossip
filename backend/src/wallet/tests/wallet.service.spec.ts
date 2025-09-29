import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../services/wallet.service';
import { WalletBalance } from '../entities/wallet-balance.entity';

describe('WalletService', () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserWalletBalance', () => {
    it('should return cached balance when available', async () => {
      const cachedBalance = {
        userId: 'user-123',
        totalUsdValue: '1000.00',
        networks: {
          base: { totalUsdValue: '500.00', assets: [] },
          stellar: { totalUsdValue: '500.00', assets: [] },
        },
        assets: [],
        lastUpdated: new Date(),
        cacheHit: true,
        responseTime: 50,
      };

      mockCacheManager.get.mockResolvedValue(cachedBalance);

      const result = await service.getUserWalletBalance('user-123');

      expect(result).toEqual(cachedBalance);
      expect(mockCacheManager.get).toHaveBeenCalledWith('wallet:user-123:{}');
    });

    it('should fetch from database when cache miss', async () => {
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

      const result = await service.getUserWalletBalance('user-123');

      expect(result.userId).toBe('user-123');
      expect(result.totalUsdValue).toBe('2005.00');
      expect(result.networks.base.assets).toHaveLength(1);
      expect(result.networks.stellar.assets).toHaveLength(1);
      expect(result.cacheHit).toBe(false);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should handle network filtering', async () => {
      const options = {
        networks: ['base'],
        assets: ['ETH'],
      };

      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      await service.getUserWalletBalance('user-123', options);

      expect(mockWalletBalanceRepo.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('refreshUserBalances', () => {
    it('should refresh balances for specified networks', async () => {
      const dto = {
        networks: ['base', 'stellar'],
        assets: ['ETH', 'XLM', 'USDC'],
        forceRefresh: true,
      };

      // Mock the getUserWalletAddresses method
      jest.spyOn(service as any, 'getUserWalletAddresses').mockResolvedValue({
        base: '0x1234567890123456789012345678901234567890',
        stellar: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      });

      // Mock the fetch methods
      jest.spyOn(service as any, 'fetchBaseBalances').mockResolvedValue([]);
      jest.spyOn(service as any, 'fetchStellarBalances').mockResolvedValue([]);
      jest.spyOn(service as any, 'saveBalancesToDb').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'clearUserCache').mockResolvedValue(undefined);

      await service.refreshUserBalances('user-123', dto);

      expect(service['getUserWalletAddresses']).toHaveBeenCalledWith('user-123');
      expect(service['fetchBaseBalances']).toHaveBeenCalledWith('user-123', '0x1234567890123456789012345678901234567890', ['ETH', 'XLM', 'USDC']);
      expect(service['fetchStellarBalances']).toHaveBeenCalledWith('user-123', 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', ['ETH', 'XLM', 'USDC']);
    });

    it('should handle missing wallet addresses', async () => {
      jest.spyOn(service as any, 'getUserWalletAddresses').mockResolvedValue({});

      await expect(service.refreshUserBalances('user-123', {}))
        .rejects.toThrow('No wallet addresses found for user');
    });
  });

  describe('getWalletStats', () => {
    it('should return wallet statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        totalAssets: 500,
        baseStats: { users: 50, assets: 250, totalUsdValue: '100000.00' },
        stellarStats: { users: 50, assets: 250, totalUsdValue: '50000.00' },
        topAssets: [
          { asset: 'ETH', symbol: 'ETH', totalUsdValue: '100000.00', userCount: 80 },
          { asset: 'XLM', symbol: 'XLM', totalUsdValue: '50000.00', userCount: 60 },
        ],
      };

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

      const result = await service.getWalletStats();

      expect(result.totalUsers).toBe(100);
      expect(result.totalAssets).toBe(500);
      expect(result.networks.base.users).toBe(50);
      expect(result.networks.stellar.users).toBe(50);
      expect(result.topAssets).toHaveLength(2);
    });
  });

  describe('cache performance', () => {
    it('should track cache statistics', async () => {
      // First request (cache miss)
      mockCacheManager.get.mockResolvedValue(null);
      mockWalletBalanceRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      await service.getUserWalletBalance('user-123');
      expect(service['cacheStats'].cacheMisses).toBe(1);
      expect(service['cacheStats'].totalRequests).toBe(1);

      // Second request (cache hit)
      const cachedBalance = {
        userId: 'user-123',
        totalUsdValue: '1000.00',
        networks: { base: { totalUsdValue: '500.00', assets: [] }, stellar: { totalUsdValue: '500.00', assets: [] } },
        assets: [],
        lastUpdated: new Date(),
        cacheHit: true,
        responseTime: 50,
      };
      mockCacheManager.get.mockResolvedValue(cachedBalance);

      await service.getUserWalletBalance('user-123');
      expect(service['cacheStats'].cacheHits).toBe(1);
      expect(service['cacheStats'].totalRequests).toBe(2);
    });
  });
});
