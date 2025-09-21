-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    current_xp INTEGER NOT NULL DEFAULT 0,
    xp_threshold INTEGER NOT NULL,
    total_xp INTEGER NOT NULL DEFAULT 0,
    is_level_up_pending BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on user_id and level
CREATE UNIQUE INDEX IF NOT EXISTS idx_levels_user_level ON levels(user_id, level);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_levels_user_id ON levels(user_id);

-- Create index on total_xp for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_levels_total_xp ON levels(total_xp DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_levels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_levels_updated_at
    BEFORE UPDATE ON levels
    FOR EACH ROW
    EXECUTE FUNCTION update_levels_updated_at();
