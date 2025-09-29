-- Migration: Create secret rooms tables with performance indexes
-- This migration creates the secret_rooms, room_invitations, and room_members tables

CREATE TABLE IF NOT EXISTS "secret_rooms" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "creatorId" uuid NOT NULL,
  "name" varchar(100) NOT NULL,
  "description" text,
  "roomCode" varchar(20) UNIQUE NOT NULL,
  "isPrivate" boolean NOT NULL DEFAULT false,
  "isActive" boolean NOT NULL DEFAULT true,
  "status" varchar(20) NOT NULL DEFAULT 'active',
  "maxUsers" integer NOT NULL DEFAULT 50,
  "currentUsers" integer NOT NULL DEFAULT 0,
  "category" varchar(50),
  "theme" varchar(20),
  "settings" jsonb,
  "metadata" jsonb,
  "lastActivityAt" timestamptz,
  "expiresAt" timestamptz,
  "archivedAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "room_invitations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roomId" uuid NOT NULL,
  "invitedBy" uuid NOT NULL,
  "invitedUserId" uuid,
  "invitedEmail" varchar(255),
  "invitationCode" varchar(100) UNIQUE NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "message" text,
  "role" varchar(20),
  "expiresInDays" integer NOT NULL DEFAULT 7,
  "expiresAt" timestamptz,
  "acceptedAt" timestamptz,
  "declinedAt" timestamptz,
  "metadata" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "room_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roomId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "role" varchar(20) NOT NULL DEFAULT 'member',
  "status" varchar(20) NOT NULL DEFAULT 'active',
  "nickname" varchar(50),
  "displayName" varchar(20),
  "isAnonymous" boolean NOT NULL DEFAULT false,
  "canInvite" boolean NOT NULL DEFAULT true,
  "canModerate" boolean NOT NULL DEFAULT false,
  "messageCount" integer NOT NULL DEFAULT 0,
  "reactionCount" integer NOT NULL DEFAULT 0,
  "lastSeenAt" timestamptz,
  "lastMessageAt" timestamptz,
  "leftAt" timestamptz,
  "bannedAt" timestamptz,
  "banReason" text,
  "permissions" jsonb,
  "metadata" jsonb,
  "joinedAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes for secret rooms queries
