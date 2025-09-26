-- Seed sample visit data for testing
-- This script creates sample rooms, users, and visits for testing the visit tracking system

-- Insert sample rooms (if you have a rooms table)
-- INSERT INTO rooms (id, name, description, created_at) VALUES
-- ('lobby', 'Main Lobby', 'Welcome area for all users', NOW()),
-- ('gaming-room', 'Gaming Room', 'Space for gaming discussions and activities', NOW()),
-- ('study-hall', 'Study Hall', 'Quiet space for learning and studying', NOW()),
-- ('music-lounge', 'Music Lounge', 'Share and discuss music', NOW()),
-- ('art-gallery', 'Art Gallery', 'Showcase and discuss artwork', NOW());

-- Insert sample visits with realistic patterns
WITH sample_data AS (
  SELECT 
    gen_random_uuid() as id,
    (ARRAY['lobby', 'gaming-room', 'study-hall', 'music-lounge', 'art-gallery'])[floor(random() * 5 + 1)] as room_id,
    (SELECT id FROM users ORDER BY random() LIMIT 1) as user_id,
    NOW() - (random() * interval '30 days') as created_at,
    floor(random() * 3540 + 60) as duration, -- 1 minute to 1 hour
    (floor(random() * 255) + 1) || '.' || 
    (floor(random() * 255) + 1) || '.' || 
    (floor(random() * 255) + 1) || '.' || 
    (floor(random() * 255) + 1) as ip_address,
    (ARRAY[
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    ])[floor(random() * 5 + 1)] as user_agent
  FROM generate_series(1, 1000) -- Generate 1000 sample visits
)
INSERT INTO visits (id, room_id, user_id, created_at, duration, ip_address, user_agent)
SELECT id, room_id, user_id, created_at, duration, ip_address, user_agent
FROM sample_data
WHERE user_id IS NOT NULL; -- Only insert if we have valid users

-- Create some concentrated activity for certain rooms during peak hours
INSERT INTO visits (room_id, user_id, created_at, duration, ip_address, user_agent)
SELECT 
  'lobby' as room_id,
  (SELECT id FROM users ORDER BY random() LIMIT 1) as user_id,
  NOW() - (random() * interval '7 days') + 
  (interval '1 hour' * (14 + floor(random() * 4))) as created_at, -- Peak hours 14-17 (2-5 PM)
  floor(random() * 1800 + 300) as duration, -- 5-35 minutes
  '192.168.1.' || floor(random() * 254 + 1) as ip_address,
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' as user_agent
FROM generate_series(1, 200) -- 200 peak hour visits
WHERE (SELECT COUNT(*) FROM users) > 0;

-- Add some weekend activity patterns
INSERT INTO visits (room_id, user_id, created_at, duration, ip_address, user_agent)
SELECT 
  (ARRAY['gaming-room', 'music-lounge'])[floor(random() * 2 + 1)] as room_id,
  (SELECT id FROM users ORDER BY random() LIMIT 1) as user_id,
  date_trunc('week', NOW()) + interval '5 days' + -- Saturday
  (interval '1 hour' * (10 + floor(random() * 12))) as created_at, -- 10 AM - 10 PM
  floor(random() * 7200 + 600) as duration, -- 10 minutes to 2 hours
  '10.0.0.' || floor(random() * 254 + 1) as ip_address,
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' as user_agent
FROM generate_series(1, 150) -- 150 weekend visits
WHERE (SELECT COUNT(*) FROM users) > 0;

-- Add some return visitor patterns (same users visiting same rooms)
WITH frequent_visitors AS (
  SELECT 
    (SELECT id FROM users ORDER BY random() LIMIT 1) as user_id,
    (ARRAY['study-hall', 'art-gallery'])[floor(random() * 2 + 1)] as preferred_room
  FROM generate_series(1, 20) -- 20 frequent visitors
)
INSERT INTO visits (room_id, user_id, created_at, duration, ip_address, user_agent)
SELECT 
  fv.preferred_room as room_id,
  fv.user_id,
  NOW() - (random() * interval '14 days') as created_at,
  floor(random() * 2400 + 600) as duration, -- 10-50 minutes
  '172.16.0.' || floor(random() * 254 + 1) as ip_address,
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36' as user_agent
FROM frequent_visitors fv
CROSS JOIN generate_series(1, 5); -- Each frequent visitor has 5 visits

-- Update statistics (if you have a materialized view or summary table)
-- REFRESH MATERIALIZED VIEW IF EXISTS visit_stats;

-- Display summary of inserted data
SELECT 
  'Total visits inserted' as metric,
  COUNT(*)::text as value
FROM visits
WHERE created_at >= NOW() - interval '1 hour'

UNION ALL

SELECT 
  'Unique rooms with visits' as metric,
  COUNT(DISTINCT room_id)::text as value
FROM visits

UNION ALL

SELECT 
  'Unique users with visits' as metric,
  COUNT(DISTINCT user_id)::text as value
FROM visits

UNION ALL

SELECT 
  'Date range of visits' as metric,
  MIN(created_at)::date || ' to ' || MAX(created_at)::date as value
FROM visits;
