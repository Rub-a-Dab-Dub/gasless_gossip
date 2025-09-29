-- Migration: Create gossip tables with performance indexes
-- This migration creates the gossip_intents and gossip_updates tables with optimized indexes

CREATE TABLE IF NOT EXISTS "gossip_intents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roomId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "content" text NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "metadata" jsonb,
  "upvotes" integer NOT NULL DEFAULT 0,
  "downvotes" integer NOT NULL DEFAULT 0,
  "expiresAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "gossip_updates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "intentId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "type" varchar(20) NOT NULL,
  "content" text,
  "metadata" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes for gossip queries
-- Composite index for room queries with time ordering
CREATE INDEX IF NOT EXISTS "idx_gossip_intents_room_created" 
ON "gossip_intents" ("roomId", "createdAt" DESC);

-- Index for user gossip history
CREATE INDEX IF NOT EXISTS "idx_gossip_intents_user_created" 
ON "gossip_intents" ("userId", "createdAt" DESC);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS "idx_gossip_intents_status_created" 
ON "gossip_intents" ("status", "createdAt" DESC);

-- Single column indexes for filtering
CREATE INDEX IF NOT EXISTS "idx_gossip_intents_room" 
ON "gossip_intents" ("roomId");

CREATE INDEX IF NOT EXISTS "idx_gossip_intents_user" 
ON "gossip_intents" ("userId");

CREATE INDEX IF NOT EXISTS "idx_gossip_intents_status" 
ON "gossip_intents" ("status");

-- Indexes for gossip updates
CREATE INDEX IF NOT EXISTS "idx_gossip_updates_intent_created" 
ON "gossip_updates" ("intentId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_gossip_updates_user_created" 
ON "gossip_updates" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_gossip_updates_type" 
ON "gossip_updates" ("type");

-- Partial index for metadata queries
CREATE INDEX IF NOT EXISTS "idx_gossip_intents_metadata" 
ON "gossip_intents" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_gossip_updates_metadata" 
ON "gossip_updates" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

-- Add constraints
ALTER TABLE "gossip_intents" 
ADD CONSTRAINT "chk_content_not_empty" 
CHECK (length(trim("content")) > 0);

ALTER TABLE "gossip_intents" 
ADD CONSTRAINT "chk_status_valid" 
CHECK ("status" IN ('pending', 'verified', 'debunked', 'expired'));

ALTER TABLE "gossip_updates" 
ADD CONSTRAINT "chk_type_valid" 
CHECK ("type" IN ('new_intent', 'status_change', 'vote', 'comment', 'verification'));

-- Add foreign key constraints (assuming rooms and users tables exist)
-- ALTER TABLE "gossip_intents" 
-- ADD CONSTRAINT "fk_gossip_intents_room" 
-- FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE;

-- ALTER TABLE "gossip_intents" 
-- ADD CONSTRAINT "fk_gossip_intents_user" 
-- FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

-- ALTER TABLE "gossip_updates" 
-- ADD CONSTRAINT "fk_gossip_updates_intent" 
-- FOREIGN KEY ("intentId") REFERENCES "gossip_intents"("id") ON DELETE CASCADE;

-- ALTER TABLE "gossip_updates" 
-- ADD CONSTRAINT "fk_gossip_updates_user" 
-- FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