-- Creator and activity queries
CREATE INDEX IF NOT EXISTS "idx_secret_rooms_creator_created" 
ON "secret_rooms" ("creatorId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_private_created" 
ON "secret_rooms" ("isPrivate", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_status_created" 
ON "secret_rooms" ("status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_room_code" 
ON "secret_rooms" ("roomCode", "isActive");

-- Single column indexes for filtering
CREATE INDEX IF NOT EXISTS "idx_secret_rooms_creator" 
ON "secret_rooms" ("creatorId");

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_private" 
ON "secret_rooms" ("isPrivate");

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_status" 
ON "secret_rooms" ("status");

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_active" 
ON "secret_rooms" ("isActive");

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_category" 
ON "secret_rooms" ("category");

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_theme" 
ON "secret_rooms" ("theme");

-- Room invitations indexes
CREATE INDEX IF NOT EXISTS "idx_room_invitations_room_created" 
ON "room_invitations" ("roomId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_room_invitations_invited_user_status" 
ON "room_invitations" ("invitedUserId", "status");

CREATE INDEX IF NOT EXISTS "idx_room_invitations_invited_by_created" 
ON "room_invitations" ("invitedBy", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_room_invitations_code_status" 
ON "room_invitations" ("invitationCode", "status");

-- Room members indexes
CREATE INDEX IF NOT EXISTS "idx_room_members_room_user" 
ON "room_members" ("roomId", "userId");

CREATE INDEX IF NOT EXISTS "idx_room_members_room_role" 
ON "room_members" ("roomId", "role");

CREATE INDEX IF NOT EXISTS "idx_room_members_user_status" 
ON "room_members" ("userId", "status");

CREATE INDEX IF NOT EXISTS "idx_room_members_room_joined" 
ON "room_members" ("roomId", "joinedAt" DESC);

-- Partial indexes for specific statuses
CREATE INDEX IF NOT EXISTS "idx_room_members_active_members" 
ON "room_members" ("roomId", "joinedAt" DESC) 
WHERE "status" = 'active';

CREATE INDEX IF NOT EXISTS "idx_room_members_banned_members" 
ON "room_members" ("roomId", "bannedAt" DESC) 
WHERE "status" = 'banned';

CREATE INDEX IF NOT EXISTS "idx_room_invitations_pending" 
ON "room_invitations" ("invitationCode", "createdAt" DESC) 
WHERE "status" = 'pending';

CREATE INDEX IF NOT EXISTS "idx_room_invitations_expired" 
ON "room_invitations" ("createdAt" DESC) 
WHERE "status" = 'expired';

-- GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS "idx_secret_rooms_settings" 
ON "secret_rooms" USING GIN ("settings") 
WHERE "settings" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_metadata" 
ON "secret_rooms" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_room_invitations_metadata" 
ON "room_invitations" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_room_members_permissions" 
ON "room_members" USING GIN ("permissions") 
WHERE "permissions" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_room_members_metadata" 
ON "room_members" USING GIN ("metadata") 
WHERE "metadata" IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "idx_secret_rooms_creator_status_created" 
ON "secret_rooms" ("creatorId", "status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_private_status_created" 
ON "secret_rooms" ("isPrivate", "status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_room_members_room_status_joined" 
ON "room_members" ("roomId", "status", "joinedAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_room_members_user_status_joined" 
ON "room_members" ("userId", "status", "joinedAt" DESC);

-- Time-based partitioning indexes (for high-volume scenarios)
CREATE INDEX IF NOT EXISTS "idx_secret_rooms_created_hour" 
ON "secret_rooms" (date_trunc('hour', "createdAt"));

CREATE INDEX IF NOT EXISTS "idx_secret_rooms_created_day" 
ON "secret_rooms" (date_trunc('day', "createdAt"));

CREATE INDEX IF NOT EXISTS "idx_room_members_joined_hour" 
ON "room_members" (date_trunc('hour', "joinedAt"));

CREATE INDEX IF NOT EXISTS "idx_room_members_joined_day" 
ON "room_members" (date_trunc('day', "joinedAt"));

-- Add constraints
ALTER TABLE "secret_rooms" 
ADD CONSTRAINT "chk_max_users_positive" 
CHECK ("maxUsers" > 0);

ALTER TABLE "secret_rooms" 
ADD CONSTRAINT "chk_current_users_non_negative" 
CHECK ("currentUsers" >= 0);

ALTER TABLE "secret_rooms" 
ADD CONSTRAINT "chk_status_valid" 
CHECK ("status" IN ('active', 'inactive', 'archived', 'deleted'));

ALTER TABLE "room_invitations" 
ADD CONSTRAINT "chk_invitation_status_valid" 
CHECK ("status" IN ('pending', 'accepted', 'declined', 'expired', 'revoked'));

ALTER TABLE "room_invitations" 
ADD CONSTRAINT "chk_expires_in_days_positive" 
CHECK ("expiresInDays" > 0);

ALTER TABLE "room_members" 
ADD CONSTRAINT "chk_member_role_valid" 
CHECK ("role" IN ('member', 'moderator', 'admin', 'owner'));

ALTER TABLE "room_members" 
ADD CONSTRAINT "chk_member_status_valid" 
CHECK ("status" IN ('active', 'inactive', 'banned', 'left'));

ALTER TABLE "room_members" 
ADD CONSTRAINT "chk_message_count_non_negative" 
CHECK ("messageCount" >= 0);

ALTER TABLE "room_members" 
ADD CONSTRAINT "chk_reaction_count_non_negative" 
CHECK ("reactionCount" >= 0);

-- Add foreign key constraints (assuming users table exists)
-- ALTER TABLE "secret_rooms" 
-- ADD CONSTRAINT "fk_secret_rooms_creator" 
-- FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE;

-- ALTER TABLE "room_invitations" 
-- ADD CONSTRAINT "fk_room_invitations_room" 
-- FOREIGN KEY ("roomId") REFERENCES "secret_rooms"("id") ON DELETE CASCADE;

-- ALTER TABLE "room_invitations" 
-- ADD CONSTRAINT "fk_room_invitations_invited_by" 
-- FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE;

-- ALTER TABLE "room_invitations" 
-- ADD CONSTRAINT "fk_room_invitations_invited_user" 
-- FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE CASCADE;

-- ALTER TABLE "room_members" 
-- ADD CONSTRAINT "fk_room_members_room" 
-- FOREIGN KEY ("roomId") REFERENCES "secret_rooms"("id") ON DELETE CASCADE;

-- ALTER TABLE "room_members" 
-- ADD CONSTRAINT "fk_room_members_user" 
-- FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

-- Create views for common queries
CREATE OR REPLACE VIEW "active_rooms" AS
SELECT 
  "id",
  "creatorId",
  "name",
  "description",
  "roomCode",
  "isPrivate",
  "maxUsers",
  "currentUsers",
  "category",
  "theme",
  "lastActivityAt",
  "createdAt"
FROM "secret_rooms"
WHERE "status" = 'active' AND "isActive" = true;

CREATE OR REPLACE VIEW "room_member_counts" AS
SELECT 
  "roomId",
  COUNT(*) as "member_count",
  COUNT(CASE WHEN "status" = 'active' THEN 1 END) as "active_members",
  COUNT(CASE WHEN "role" = 'admin' THEN 1 END) as "admin_count",
  COUNT(CASE WHEN "role" = 'moderator' THEN 1 END) as "moderator_count"
FROM "room_members"
GROUP BY "roomId";

CREATE OR REPLACE VIEW "user_room_stats" AS
SELECT 
  "creatorId" as "userId",
  COUNT(*) as "rooms_created",
  COUNT(CASE WHEN "isPrivate" = true THEN 1 END) as "private_rooms",
  COUNT(CASE WHEN "isPrivate" = false THEN 1 END) as "public_rooms",
  COUNT(CASE WHEN "status" = 'active' THEN 1 END) as "active_rooms",
  MAX("createdAt") as "last_room_created"
FROM "secret_rooms"
GROUP BY "creatorId";
