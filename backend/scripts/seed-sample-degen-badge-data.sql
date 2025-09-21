-- Seed sample data for degen badge system testing
-- This script creates sample users and badge configurations

-- Insert sample users (if users table exists)
-- INSERT INTO users (id, username, email, stellar_account_id) VALUES
-- ('550e8400-e29b-41d4-a716-446655440000', 'degen_master', 'degen@whisper.com', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
-- ('550e8400-e29b-41d4-a716-446655440001', 'high_roller_1', 'roller1@whisper.com', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXY'),
-- ('550e8400-e29b-41d4-a716-446655440002', 'risk_taker_1', 'risk1@whisper.com', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXZ'),
-- ('550e8400-e29b-41d4-a716-446655440003', 'whale_hunter', 'whale@whisper.com', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXA');

-- Clear existing sample data
DELETE FROM degen_badges WHERE "userId" IN (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003'
);

-- Insert comprehensive sample badge data
INSERT INTO degen_badges (id, "userId", badge_type, rarity, criteria, tx_id, stellar_asset_code, stellar_asset_issuer, description, image_url, reward_amount, is_active, created_at, updated_at) VALUES

-- High Roller badges
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'high_roller', 'rare', 
 '{"minAmount": 10000, "timeframe": "24h", "conditions": ["single_bet"], "achievedAt": "2024-01-15T10:30:00Z", "achievementData": {"amount": 15000, "game": "poker"}}', 
 'stellar-tx-high-roller-001', 'DGNHR', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'Awarded for placing a single bet of 10,000+ tokens', '/badges/high-roller.png', 100.0, true, 
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

-- Risk Taker badges
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'risk_taker', 'common', 
 '{"riskLevel": 8, "conditions": ["high_risk_position"], "achievedAt": "2024-01-16T14:20:00Z", "achievementData": {"riskLevel": 9, "position": "all_in"}}', 
 'stellar-tx-risk-taker-001', 'DGNRT', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'Awarded for taking high-risk positions', '/badges/risk-taker.png', 50.0, true, 
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'risk_taker', 'common', 
 '{"riskLevel": 8, "conditions": ["high_risk_position"], "achievedAt": "2024-01-17T09:15:00Z", "achievementData": {"riskLevel": 8, "position": "leveraged"}}', 
 'stellar-tx-risk-taker-002', 'DGNRT', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'Awarded for taking high-risk positions', '/badges/risk-taker.png', 50.0, true, 
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Streak Master badge
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'streak_master', 'epic', 
 '{"streakLength": 10, "riskLevel": 8, "conditions": ["consecutive_wins"], "achievedAt": "2024-01-18T16:45:00Z", "achievementData": {"streakLength": 12, "totalWinnings": 50000}}', 
 'stellar-tx-streak-master-001', 'DGNSM', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'Awarded for 10 consecutive high-risk wins', '/badges/streak-master.png', 500.0, true, 
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Whale Hunter badge
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 'whale_hunter', 'epic', 
 '{"minAmount": 50000, "conditions": ["beat_whale"], "achievedAt": "2024-01-19T20:30:00Z", "achievementData": {"defeatedWhale": "whale_user_123", "winAmount": 75000}}', 
 'stellar-tx-whale-hunter-001', 'DGNWH', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'Awarded for defeating whale opponents', '/badges/whale-hunter.png', 750.0, true, 
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Diamond Hands badge
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', 'diamond_hands', 'rare', 
 '{"timeframe": "24h", "conditions": ["hold_under_pressure"], "achievedAt": "2024-01-20T12:00:00Z", "achievementData": {"holdDuration": 86400000, "pressureEvents": 5}}', 
 'stellar-tx-diamond-hands-001', 'DGNDH', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'Awarded for holding positions under pressure', '/badges/diamond-hands.png', 200.0, true, 
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Degen Legend badge (ultimate achievement)
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440000', 'degen_legend', 'legendary', 
 '{"minAmount": 100000, "streakLength": 20, "riskLevel": 10, "timeframe": "7d", "achievedAt": "2024-01-21T18:00:00Z", "achievementData": {"totalVolume": 500000, "maxStreak": 25, "legendaryMoments": 3}}', 
 'stellar-tx-degen-legend-001', 'DGNLG', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
 'The ultimate degen achievement - reserved for true legends', '/badges/degen-legend.png', 2500.0, true, 
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert some inactive/historical badges for testing
INSERT INTO degen_badges (id, "userId", badge_type, rarity, criteria, description, image_url, reward_amount, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440002', 'high_roller', 'rare', 
 '{"minAmount": 5000, "timeframe": "24h", "conditions": ["single_bet"], "achievedAt": "2024-01-10T08:00:00Z"}', 
 'Old high roller badge (deactivated)', '/badges/high-roller-old.png', 75.0, false, 
 NOW() - INTERVAL '12 days', NOW() - INTERVAL '8 days');

-- Create some badge statistics views for analytics
CREATE OR REPLACE VIEW degen_badge_stats AS
SELECT 
    badge_type,
    rarity,
    COUNT(*) as total_awarded,
    COUNT(DISTINCT "userId") as unique_recipients,
    SUM(reward_amount) as total_rewards_distributed,
    AVG(reward_amount) as avg_reward_amount,
    MIN(created_at) as first_awarded,
    MAX(created_at) as last_awarded
FROM degen_badges 
WHERE is_active = true
GROUP BY badge_type, rarity
ORDER BY 
    CASE rarity 
        WHEN 'legendary' THEN 4 
        WHEN 'epic' THEN 3 
        WHEN 'rare' THEN 2 
        WHEN 'common' THEN 1 
    END DESC,
    total_awarded DESC;

-- Create user badge summary view
CREATE OR REPLACE VIEW user_badge_summary AS
SELECT 
    "userId",
    COUNT(*) as total_badges,
    COUNT(CASE WHEN rarity = 'legendary' THEN 1 END) as legendary_badges,
    COUNT(CASE WHEN rarity = 'epic' THEN 1 END) as epic_badges,
    COUNT(CASE WHEN rarity = 'rare' THEN 1 END) as rare_badges,
    COUNT(CASE WHEN rarity = 'common' THEN 1 END) as common_badges,
    SUM(reward_amount) as total_rewards,
    MAX(created_at) as latest_badge_date,
    ARRAY_AGG(badge_type ORDER BY created_at DESC) as badge_types
FROM degen_badges 
WHERE is_active = true
GROUP BY "userId"
ORDER BY total_rewards DESC, total_badges DESC;

-- Display sample data summary
SELECT 'Sample Data Summary' as info;
SELECT 
    'Total Active Badges' as metric,
    COUNT(*) as value
FROM degen_badges 
WHERE is_active = true;

SELECT 
    'Badges by Rarity' as metric,
    rarity,
    COUNT(*) as count
FROM degen_badges 
WHERE is_active = true
GROUP BY rarity
ORDER BY 
    CASE rarity 
        WHEN 'legendary' THEN 4 
        WHEN 'epic' THEN 3 
        WHEN 'rare' THEN 2 
        WHEN 'common' THEN 1 
    END DESC;

SELECT 
    'Top Badge Recipients' as metric,
    "userId",
    total_badges,
    total_rewards
FROM user_badge_summary
LIMIT 5;

-- Show the views we created
SELECT 'Badge Statistics View' as info;
SELECT * FROM degen_badge_stats;

SELECT 'User Badge Summary View' as info;
SELECT * FROM user_badge_summary;
