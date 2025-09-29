-- Migration: Create token gift tables with performance indexes
-- This migration creates the token_gifts and token_gift_transactions tables for gasless token gifting

CREATE TABLE IF NOT EXISTS "token_gifts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "senderId" uuid NOT NULL,
  "recipientId" uuid NOT NULL,
  "tokenAddress" varchar(100) NOT NULL,
  "tokenSymbol" varchar(50) NOT NULL,
  "amount" decimal(20,8) NOT NULL,
  "network" varchar(20) NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "stellarTxHash" varchar(255),
  "baseTxHash" varchar(255),
  "paymasterTxHash" varchar(255),
  "gasUsed" decimal(20,8),
  "gasPrice" decimal(20,8),
  "totalCost" decimal(20,8),
  "message" text,
  "metadata" jsonb,
  "sorobanData" jsonb,
  "paymasterData" jsonb,
  "processedAt" timestamptz,
  "completedAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "token_gift_transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "giftId" uuid NOT NULL,
  "network" varchar(20) NOT NULL,
  "txHash" varchar(255) NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "blockNumber" varchar(50),
  "confirmations" integer,
  "gasUsed" decimal(20,8),
  "gasPrice" decimal(20,8),
  "effectiveGasPrice" decimal(20,8),
  "transactionFee" decimal(20,8),
  "sponsored" boolean NOT NULL DEFAULT false,
  "paymasterAddress" varchar(255),
  "transactionData" jsonb,
  "receipt" jsonb,
  "errorMessage" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes for token gift queries
-- User gift lookups
CREATE INDEX IF NOT EXISTS "idx_token_gifts_sender_created" 
ON "token_gifts" ("senderId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_token_gifts_recipient_created" 
ON "token_gifts" ("recipientId", "createdAt" DESC);

-- Status-based queries
CREATE INDEX IF NOT EXISTS "idx_token_gifts_status_created" 
ON "token_gifts" ("status", "createdAt" DESC);

-- Network-based queries
CREATE INDEX IF NOT EXISTS "idx_token_gifts_network_created" 
ON "token_gifts" ("network", "createdAt" DESC);

-- Transaction hash lookups
CREATE INDEX IF NOT EXISTS "idx_token_gifts_stellar_tx" 
ON "token_gifts" ("stellarTxHash") 
WHERE "stellarTxHash" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_token_gifts_base_tx" 
ON "token_gifts" ("baseTxHash") 
WHERE "baseTxHash" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_token_gifts_paymaster_tx" 
ON "token_gifts" ("paymasterTxHash") 
WHERE "paymasterTxHash" IS NOT NULL;

-- Single column indexes for filtering
CREATE INDEX IF NOT EXISTS "idx_token_gifts_sender" 
ON "token_gifts" ("senderId");

CREATE INDEX IF NOT EXISTS "idx_token_gifts_recipient" 
ON "token_gifts" ("recipientId");

CREATE INDEX IF NOT EXISTS "idx_token_gifts_status" 
ON "token_gifts" ("status");

CREATE INDEX IF NOT EXISTS "idx_token_gifts_network" 
ON "token_gifts" ("network");

CREATE INDEX IF NOT EXISTS "idx_token_gifts_token_symbol" 
ON "token_gifts" ("tokenSymbol");

-- Token gift transactions indexes
CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_gift_created" 
ON "token_gift_transactions" ("giftId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_network_created" 
ON "token_gift_transactions" ("network", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_tx_hash" 
ON "token_gift_transactions" ("txHash", "network");

CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_status" 
ON "token_gift_transactions" ("status");

CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_sponsored" 
ON "token_gift_transactions" ("sponsored", "createdAt" DESC) 
WHERE "sponsored" = true;

-- Partial indexes for metadata queries
CREATE INDEX IF NOT EXISTS "idx_token_gifts_metadata" 
ON "token_gifts" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_token_gifts_soroban_data" 
ON "token_gifts" USING GIN ("sorobanData") 
WHERE "sorobanData" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_token_gifts_paymaster_data" 
ON "token_gifts" USING GIN ("paymasterData") 
WHERE "paymasterData" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_transaction_data" 
ON "token_gift_transactions" USING GIN ("transactionData") 
WHERE "transactionData" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_token_gift_transactions_receipt" 
ON "token_gift_transactions" USING GIN ("receipt") 
WHERE "receipt" IS NOT NULL;

-- Add constraints
ALTER TABLE "token_gifts" 
ADD CONSTRAINT "chk_amount_positive" 
CHECK ("amount" > 0);

ALTER TABLE "token_gifts" 
ADD CONSTRAINT "chk_status_valid" 
CHECK ("status" IN ('pending', 'processing', 'completed', 'failed', 'cancelled'));

ALTER TABLE "token_gifts" 
ADD CONSTRAINT "chk_network_valid" 
CHECK ("network" IN ('stellar', 'base', 'ethereum'));

ALTER TABLE "token_gift_transactions" 
ADD CONSTRAINT "chk_transaction_status_valid" 
CHECK ("status" IN ('pending', 'confirmed', 'failed'));

ALTER TABLE "token_gift_transactions" 
ADD CONSTRAINT "chk_transaction_network_valid" 
CHECK ("network" IN ('stellar', 'base', 'ethereum'));

ALTER TABLE "token_gift_transactions" 
ADD CONSTRAINT "chk_gas_used_non_negative" 
CHECK ("gasUsed" IS NULL OR "gasUsed" >= 0);

ALTER TABLE "token_gift_transactions" 
ADD CONSTRAINT "chk_gas_price_non_negative" 
CHECK ("gasPrice" IS NULL OR "gasPrice" >= 0);

ALTER TABLE "token_gift_transactions" 
ADD CONSTRAINT "chk_transaction_fee_non_negative" 
CHECK ("transactionFee" IS NULL OR "transactionFee" >= 0);

-- Add foreign key constraints (assuming users table exists)
-- ALTER TABLE "token_gifts" 
-- ADD CONSTRAINT "fk_token_gifts_sender" 
-- FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE;

-- ALTER TABLE "token_gifts" 
-- ADD CONSTRAINT "fk_token_gifts_recipient" 
-- FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE;

-- ALTER TABLE "token_gift_transactions" 
-- ADD CONSTRAINT "fk_token_gift_transactions_gift" 
-- FOREIGN KEY ("giftId") REFERENCES "token_gifts"("id") ON DELETE CASCADE;
