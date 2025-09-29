import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class WalletBalanceDto {
  id!: string;
  userId!: string;
  network!: string;
  asset!: string;
  contractAddress?: string;
  balance!: string;
  formattedBalance!: string;
  symbol?: string;
  decimals?: number;
  assetType?: string;
  walletAddress?: string;
  usdValue?: string;
  priceUsd?: string;
  priceSource?: string;
  isStaking!: boolean;
  stakingRewards?: string;
  metadata?: Record<string, any>;
  tokenInfo?: Record<string, any>;
  lastFetchedAt?: Date;
  expiresAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WalletSummaryDto {
  userId!: string;
  totalUsdValue!: string;
  networks!: {
    base: {
      totalUsdValue: string;
      assets: WalletBalanceDto[];
    };
    stellar: {
      totalUsdValue: string;
      assets: WalletBalanceDto[];
    };
  };
  assets!: WalletBalanceDto[];
  lastUpdated!: Date;
  cacheHit!: boolean;
  responseTime!: number;
}

export class NetworkBalanceDto {
  network!: string;
  totalUsdValue!: string;
  nativeBalance!: string;
  tokenCount!: number;
  assets!: WalletBalanceDto[];
  lastUpdated!: Date;
}

export class AssetBalanceDto {
  asset!: string;
  symbol!: string;
  balance!: string;
  formattedBalance!: string;
  usdValue!: string;
  priceUsd!: string;
  network!: string;
  contractAddress?: string;
  decimals?: number;
  assetType?: string;
  isStaking!: boolean;
  stakingRewards?: string;
  metadata?: Record<string, any>;
  tokenInfo?: Record<string, any>;
}

export class PriceDataDto {
  asset!: string;
  symbol!: string;
  priceUsd!: string;
  priceSource!: string;
  lastUpdated!: Date;
  change24h?: string;
  marketCap?: string;
  volume24h?: string;
}

export class WalletStatsDto {
  totalUsers!: number;
  totalAssets!: number;
  totalUsdValue!: string;
  networks!: {
    base: {
      users: number;
      assets: number;
      totalUsdValue: string;
    };
    stellar: {
      users: number;
      assets: number;
      totalUsdValue: string;
    };
  };
  topAssets!: Array<{
    asset: string;
    symbol: string;
    totalUsdValue: string;
    userCount: number;
  }>;
  cacheStats!: {
    hitRate: string;
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
  };
}

export class RefreshBalanceDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  networks?: string[]; // ['base', 'stellar']

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assets?: string[]; // ['ETH', 'XLM', 'USDC']

  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean; // Force refresh even if cached
}

export class GetBalanceDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  networks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assets?: string[];

  @IsOptional()
  @IsBoolean()
  includePrices?: boolean;

  @IsOptional()
  @IsBoolean()
  includeMetadata?: boolean;
}
