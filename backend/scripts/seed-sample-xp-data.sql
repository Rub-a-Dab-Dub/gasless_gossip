-- Sample XP data for testing level progression
-- This script creates sample users and applies XP activities to test the level system

-- First, let's create some sample users (assuming users table exists)
INSERT INTO users (id, username, email, pseudonym, stellar_account_id, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alice_explorer', 'alice@example.com', 'Alice the Explorer', 'GAALICE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', true),
('550e8400-e29b-41d4-a716-446655440002', 'bob_achiever', 'bob@example.com', 'Bob the Achiever', 'GABBOB123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890A', true),
('550e8400-e29b-41d4-a716-446655440003', 'charlie_champion', 'charlie@example.com', 'Charlie Champion', 'GACCHARLIE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456', true),
('550e8400-e29b-41d4-a716-446655440004', 'diana_dynamo', 'diana@example.com', 'Diana Dynamo', 'GADDIANA123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567', true),
('550e8400-e29b-41d4-a716-446655440005', 'eve_expert', 'eve@example.com', 'Eve the Expert', 'GAEEVE123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678', true)
ON CONFLICT (id) DO NOTHING;

-- Create initial level records for sample users
INSERT INTO levels (user_id, level, current_xp, total_xp, xp_threshold, is_level_up_pending) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 0, 0, 100, false),
('550e8400-e29b-41d4-a716-446655440002', 1, 0, 0, 100, false),
('550e8400-e29b-41d4-a716-446655440003', 1, 0, 0, 100, false),
('550e8400-e29b-41d4-a716-446655440004', 1, 0, 0, 100, false),
('550e8400-e29b-41d4-a716-446655440005', 1, 0, 0, 100, false)
ON CONFLICT DO NOTHING;

-- Create a temporary table to track XP activities for testing
CREATE TEMP TABLE sample_xp_activities (
    user_id UUID,
    xp_amount INTEGER,
    source VARCHAR(50),
    description TEXT,
    apply_order INTEGER
);

-- Insert sample XP activities in the order they should be applied
INSERT INTO sample_xp_activities (user_id, xp_amount, source, description, apply_order) VALUES
-- Alice - Moderate progression (should reach Level 3-4)
('550e8400-e29b-41d4-a716-446655440001', 50, 'daily_login', 'Daily login bonus', 1),
('550e8400-e29b-41d4-a716-446655440001', 75, 'quest_completion', 'Completed beginner quest', 2),
('550e8400-e29b-41d4-a716-446655440001', 100, 'achievement', 'First achievement unlocked', 3),
('550e8400-e29b-41d4-a716-446655440001', 150, 'quest_completion', 'Completed intermediate quest', 4),
('550e8400-e29b-41d4-a716-446655440001', 25, 'daily_login', 'Daily login streak', 5),

-- Bob - High progression (should reach Level 6-7)
('550e8400-e29b-41d4-a716-446655440002', 200, 'quest_completion', 'Completed advanced quest', 6),
('550e8400-e29b-41d4-a716-446655440002', 300, 'achievement', 'Speed runner achievement', 7),
('550e8400-e29b-41d4-a716-446655440002', 150, 'social_interaction', 'Helped other users', 8),
('550e8400-e29b-41d4-a716-446655440002', 250, 'quest_completion', 'Completed expert quest', 9),
('550e8400-e29b-41d4-a716-446655440002', 400, 'achievement', 'Master achievement unlocked', 10),
('550e8400-e29b-41d4-a716-446655440002', 500, 'special_event', 'Special event participation', 11),

-- Charlie - Very high progression (should reach Level 10+)
('550e8400-e29b-41d4-a716-446655440003', 1000, 'achievement', 'Legendary achievement', 12),
('550e8400-e29b-41d4-a716-446655440003', 750, 'quest_completion', 'Epic quest completion', 13),
('550e8400-e29b-41d4-a716-446655440003', 500, 'social_interaction', 'Community leader bonus', 14),
('550e8400-e29b-41d4-a716-446655440003', 1200, 'special_event', 'Tournament winner', 15),
('550e8400-e29b-41d4-a716-446655440003', 800, 'achievement', 'Perfect score achievement', 16),
('550e8400-e29b-41d4-a716-446655440003', 2000, 'milestone', 'Major milestone reached', 17),
('550e8400-e29b-41d4-a716-446655440003', 1500, 'quest_completion', 'Ultimate challenge completed', 18),

