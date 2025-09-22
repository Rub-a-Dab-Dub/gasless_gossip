-- Migration: Create room_themes table

CREATE TABLE IF NOT EXISTS "room_themes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "room_id" varchar(255) NOT NULL,
  "theme_id" varchar(255) NOT NULL,
  "metadata" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX idx_room_themes_room_id ON room_themes(room_id);
CREATE INDEX idx_room_themes_theme_id ON room_themes(theme_id);

-- Ensure one theme per room
CREATE UNIQUE INDEX idx_room_themes_unique_room ON room_themes(room_id);