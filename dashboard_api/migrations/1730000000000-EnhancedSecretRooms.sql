-- Enhanced Secret Rooms Migration
-- Add new columns for enhanced secret room functionality

-- Add status enum type first
DO $$ BEGIN
    CREATE TYPE room_status_enum AS ENUM ('active', 'expired', 'deleted', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to rooms table for enhanced secret room functionality
ALTER TABLE rooms 
  ADD COLUMN IF NOT EXISTS status room_status_enum DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS enable_pseudonyms BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS fake_name_theme VARCHAR(50),
  ADD COLUMN IF NOT EXISTS xp_multiplier DECIMAL(3,1) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS settings JSONB,
  ADD COLUMN IF NOT EXISTS moderation_settings JSONB,
  ADD COLUMN IF NOT EXISTS reaction_metrics JSONB,
  ADD COLUMN IF NOT EXISTS room_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP,
  ADD COLUMN IF NOT EXISTS scheduler_data JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_enable_pseudonyms ON rooms(enable_pseudonyms);
CREATE INDEX IF NOT EXISTS idx_rooms_fake_name_theme ON rooms(fake_name_theme);
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_last_activity ON rooms(last_activity);
CREATE INDEX IF NOT EXISTS idx_rooms_expires_at ON rooms(expires_at);

-- Create composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_rooms_type_status ON rooms(type, status);
CREATE INDEX IF NOT EXISTS idx_rooms_creator_status ON rooms(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_rooms_activity_metrics ON rooms(last_activity, activity_level);

-- Add constraints
ALTER TABLE rooms ADD CONSTRAINT IF NOT EXISTS check_xp_multiplier_range 
  CHECK (xp_multiplier >= 0.1 AND xp_multiplier <= 10.0);

ALTER TABLE rooms ADD CONSTRAINT IF NOT EXISTS check_room_code_format 
  CHECK (room_code IS NULL OR (room_code ~ '^[A-Z0-9]{6,12}$'));

-- Update existing records to have default values
UPDATE rooms 
SET 
  status = 'active',
  enable_pseudonyms = false,
  xp_multiplier = 1.0,
  settings = '{}',
  moderation_settings = '{}',
  reaction_metrics = '{}'
WHERE status IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN rooms.status IS 'Current status of the room (active, expired, deleted, suspended)';
COMMENT ON COLUMN rooms.enable_pseudonyms IS 'Whether pseudonym generation is enabled for this room';
COMMENT ON COLUMN rooms.fake_name_theme IS 'Theme for fake name generation (default, space, animals, colors, cyber, mythical)';
COMMENT ON COLUMN rooms.xp_multiplier IS 'XP multiplier for activities in this room (0.1 to 10.0)';
COMMENT ON COLUMN rooms.settings IS 'JSON object containing room-specific settings (allowAnonymous, autoDelete, etc.)';
COMMENT ON COLUMN rooms.moderation_settings IS 'JSON object containing moderation configuration';
COMMENT ON COLUMN rooms.reaction_metrics IS 'JSON object containing reaction statistics and metrics';
COMMENT ON COLUMN rooms.room_code IS 'Unique alphanumeric code for room access';
COMMENT ON COLUMN rooms.last_activity IS 'Timestamp of last activity in the room';
COMMENT ON COLUMN rooms.scheduler_data IS 'JSON object containing scheduler-related data and job information';

-- Create function to generate room codes
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS VARCHAR(8) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(8) := '';
    i INT;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate room codes for SECRET rooms
CREATE OR REPLACE FUNCTION auto_generate_room_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'secret' AND NEW.room_code IS NULL THEN
        NEW.room_code := generate_room_code();
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM rooms WHERE room_code = NEW.room_code) LOOP
            NEW.room_code := generate_room_code();
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_room_code
    BEFORE INSERT ON rooms
    FOR EACH ROW
    WHEN (NEW.type = 'secret')
    EXECUTE FUNCTION auto_generate_room_code();

-- Create function to update last_activity timestamp
CREATE OR REPLACE FUNCTION update_room_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rooms 
    SET last_activity = NOW()
    WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Assuming we have messages table, create trigger to update room activity
-- This will be adjusted based on actual table structure
-- CREATE TRIGGER trigger_update_room_activity
--     AFTER INSERT ON messages
--     FOR EACH ROW
--     EXECUTE FUNCTION update_room_last_activity();

-- Create view for active secret rooms with enhanced metrics
CREATE OR REPLACE VIEW active_secret_rooms AS
SELECT 
    r.*,
    COALESCE((r.reaction_metrics->>'totalReactions')::INTEGER, 0) as total_reactions,
    COALESCE((r.reaction_metrics->>'averageReactionsPerMessage')::DECIMAL, 0) as avg_reactions_per_message,
    CASE 
        WHEN r.last_activity > NOW() - INTERVAL '1 hour' THEN 'very_active'
        WHEN r.last_activity > NOW() - INTERVAL '6 hours' THEN 'active'
        WHEN r.last_activity > NOW() - INTERVAL '24 hours' THEN 'moderate'
        ELSE 'low'
    END as activity_status,
    CASE 
        WHEN r.expires_at IS NOT NULL AND r.expires_at < NOW() THEN true
        ELSE false
    END as is_expired
FROM rooms r
WHERE r.type = 'secret' 
  AND r.status = 'active'
  AND (r.expires_at IS NULL OR r.expires_at > NOW());

-- Create view for rooms needing cleanup (expired but not deleted)
CREATE OR REPLACE VIEW rooms_for_cleanup AS
SELECT 
    r.*,
    EXTRACT(EPOCH FROM (NOW() - r.expires_at)) / 3600 as hours_past_expiry
FROM rooms r
WHERE r.status = 'active'
  AND r.expires_at IS NOT NULL 
  AND r.expires_at < NOW()
  AND (r.settings->>'autoDelete')::BOOLEAN = true;

-- Grant necessary permissions (adjust as needed for your user roles)
-- GRANT SELECT, INSERT, UPDATE ON rooms TO app_user;
-- GRANT USAGE ON SEQUENCE rooms_id_seq TO app_user;
-- GRANT SELECT ON active_secret_rooms TO app_user;
-- GRANT SELECT ON rooms_for_cleanup TO cleanup_job;

-- Create stored procedure for batch room cleanup (used by scheduler)
CREATE OR REPLACE FUNCTION cleanup_expired_rooms(
    batch_size INTEGER DEFAULT 100,
    max_age_hours INTEGER DEFAULT 168 -- 1 week default
)
RETURNS TABLE(
    processed INTEGER,
    deleted INTEGER,
    errors INTEGER,
    error_details TEXT[]
) AS $$
DECLARE
    room_record RECORD;
    deleted_count INTEGER := 0;
    processed_count INTEGER := 0;
    error_count INTEGER := 0;
    error_list TEXT[] := ARRAY[]::TEXT[];
BEGIN
    FOR room_record IN 
        SELECT r.id, r.name, r.expires_at
        FROM rooms_for_cleanup r
        WHERE EXTRACT(EPOCH FROM (NOW() - r.expires_at)) / 3600 <= max_age_hours
        LIMIT batch_size
    LOOP
        BEGIN
            processed_count := processed_count + 1;
            
            -- Update status to deleted instead of hard delete for audit trail
            UPDATE rooms 
            SET status = 'deleted',
                updated_at = NOW(),
                scheduler_data = COALESCE(scheduler_data, '{}'::jsonb) || 
                    jsonb_build_object('deleted_at', NOW(), 'deleted_by', 'scheduler')
            WHERE id = room_record.id;
            
            deleted_count := deleted_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            error_list := array_append(error_list, 
                format('Room %s (%s): %s', room_record.id, room_record.name, SQLERRM)
            );
        END;
    END LOOP;
    
    RETURN QUERY SELECT processed_count, deleted_count, error_count, error_list;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON FUNCTION cleanup_expired_rooms IS 'Batch cleanup function for expired secret rooms, used by the scheduler service';
COMMENT ON VIEW active_secret_rooms IS 'View of currently active secret rooms with computed metrics';
COMMENT ON VIEW rooms_for_cleanup IS 'View of rooms that need to be cleaned up due to expiry';

-- Performance optimization: Analyze tables after migration
-- ANALYZE rooms;