-- Diana - Moderate-high progression (should reach Level 5-6)
('550e8400-e29b-41d4-a716-446655440004', 300, 'quest_completion', 'Story mode completion', 19),
('550e8400-e29b-41d4-a716-446655440004', 200, 'achievement', 'Collector achievement', 20),
('550e8400-e29b-41d4-a716-446655440004', 150, 'daily_login', 'Weekly login bonus', 21),
('550e8400-e29b-41d4-a716-446655440004', 400, 'special_event', 'Seasonal event', 22),
('550e8400-e29b-41d4-a716-446655440004', 250, 'social_interaction', 'Mentorship bonus', 23),

-- Eve - Low-moderate progression (should reach Level 2-3)
('550e8400-e29b-41d4-a716-446655440005', 75, 'daily_login', 'First week bonus', 24),
('550e8400-e29b-41d4-a716-446655440005', 100, 'quest_completion', 'Tutorial completion', 25),
('550e8400-e29b-41d4-a716-446655440005', 50, 'achievement', 'First steps achievement', 26),
('550e8400-e29b-41d4-a716-446655440005', 125, 'quest_completion', 'First real quest', 27);

-- Function to calculate level based on total XP
CREATE OR REPLACE FUNCTION calculate_level_for_xp(total_xp INTEGER)
RETURNS TABLE(level INTEGER, current_xp INTEGER, xp_threshold INTEGER) AS $$
DECLARE
    calculated_level INTEGER := 1;
    level_threshold INTEGER;
    next_threshold INTEGER;
BEGIN
    -- Find the appropriate level based on XP thresholds
    SELECT t.level, t.xp_required INTO calculated_level, level_threshold
    FROM xp_thresholds t
    WHERE t.xp_required <= total_xp AND t.is_active = true
    ORDER BY t.level DESC
    LIMIT 1;
    
    -- Get next level threshold
    SELECT t.xp_required INTO next_threshold
    FROM xp_thresholds t
    WHERE t.level = calculated_level + 1 AND t.is_active = true;
    
    -- If no next threshold found, use a high value
    IF next_threshold IS NULL THEN
        next_threshold := level_threshold + 10000;
    END IF;
    
    RETURN QUERY SELECT 
        calculated_level,
        total_xp - level_threshold,
        next_threshold;
END;
$$ LANGUAGE plpgsql;

-- Apply XP activities in order and update levels accordingly
DO $$
DECLARE
    activity RECORD;
    current_level_data RECORD;
    new_total_xp INTEGER;
    level_calc RECORD;
BEGIN
    -- Process each XP activity in order
    FOR activity IN 
        SELECT * FROM sample_xp_activities 
        ORDER BY apply_order
    LOOP
        -- Get current level data
        SELECT total_xp INTO new_total_xp
        FROM levels 
        WHERE user_id = activity.user_id;
        
        -- Add XP
        new_total_xp := new_total_xp + activity.xp_amount;
        
        -- Calculate new level
        SELECT * INTO level_calc FROM calculate_level_for_xp(new_total_xp);
        
        -- Update level record
        UPDATE levels 
        SET 
            total_xp = new_total_xp,
            level = level_calc.level,
            current_xp = level_calc.current_xp,
            xp_threshold = level_calc.xp_threshold,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = activity.user_id;
        
        -- Log the activity (in a real system, you'd store this in an activities table)
        RAISE NOTICE 'Applied % XP to user % from %. New level: %, Total XP: %', 
            activity.xp_amount, 
            activity.user_id, 
            activity.source, 
            level_calc.level, 
            new_total_xp;
    END LOOP;
END $$;

-- Display final results
SELECT 
    u.username,
    l.level,
    l.total_xp,
    l.current_xp,
    l.xp_threshold,
    ROUND((l.current_xp::DECIMAL / (l.xp_threshold - (l.total_xp - l.current_xp)) * 100), 1) as progress_percentage,
    CASE 
        WHEN l.level >= 20 THEN 'MAX LEVEL'
        ELSE (l.xp_threshold - l.current_xp)::TEXT || ' XP to next level'
    END as next_level_info
FROM users u
JOIN levels l ON u.id = l.user_id
WHERE u.id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005'
)
ORDER BY l.total_xp DESC;

-- Show leaderboard
SELECT 
    ROW_NUMBER() OVER (ORDER BY l.total_xp DESC) as rank,
    u.username,
    l.level,
    l.total_xp
FROM users u
JOIN levels l ON u.id = l.user_id
ORDER BY l.total_xp DESC
LIMIT 10;

-- Clean up temporary function
DROP FUNCTION calculate_level_for_xp(INTEGER);
