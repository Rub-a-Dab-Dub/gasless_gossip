-- Migration: Enhanced Secret Rooms with Specialized CRUD Features
-- Add new fields for moderation, reactions, pseudonyms, and XP multipliers

BEGIN;

-- Add new columns to secret_rooms table
ALTER TABLE secret_rooms 
ADD COLUMN IF NOT EXISTS moderation_settings JSONB,
ADD COLUMN IF NOT EXISTS reaction_metrics JSONB,
ADD COLUMN IF NOT EXISTS enable_pseudonyms BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS fake_name_theme VARCHAR(50) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS xp_multiplier INTEGER DEFAULT 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_secret_rooms_enable_pseudonyms ON secret_rooms(enable_pseudonyms);
CREATE INDEX IF NOT EXISTS idx_secret_rooms_fake_name_theme ON secret_rooms(fake_name_theme);
CREATE INDEX IF NOT EXISTS idx_secret_rooms_xp_multiplier ON secret_rooms(xp_multiplier);
CREATE INDEX IF NOT EXISTS idx_secret_rooms_expires_at ON secret_rooms(expires_at) WHERE expires_at IS NOT NULL;

-- Index for reaction metrics trending score (JSONB field)
CREATE INDEX IF NOT EXISTS idx_secret_rooms_trending_score 
ON secret_rooms USING GIN ((reaction_metrics->'trendingScore'));

-- Index for moderation settings
CREATE INDEX IF NOT EXISTS idx_secret_rooms_moderation_settings 
ON secret_rooms USING GIN (moderation_settings);

-- Update existing rooms with default values
UPDATE secret_rooms 
SET 
    moderation_settings = '{
        "creatorModPrivileges": true,
        "autoModeration": true,
        "voiceModerationQueue": false,
        "maxViolationsBeforeAutoDelete": 3,
        "pseudonymDecryption": true
    }'::jsonb,
    reaction_metrics = '{
        "totalReactions": 0,
        "trendingScore": 0,
        "lastTrendingUpdate": "' || NOW() || '"
    }'::jsonb,
    enable_pseudonyms = true,
    fake_name_theme = 'default',
    xp_multiplier = 0
WHERE moderation_settings IS NULL;

-- Create a function to automatically update trending scores
CREATE OR REPLACE FUNCTION update_room_trending_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Update lastTrendingUpdate when reaction_metrics is modified
    IF TG_OP = 'UPDATE' AND OLD.reaction_metrics IS DISTINCT FROM NEW.reaction_metrics THEN
        NEW.reaction_metrics = jsonb_set(
            COALESCE(NEW.reaction_metrics, '{}'::jsonb),
            '{lastTrendingUpdate}',
            to_jsonb(NOW())
        );
        NEW.last_activity_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic trending score updates
DROP TRIGGER IF EXISTS trigger_update_room_trending_score ON secret_rooms;
CREATE TRIGGER trigger_update_room_trending_score
    BEFORE UPDATE ON secret_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_room_trending_score();

-- Add constraints for data integrity
ALTER TABLE secret_rooms 
ADD CONSTRAINT check_fake_name_theme 
CHECK (fake_name_theme IN ('default', 'space', 'animals', 'colors', 'cyber', 'mythical'));

ALTER TABLE secret_rooms 
ADD CONSTRAINT check_xp_multiplier 
CHECK (xp_multiplier >= 0 AND xp_multiplier <= 1000); -- Max 1000% multiplier

-- Create view for trending rooms (most reacted)
CREATE OR REPLACE VIEW trending_secret_rooms AS
SELECT 
    sr.*,
    COALESCE((sr.reaction_metrics->>'trendingScore')::numeric, 0) as trending_score,
    COALESCE((sr.reaction_metrics->>'totalReactions')::numeric, 0) as total_reactions
FROM secret_rooms sr
WHERE sr.is_active = true 
    AND sr.status = 'active'
    AND (sr.expires_at IS NULL OR sr.expires_at > NOW())
ORDER BY 
    COALESCE((sr.reaction_metrics->>'trendingScore')::numeric, 0) DESC,
    sr.current_users DESC,
    sr.last_activity_at DESC;

-- Create materialized view for performance (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_trending_secret_rooms AS
SELECT * FROM trending_secret_rooms;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_trending_secret_rooms_id 
ON mv_trending_secret_rooms(id);

-- Add comments for documentation
COMMENT ON COLUMN secret_rooms.moderation_settings IS 'JSON settings for room moderation including creator privileges and auto-moderation';
COMMENT ON COLUMN secret_rooms.reaction_metrics IS 'JSON metrics for room reactions including trending score and total reactions';
COMMENT ON COLUMN secret_rooms.enable_pseudonyms IS 'Whether pseudonyms/fake names are enabled for this room';
COMMENT ON COLUMN secret_rooms.fake_name_theme IS 'Theme for fake name generation (default, space, animals, colors, cyber, mythical)';
COMMENT ON COLUMN secret_rooms.xp_multiplier IS 'XP multiplier percentage for room activities (0-1000)';

-- Insert sample data for testing (optional)
-- This demonstrates the new features
INSERT INTO secret_rooms (
    creator_id, 
    name, 
    description, 
    room_code, 
    is_private, 
    enable_pseudonyms,
    fake_name_theme,
    xp_multiplier,
    moderation_settings,
    reaction_metrics,
    expires_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Cosmic Gossip Chamber',
    'A space-themed secret room for anonymous cosmic conversations',
    'COSMIC42',
    true,
    true,
    'space',
    50, -- 50% XP bonus
    '{
        "creatorModPrivileges": true,
        "autoModeration": true,
        "voiceModerationQueue": true,
        "maxViolationsBeforeAutoDelete": 3,
        "pseudonymDecryption": true
    }'::jsonb,
    '{
        "totalReactions": 0,
        "trendingScore": 0,
        "lastTrendingUpdate": "' || NOW() || '"
    }'::jsonb,
    NOW() + INTERVAL '24 hours' -- Expires in 24 hours
) ON CONFLICT DO NOTHING;

COMMIT;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW mv_trending_secret_rooms;