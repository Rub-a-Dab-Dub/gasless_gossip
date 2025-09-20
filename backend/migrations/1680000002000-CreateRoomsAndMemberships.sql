-- Migration: Create rooms and room_memberships tables

CREATE TYPE room_type_enum AS ENUM ('public', 'private', 'invite_only');
CREATE TYPE membership_role_enum AS ENUM ('member', 'admin', 'owner');

CREATE TABLE IF NOT EXISTS "rooms" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(100) NOT NULL UNIQUE,
  "description" varchar(500),
  "type" room_type_enum NOT NULL DEFAULT 'public',
  "max_members" integer NOT NULL DEFAULT 100,
  "created_by" varchar(255) NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "min_level" integer NOT NULL DEFAULT 1,
  "min_xp" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "room_memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "room_id" uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "role" membership_role_enum NOT NULL DEFAULT 'member',
  "invited_by" varchar(255),
  "is_active" boolean NOT NULL DEFAULT true,
  "joined_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Indexes for better query performance
CREATE INDEX idx_rooms_type ON rooms(type);
CREATE INDEX idx_rooms_is_active ON rooms(is_active);
CREATE INDEX idx_room_memberships_room_id ON room_memberships(room_id);
CREATE INDEX idx_room_memberships_user_id ON room_memberships(user_id);
CREATE INDEX idx_room_memberships_is_active ON room_memberships(is_active);