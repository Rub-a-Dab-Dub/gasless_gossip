-- Migration: Create chat_messages table with performance indexes
-- This migration creates the chat_messages table with optimized indexes for high-volume chat rooms

CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roomId" uuid NOT NULL,
  "senderId" uuid NOT NULL,
  "content" text NOT NULL,
  "messageType" varchar(255),
  "metadata" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes for chat history queries
-- Composite index for room queries with time ordering (most common query pattern)
CREATE INDEX IF NOT EXISTS "idx_chat_messages_room_created" 
ON "chat_messages" ("roomId", "createdAt" DESC);

-- Index for user message history queries
CREATE INDEX IF NOT EXISTS "idx_chat_messages_sender_created" 
ON "chat_messages" ("senderId", "createdAt" DESC);

-- Single column indexes for filtering
CREATE INDEX IF NOT EXISTS "idx_chat_messages_room" 
ON "chat_messages" ("roomId");

CREATE INDEX IF NOT EXISTS "idx_chat_messages_sender" 
ON "chat_messages" ("senderId");

-- Index for message type filtering (if needed)
CREATE INDEX IF NOT EXISTS "idx_chat_messages_type" 
ON "chat_messages" ("messageType") 
WHERE "messageType" IS NOT NULL;

-- Partial index for metadata queries (only when metadata exists)
CREATE INDEX IF NOT EXISTS "idx_chat_messages_metadata" 
ON "chat_messages" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

-- Add constraints
ALTER TABLE "chat_messages" 
ADD CONSTRAINT "chk_content_not_empty" 
CHECK (length(trim("content")) > 0);

-- Add foreign key constraints (assuming rooms and users tables exist)
-- ALTER TABLE "chat_messages" 
-- ADD CONSTRAINT "fk_chat_messages_room" 
-- FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE;

-- ALTER TABLE "chat_messages" 
-- ADD CONSTRAINT "fk_chat_messages_sender" 
-- FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE;
