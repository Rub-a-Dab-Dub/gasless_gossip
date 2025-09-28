-- Migration: Create rate_limit_violations table with performance indexes
-- This migration creates the rate_limit_violations table for tracking rate limit violations

CREATE TABLE IF NOT EXISTS "rate_limit_violations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid,
  "ipAddress" varchar(45) NOT NULL,
  "endpoint" varchar(255) NOT NULL,
  "violationType" varchar(20) NOT NULL DEFAULT 'short',
  "requestCount" integer NOT NULL,
  "limit" integer NOT NULL,
  "userAgent" varchar(255),
  "metadata" jsonb,
  "status" varchar(20) NOT NULL DEFAULT 'active',
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes for rate limit violation queries
-- Composite index for user violations with time ordering
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_user_created" 
ON "rate_limit_violations" ("userId", "createdAt" DESC);

-- Index for endpoint analysis
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_endpoint_created" 
ON "rate_limit_violations" ("endpoint", "createdAt" DESC);

-- Index for IP address tracking
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_ip_created" 
ON "rate_limit_violations" ("ipAddress", "createdAt" DESC);

-- Index for violation type analysis
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_type_created" 
ON "rate_limit_violations" ("violationType", "createdAt" DESC);

-- Single column indexes for filtering
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_user" 
ON "rate_limit_violations" ("userId") 
WHERE "userId" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_ip" 
ON "rate_limit_violations" ("ipAddress");

CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_endpoint" 
ON "rate_limit_violations" ("endpoint");

CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_type" 
ON "rate_limit_violations" ("violationType");

CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_status" 
ON "rate_limit_violations" ("status");

-- Partial index for metadata queries
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_metadata" 
ON "rate_limit_violations" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

-- Index for cleanup operations (old records)
CREATE INDEX IF NOT EXISTS "idx_rate_limit_violations_created_at" 
ON "rate_limit_violations" ("createdAt");

-- Add constraints
ALTER TABLE "rate_limit_violations" 
ADD CONSTRAINT "chk_violation_type_valid" 
CHECK ("violationType" IN ('short', 'medium', 'long', 'custom'));

ALTER TABLE "rate_limit_violations" 
ADD CONSTRAINT "chk_status_valid" 
CHECK ("status" IN ('active', 'resolved', 'ignored'));

ALTER TABLE "rate_limit_violations" 
ADD CONSTRAINT "chk_request_count_positive" 
CHECK ("requestCount" > 0);

ALTER TABLE "rate_limit_violations" 
ADD CONSTRAINT "chk_limit_positive" 
CHECK ("limit" > 0);

-- Add foreign key constraints (assuming users table exists)
-- ALTER TABLE "rate_limit_violations" 
-- ADD CONSTRAINT "fk_rate_limit_violations_user" 
-- FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL;
