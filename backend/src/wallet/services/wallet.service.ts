import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as StellarSdk from 'stellar-sdk';
import { WalletBalance } from '../entities/wallet-balance.entity';
import { 
  WalletBalanceDto, 
  WalletSummaryDto, 
  NetworkBalanceDto, 
  AssetBalanceDto,
  PriceDataDto,
  WalletStatsDto,
  RefreshBalanceDto,
  GetBalanceDto
} from '../dto/wallet.dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private baseProvider: ethers.JsonRpcProvider;
  private stellarServer: StellarSdk.Horizon.Server;
  private cacheStats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  constructor(
    @InjectRepository(WalletBalance)
    private readonly walletBalanceRepo: Repository<WalletBalance>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    // Initialize Base provider
    const baseRpcUrl = this.configService.get('BASE_RPC_URL', 'https://sepolia.base.org');
    this.baseProvider = new ethers.JsonRpcProvider(baseRpcUrl);

    // Initialize Stellar server
    const stellarNetwork = this.configService.get('STELLAR_NETWORK', 'testnet');
    this.stellarServer = new StellarSdk.Horizon.Server(
      stellarNetwork === 'mainnet' 
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org'
    );
  }

  async getUserWalletBalance(userId: string, options: GetBalanceDto = {}): Promise<WalletSummaryDto> {
    const startTime = Date.now();
    this.cacheStats.totalRequests++;

    try {
      // Check cache first
      const cacheKey = `wallet:${userId}:${JSON.stringify(options)}`;
      const cached = await this.cacheManager.get<WalletSummaryDto>(cacheKey);
      
      if (cached) {
        this.cacheStats.cacheHits++;
        cached.cacheHit = true;
        cached.responseTime = Date.now() - startTime;
        this.logger.log(`Cache hit for user ${userId} (${cached.responseTime}ms)`);
        return cached;
      }

      this.cacheStats.cacheMisses++;
      
      // Fetch balances from database
      const balances = await this.getUserBalancesFromDb(userId, options);
      
      // If no cached data, fetch fresh from networks
      if (balances.length === 0) {
        await this.refreshUserBalances(userId, options);
        const freshBalances = await this.getUserBalancesFromDb(userId, options);
        return this.buildWalletSummary(userId, freshBalances, startTime);
      }

      const summary = this.buildWalletSummary(userId, balances, startTime);
      
      // Cache the result for 60 seconds
      await this.cacheManager.set(cacheKey, summary, 60000);
      
      return summary;
    } catch (error) {
      this.logger.error(`Failed to get wallet balance for user ${userId}:`, error);
      throw new BadRequestException('Failed to fetch wallet balance');
    }
  }

  async refreshUserBalances(userId: string, options: RefreshBalanceDto = {}): Promise<void> {
    try {
      const networks = options.networks || ['base', 'stellar'];
      const assets = options.assets || ['ETH', 'XLM', 'USDC', 'USDT'];
      
      // Get user's wallet addresses
      const walletAddresses = await this.getUserWalletAddresses(userId);
      
      if (!walletAddresses.base && !walletAddresses.stellar) {
        throw new NotFoundException('No wallet addresses found for user');
      }

      // Fetch balances from each network
      const balancePromises = [];

      if (networks.includes('base') && walletAddresses.base) {
        balancePromises.push(this.fetchBaseBalances(userId, walletAddresses.base, assets));
      }

      if (networks.includes('stellar') && walletAddresses.stellar) {
        balancePromises.push(this.fetchStellarBalances(userId, walletAddresses.stellar, assets));
      }

      const results = await Promise.all(balancePromises);
      const allBalances = results.flat();

      // Save balances to database
      await this.saveBalancesToDb(allBalances);

      // Clear cache for this user
      await this.clearUserCache(userId);

      this.logger.log(`Refreshed balances for user ${userId}: ${allBalances.length} assets`);
    } catch (error) {
      this.logger.error(`Failed to refresh balances for user ${userId}:`, error);
      throw error;
    }
  }

  private async fetchBaseBalances(userId: string, walletAddress: string, assets: string[]): Promise<WalletBalance[]> {
    const balances: WalletBalance[] = [];
    
    try {
      // Fetch ETH balance
      if (assets.includes('ETH')) {
        const ethBalance = await this.baseProvider.getBalance(walletAddress);
        const ethBalanceFormatted = ethers.formatEther(ethBalance);
        
        const ethBalanceRecord = this.walletBalanceRepo.create({
          userId,
          network: 'base',
          asset: 'ETH',
          balance: ethBalance.toString(),
          formattedBalance: ethBalanceFormatted,
          symbol: 'ETH',
          decimals: 18,
          assetType: 'native',
          walletAddress,
          lastFetchedAt: new Date(),
        });

        balances.push(ethBalanceRecord);
      }

      // Fetch ERC-20 token balances
      const erc20Tokens = assets.filter(asset => asset !== 'ETH');
      for (const token of erc20Tokens) {
        try {
          const tokenBalance = await this.fetchERC20Balance(walletAddress, token);
          if (tokenBalance && tokenBalance !== '0') {
            const tokenBalanceRecord = this.walletBalanceRepo.create({
              userId,
              network: 'base',
              asset: token,
              contractAddress: this.getTokenContractAddress(token),
              balance: tokenBalance,
              formattedBalance: this.formatTokenBalance(tokenBalance, token),
              symbol: token,
              decimals: this.getTokenDecimals(token),
              assetType: 'token',
              walletAddress,
              lastFetchedAt: new Date(),
            });

            balances.push(tokenBalanceRecord);
          }
        } catch (error) {
          this.logger.warn(`Failed to fetch ${token} balance:`, error);
        }
      }

      return balances;
    } catch (error) {
      this.logger.error(`Failed to fetch Base balances for user ${userId}:`, error);
      return [];
    }
  }

  private async fetchStellarBalances(userId: string, walletAddress: string, assets: string[]): Promise<WalletBalance[]> {
    const balances: WalletBalance[] = [];
    
    try {
      // Fetch account from Stellar
      const account = await this.stellarServer.loadAccount(walletAddress);
      
      // Process each balance
      for (const balance of account.balances) {
        const assetCode = balance.asset_type === 'native' ? 'XLM' : balance.asset_code;
        
        if (assets.includes(assetCode)) {
          const balanceRecord = this.walletBalanceRepo.create({
            userId,
            network: 'stellar',
            asset: assetCode,
            balance: balance.balance,
            formattedBalance: balance.balance,
            symbol: assetCode,
            decimals: assetCode === 'XLM' ? 7 : 7, // XLM has 7 decimals
            assetType: balance.asset_type === 'native' ? 'native' : 'token',
            contractAddress: balance.asset_type !== 'native' ? balance.asset_issuer : undefined,
            walletAddress,
            lastFetchedAt: new Date(),
          });

          balances.push(balanceRecord);
        }
      }

      return balances;
    } catch (error) {
      this.logger.error(`Failed to fetch Stellar balances for user ${userId}:`, error);
      return [];
    }
  }

  private async fetchERC20Balance(walletAddress: string, tokenSymbol: string): Promise<string> {
    const contractAddress = this.getTokenContractAddress(tokenSymbol);
    if (!contractAddress) {
      throw new Error(`Contract address not found for ${tokenSymbol}`);
    }

    const contract = new ethers.Contract(
      contractAddress,
      [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ],
      this.baseProvider
    );

    const balance = await contract.balanceOf(walletAddress);
    return balance.toString();
  }

  private async getUserWalletAddresses(userId: string): Promise<{ base?: string; stellar?: string }> {
    // This would typically fetch from a user profiles table
    // For now, we'll return mock addresses for testing
    return {
      base: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Mock Base address
      stellar: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', // Mock Stellar address
    };
  }

  private async getUserBalancesFromDb(userId: string, options: GetBalanceDto): Promise<WalletBalance[]> {
    const query = this.walletBalanceRepo
      .createQueryBuilder('balance')
      .where('balance.userId = :userId', { userId })
      .andWhere('balance.lastFetchedAt > :cutoff', { 
        cutoff: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      });

    if (options.networks && options.networks.length > 0) {
      query.andWhere('balance.network IN (:...networks)', { networks: options.networks });
    }

    if (options.assets && options.assets.length > 0) {
      query.andWhere('balance.asset IN (:...assets)', { assets: options.assets });
    }

    return query.orderBy('balance.createdAt', 'DESC').getMany();
  }

  private async saveBalancesToDb(balances: WalletBalance[]): Promise<void> {
    if (balances.length === 0) return;

    // Delete existing balances for the same user and networks
    const userId = balances[0].userId;
    const networks = [...new Set(balances.map(b => b.network))];
    
    await this.walletBalanceRepo
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere('network IN (:...networks)', { networks })
      .execute();

    // Insert new balances
    await this.walletBalanceRepo.save(balances);
  }

  private async clearUserCache(userId: string): Promise<void> {
    const pattern = `wallet:${userId}:*`;
    // Note: Redis pattern deletion would need to be implemented based on your Redis setup
    this.logger.log(`Cleared cache for user ${userId}`);
  }

  private buildWalletSummary(userId: string, balances: WalletBalance[], startTime: number): WalletSummaryDto {
    const networks = {
      base: { totalUsdValue: '0', assets: [] as WalletBalanceDto[] },
      stellar: { totalUsdValue: '0', assets: [] as WalletBalanceDto[] },
    };

    let totalUsdValue = 0;

    // Group balances by network
    for (const balance of balances) {
      const balanceDto = this.mapBalanceToDto(balance);
      
      if (balance.network === 'base') {
        networks.base.assets.push(balanceDto);
        if (balance.usdValue) {
          networks.base.totalUsdValue = (parseFloat(networks.base.totalUsdValue) + parseFloat(balance.usdValue)).toString();
        }
      } else if (balance.network === 'stellar') {
        networks.stellar.assets.push(balanceDto);
        if (balance.usdValue) {
          networks.stellar.totalUsdValue = (parseFloat(networks.stellar.totalUsdValue) + parseFloat(balance.usdValue)).toString();
        }
      }

      if (balance.usdValue) {
        totalUsdValue += parseFloat(balance.usdValue);
      }
    }

    return {
      userId,
      totalUsdValue: totalUsdValue.toString(),
      networks,
      assets: balances.map(b => this.mapBalanceToDto(b)),
      lastUpdated: new Date(),
      cacheHit: false,
      responseTime: Date.now() - startTime,
    };
  }

  private mapBalanceToDto(balance: WalletBalance): WalletBalanceDto {
    return {
      id: balance.id,
      userId: balance.userId,
      network: balance.network,
      asset: balance.asset,
      contractAddress: balance.contractAddress,
      balance: balance.balance,
      formattedBalance: balance.formattedBalance,
      symbol: balance.symbol,
      decimals: balance.decimals,
      assetType: balance.assetType,
      walletAddress: balance.walletAddress,
      usdValue: balance.usdValue,
      priceUsd: balance.priceUsd,
      priceSource: balance.priceSource,
      isStaking: balance.isStaking,
      stakingRewards: balance.stakingRewards,
      metadata: balance.metadata,
      tokenInfo: balance.tokenInfo,
      lastFetchedAt: balance.lastFetchedAt,
      expiresAt: balance.expiresAt,
      createdAt: balance.createdAt,
      updatedAt: balance.updatedAt,
    };
  }

  private getTokenContractAddress(tokenSymbol: string): string | undefined {
    const contracts = {
      USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Sepolia USDC
      USDT: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // Base Sepolia USDT
    };
    return contracts[tokenSymbol as keyof typeof contracts];
  }

  private getTokenDecimals(tokenSymbol: string): number {
    const decimals = {
      USDC: 6,
      USDT: 6,
      ETH: 18,
    };
    return decimals[tokenSymbol as keyof typeof decimals] || 18;
  }

  private formatTokenBalance(balance: string, tokenSymbol: string): string {
    const decimals = this.getTokenDecimals(tokenSymbol);
    return ethers.formatUnits(balance, decimals);
  }

  async getWalletStats(): Promise<WalletStatsDto> {
    const [
      totalUsers,
      totalAssets,
      baseStats,
      stellarStats,
      topAssets,
    ] = await Promise.all([
      this.walletBalanceRepo
        .createQueryBuilder('balance')
        .select('COUNT(DISTINCT balance.userId)', 'count')
        .getRawOne(),
      this.walletBalanceRepo.count(),
      this.getNetworkStats('base'),
      this.getNetworkStats('stellar'),
      this.getTopAssets(),
    ]);

    const hitRate = this.cacheStats.totalRequests > 0 
      ? (this.cacheStats.cacheHits / this.cacheStats.totalRequests * 100).toFixed(2)
      : '0.00';

    return {
      totalUsers: parseInt(totalUsers.count) || 0,
      totalAssets,
      totalUsdValue: '0', // Would be calculated from actual USD values
      networks: {
        base: baseStats,
        stellar: stellarStats,
      },
      topAssets,
      cacheStats: {
        hitRate: `${hitRate}%`,
        totalRequests: this.cacheStats.totalRequests,
        cacheHits: this.cacheStats.cacheHits,
        cacheMisses: this.cacheStats.cacheMisses,
      },
    };
  }

  private async getNetworkStats(network: string): Promise<{
    users: number;
    assets: number;
    totalUsdValue: string;
  }> {
    const [users, assets] = await Promise.all([
      this.walletBalanceRepo
        .createQueryBuilder('balance')
        .select('COUNT(DISTINCT balance.userId)', 'count')
        .where('balance.network = :network', { network })
        .getRawOne(),
      this.walletBalanceRepo.count({ where: { network } }),
    ]);

    return {
      users: parseInt(users.count) || 0,
      assets,
      totalUsdValue: '0', // Would be calculated from actual USD values
    };
  }

  private async getTopAssets(): Promise<Array<{
    asset: string;
    symbol: string;
    totalUsdValue: string;
    userCount: number;
  }>> {
    const result = await this.walletBalanceRepo
      .createQueryBuilder('balance')
      .select('balance.asset', 'asset')
      .addSelect('balance.symbol', 'symbol')
      .addSelect('COUNT(DISTINCT balance.userId)', 'userCount')
      .groupBy('balance.asset, balance.symbol')
      .orderBy('userCount', 'DESC')
      .limit(10)
      .getRawMany();

    return result.map(row => ({
      asset: row.asset,
      symbol: row.symbol,
      totalUsdValue: '0', // Would be calculated from actual USD values
      userCount: parseInt(row.userCount),
    }));
  }
}
