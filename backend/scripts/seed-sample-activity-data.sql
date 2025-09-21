-- Seed sample activity data for testing
-- This script creates sample users and activity logs for testing purposes

-- Insert sample users (if they don't exist)
INSERT INTO users (id, username, email, pseudonym, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alice_whisper', 'alice@example.com', 'CryptoAlice', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'bob_creator', 'bob@example.com', 'DigitalBob', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440003', 'charlie_social', 'charlie@example.com', 'SocialCharlie', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440004', 'diana_gamer', 'diana@example.com', 'GamerDiana', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440005', 'eve_artist', 'eve@example.com', 'ArtistEve', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample activity logs
INSERT INTO activity_logs (id, user_id, action, metadata, room_id, target_user_id, amount, created_at) VALUES
-- Alice's activities
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'login', '{"device": "desktop", "location": "New York"}', NULL, NULL, NULL, NOW() - INTERVAL '1 hour'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'room_joined', '{"roomType": "public"}', 'general', NULL, NULL, NOW() - INTERVAL '55 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'message_sent', '{"messageLength": 45, "hasMedia": false}', 'general', NULL, NULL, NOW() - INTERVAL '50 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'tip_sent', '{"currency": "USD", "reason": "great_content"}', 'general', '550e8400-e29b-41d4-a716-446655440002', 5.00, NOW() - INTERVAL '45 minutes'),

-- Bob's activities
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'login', '{"device": "mobile", "location": "Los Angeles"}', NULL, NULL, NULL, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'room_joined', '{"roomType": "public"}', 'gaming', NULL, NULL, NOW() - INTERVAL '1 hour 55 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'message_sent', '{"messageLength": 120, "hasMedia": true}', 'gaming', NULL, NULL, NOW() - INTERVAL '1 hour 50 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'tip_received', '{"currency": "USD", "from": "alice_whisper"}', 'general', '550e8400-e29b-41d4-a716-446655440001', 5.00, NOW() - INTERVAL '45 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'badge_earned', '{"badgeType": "first_tip_received", "rarity": "common"}', NULL, NULL, NULL, NOW() - INTERVAL '44 minutes'),

-- Charlie's activities
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'login', '{"device": "tablet", "location": "Chicago"}', NULL, NULL, NULL, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'room_joined', '{"roomType": "public"}', 'music', NULL, NULL, NOW() - INTERVAL '2 hours 55 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'message_sent', '{"messageLength": 80, "hasMedia": false}', 'music', NULL, NULL, NOW() - INTERVAL '2 hours 50 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'room_left', '{"duration": 300}', 'music', NULL, NULL, NOW() - INTERVAL '2 hours 45 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'room_joined', '{"roomType": "public"}', 'tech', NULL, NULL, NOW() - INTERVAL '2 hours 40 minutes'),

-- Diana's activities
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'login', '{"device": "desktop", "location": "Miami"}', NULL, NULL, NULL, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'profile_updated', '{"fields": ["bio", "avatar"], "changes": 2}', NULL, NULL, NULL, NOW() - INTERVAL '3 hours 55 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'room_joined', '{"roomType": "public"}', 'gaming', NULL, NULL, NOW() - INTERVAL '3 hours 50 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'message_sent', '{"messageLength": 200, "hasMedia": true}', 'gaming', NULL, NULL, NOW() - INTERVAL '3 hours 45 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'level_up', '{"newLevel": 5, "xpGained": 250, "previousLevel": 4}', NULL, NULL, NULL, NOW() - INTERVAL '3 hours 40 minutes'),

-- Eve's activities
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'login', '{"device": "mobile", "location": "Seattle"}', NULL, NULL, NULL, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'room_joined', '{"roomType": "public"}', 'general', NULL, NULL, NOW() - INTERVAL '4 hours 55 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'message_sent', '{"messageLength": 150, "hasMedia": true}', 'general', NULL, NULL, NOW() - INTERVAL '4 hours 50 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'nft_minted', '{"tokenId": "art_001", "collection": "digital_art", "price": 0.1}', NULL, NULL, NULL, NOW() - INTERVAL '4 hours 45 minutes'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'badge_earned', '{"badgeType": "first_nft_creator", "rarity": "rare"}', NULL, NULL, NULL, NOW() - INTERVAL '4 hours 44 minutes'),

-- Additional historical activities for better analytics
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'message_sent', '{"messageLength": 60}', 'general', NULL, NULL, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'message_sent', '{"messageLength": 90}', 'tech', NULL, NULL, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'tip_sent', '{"currency": "USD"}', 'gaming', '550e8400-e29b-41d4-a716-446655440004', 10.00, NOW() - INTERVAL '3 days'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'room_joined', '{}', 'music', NULL, NULL, NOW() - INTERVAL '4 days'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'level_up', '{"newLevel": 4, "xpGained": 200}', NULL, NULL, NULL, NOW() - INTERVAL '5 days'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'message_sent', '{"messageLength": 75}', 'general', NULL, NULL, NOW() - INTERVAL '6 days'),

-- Weekend activities for time-based analytics
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'login', '{"device": "mobile"}', NULL, NULL, NULL, NOW() - INTERVAL '2 days' + INTERVAL '10 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'login', '{"device": "desktop"}', NULL, NULL, NULL, NOW() - INTERVAL '2 days' + INTERVAL '14 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'login', '{"device": "tablet"}', NULL, NULL, NULL, NOW() - INTERVAL '2 days' + INTERVAL '16 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'login', '{"device": "mobile"}', NULL, NULL, NULL, NOW() - INTERVAL '2 days' + INTERVAL '18 hours'),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'login', '{"device": "desktop"}', NULL, NULL, NULL, NOW() - INTERVAL '2 days' + INTERVAL '20 hours');

-- Update statistics
ANALYZE activity_logs;

-- Display summary
SELECT 
    'Sample Data Summary' as info,
    COUNT(*) as total_activities,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT action) as unique_actions,
    MIN(created_at) as earliest_activity,
    MAX(created_at) as latest_activity
FROM activity_logs;

-- Display action breakdown
SELECT 
    action,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM activity_logs), 2) as percentage
FROM activity_logs 
GROUP BY action 
ORDER BY count DESC;
