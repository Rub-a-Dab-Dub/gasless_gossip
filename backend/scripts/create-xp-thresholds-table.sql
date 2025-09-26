-- Create XP thresholds configuration table
CREATE TABLE IF NOT EXISTS xp_thresholds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level INTEGER NOT NULL,
    xp_required INTEGER NOT NULL,
    badge_unlocked VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on level for active thresholds
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_thresholds_level_active 
ON xp_thresholds(level) WHERE is_active = true;

-- Create index on xp_required for efficient lookups
CREATE INDEX IF NOT EXISTS idx_xp_thresholds_xp_required ON xp_thresholds(xp_required);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_xp_thresholds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_xp_thresholds_updated_at
    BEFORE UPDATE ON xp_thresholds
    FOR EACH ROW
    EXECUTE FUNCTION update_xp_thresholds_updated_at();

-- Insert default XP thresholds
INSERT INTO xp_thresholds (level, xp_required, badge_unlocked, is_active) VALUES
(1, 0, NULL, true),
(2, 100, NULL, true),
(3, 250, NULL, true),
(4, 500, NULL, true),
(5, 1000, 'bronze_achiever', true),
(6, 1750, NULL, true),
(7, 2750, NULL, true),
(8, 4000, NULL, true),
(9, 5500, NULL, true),
(10, 7500, 'silver_achiever', true),
(11, 10000, NULL, true),
(12, 13000, NULL, true),
(13, 16500, NULL, true),
(14, 20500, NULL, true),
(15, 25000, 'gold_achiever', true),
(16, 30000, NULL, true),
(17, 36000, NULL, true),
(18, 43000, NULL, true),
(19, 51000, NULL, true),
(20, 60000, 'platinum_achiever', true)
ON CONFLICT DO NOTHING;
