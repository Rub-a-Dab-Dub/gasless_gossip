-- Migration: Create wallet balances table with performance indexes
-- This migration creates the wallet_balances table for unified wallet balance tracking

CREATE TABLE IF NOT EXISTS "wallet_balances" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "network" varchar(50) NOT NULL,
  "asset" varchar(100) NOT NULL,
  "contractAddress" varchar(255),
  "balance" decimal(36,18) NOT NULL,
  "formattedBalance" decimal(36,18) NOT NULL,
  "symbol" varchar(10),
  "decimals" integer,
  "assetType" varchar(100),
  "walletAddress" varchar(255),
  "usdValue" decimal(20,8),
  "priceUsd" decimal(20,8),
  "priceSource" varchar(20),
  "isStaking" boolean NOT NULL DEFAULT false,
  "stakingRewards" decimal(20,8),
  "metadata" jsonb,
  "tokenInfo" jsonb,
  "lastFetchedAt" timestamptz,
  "expiresAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes for wallet balance queries
-- User and network queries
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_user_network_created" 
ON "wallet_balances" ("userId", "network", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_user_asset_created" 
ON "wallet_balances" ("userId", "asset", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_network_asset_created" 
ON "wallet_balances" ("network", "asset", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_user_network_asset" 
ON "wallet_balances" ("userId", "network", "asset");

-- Single column indexes for filtering
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_user" 
ON "wallet_balances" ("userId");

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_network" 
ON "wallet_balances" ("network");

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_asset" 
ON "wallet_balances" ("asset");

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_symbol" 
ON "wallet_balances" ("symbol");

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_asset_type" 
ON "wallet_balances" ("assetType");

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_wallet_address" 
ON "wallet_balances" ("walletAddress");

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_last_fetched" 
ON "wallet_balances" ("lastFetchedAt" DESC);

-- Partial indexes for specific networks
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_base_assets" 
ON "wallet_balances" ("userId", "asset", "createdAt" DESC) 
WHERE "network" = 'base';

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_stellar_assets" 
ON "wallet_balances" ("userId", "asset", "createdAt" DESC) 
WHERE "network" = 'stellar';

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_ethereum_assets" 
ON "wallet_balances" ("userId", "asset", "createdAt" DESC) 
WHERE "network" = 'ethereum';

-- Partial indexes for specific asset types
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_native_assets" 
ON "wallet_balances" ("userId", "network", "createdAt" DESC) 
WHERE "assetType" = 'native';

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_token_assets" 
ON "wallet_balances" ("userId", "network", "createdAt" DESC) 
WHERE "assetType" = 'token';

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_nft_assets" 
ON "wallet_balances" ("userId", "network", "createdAt" DESC) 
WHERE "assetType" = 'nft';

-- Partial indexes for staking
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_staking" 
ON "wallet_balances" ("userId", "network", "createdAt" DESC) 
WHERE "isStaking" = true;

-- GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_metadata" 
ON "wallet_balances" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_token_info" 
ON "wallet_balances" USING GIN ("tokenInfo") 
WHERE "tokenInfo" IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_user_network_asset_type" 
ON "wallet_balances" ("userId", "network", "assetType", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_network_asset_type_created" 
ON "wallet_balances" ("network", "assetType", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_user_symbol_created" 
ON "wallet_balances" ("userId", "symbol", "createdAt" DESC);

-- Time-based partitioning indexes (for high-volume scenarios)
CREATE INDEX IF NOT EXISTS "idx_wallet_balances_created_hour" 
ON "wallet_balances" (date_trunc('hour', "createdAt"));

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_created_day" 
ON "wallet_balances" (date_trunc('day', "createdAt"));

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_last_fetched_hour" 
ON "wallet_balances" (date_trunc('hour', "lastFetchedAt"));

CREATE INDEX IF NOT EXISTS "idx_wallet_balances_last_fetched_day" 
ON "wallet_balances" (date_trunc('day', "lastFetchedAt"));

-- Add constraints
ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_balance_non_negative" 
CHECK ("balance" >= 0);

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_formatted_balance_non_negative" 
CHECK ("formattedBalance" >= 0);

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_usd_value_non_negative" 
CHECK ("usdValue" IS NULL OR "usdValue" >= 0);

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_price_usd_non_negative" 
CHECK ("priceUsd" IS NULL OR "priceUsd" >= 0);

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_staking_rewards_non_negative" 
CHECK ("stakingRewards" IS NULL OR "stakingRewards" >= 0);

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_network_valid" 
CHECK ("network" IN ('base', 'stellar', 'ethereum', 'polygon', 'arbitrum', 'optimism'));

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_asset_type_valid" 
CHECK ("assetType" IN ('native', 'token', 'nft', 'lp', 'staked'));

ALTER TABLE "wallet_balances" 
ADD CONSTRAINT "chk_price_source_valid" 
CHECK ("priceSource" IS NULL OR "priceSource" IN ('coingecko', 'coinmarketcap', 'manual', 'api'));

-- Add foreign key constraints (assuming users table exists)
-- ALTER TABLE "wallet_balances" 
-- ADD CONSTRAINT "fk_wallet_balances_user" 
-- FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

-- Create views for common queries
CREATE OR REPLACE VIEW "user_wallet_summary" AS
SELECT 
  "userId",
  COUNT(DISTINCT "network") as "network_count",
  COUNT(DISTINCT "asset") as "asset_count",
  SUM("usdValue") as "total_usd_value",
  MAX("lastFetchedAt") as "last_updated"
FROM "wallet_balances"
WHERE "usdValue" IS NOT NULL
GROUP BY "userId";

CREATE OR REPLACE VIEW "network_balance_summary" AS
SELECT 
  "network",
  COUNT(DISTINCT "userId") as "user_count",
  COUNT(DISTINCT "asset") as "asset_count",
  SUM("usdValue") as "total_usd_value",
  AVG("usdValue") as "average_usd_value",
  MAX("lastFetchedAt") as "last_updated"
FROM "wallet_balances"
WHERE "usdValue" IS NOT NULL
GROUP BY "network";

CREATE OR REPLACE VIEW "asset_balance_summary" AS
SELECT 
  "asset",
  "symbol",
  "network",
  COUNT(DISTINCT "userId") as "user_count",
  SUM("usdValue") as "total_usd_value",
  AVG("usdValue") as "average_usd_value",
  MAX("lastFetchedAt") as "last_updated"
FROM "wallet_balances"
WHERE "usdValue" IS NOT NULL
GROUP BY "asset", "symbol", "network";

CREATE OR REPLACE VIEW "recent_balance_updates" AS
SELECT 
  "userId",
  "network",
  "asset",
  "symbol",
  "formattedBalance",
  "usdValue",
  "lastFetchedAt"
FROM "wallet_balances"
WHERE "lastFetchedAt" > NOW() - INTERVAL '1 hour'
ORDER BY "lastFetchedAt" DESC;
