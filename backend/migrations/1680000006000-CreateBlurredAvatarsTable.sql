-- Migration: Create blurred_avatars table

CREATE TABLE IF NOT EXISTS "blurred_avatars" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" varchar(255) NOT NULL,
  "blurLevel" integer NOT NULL DEFAULT 5,
  "imageUrl" varchar(500) NOT NULL,
  "originalImageUrl" varchar(500),
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX idx_blurred_avatars_user_id ON blurred_avatars("userId");
CREATE INDEX idx_blurred_avatars_is_active ON blurred_avatars("isActive");
CREATE INDEX idx_blurred_avatars_user_active ON blurred_avatars("userId", "isActive");

-- Update trigger for updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blurred_avatars_updated_at BEFORE UPDATE
    ON blurred_avatars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
