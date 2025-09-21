-- Create degen_badges table
CREATE TABLE IF NOT EXISTS degen_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('high_roller', 'risk_taker', 'streak_master', 'whale_hunter', 'diamond_hands', 'degen_legend')),
    rarity VARCHAR(20) NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    criteria JSONB NOT NULL,
    tx_id VARCHAR(255),
    stellar_asset_code VARCHAR(12),
    stellar_asset_issuer VARCHAR(56),
    description TEXT,
    image_url TEXT,
    reward_amount DECIMAL(18, 7),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_degen_badges_user_id ON degen_badges("userId");
CREATE INDEX IF NOT EXISTS idx_degen_badges_badge_type ON degen_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_degen_badges_rarity ON degen_badges(rarity);
CREATE INDEX IF NOT EXISTS idx_degen_badges_created_at ON degen_badges(created_at);
CREATE INDEX IF NOT EXISTS idx_degen_badges_tx_id ON degen_badges(tx_id);

-- Create unique constraint to prevent duplicate badges for same criteria
CREATE UNIQUE INDEX IF NOT EXISTS idx_degen_badges_unique_user_type 
ON degen_badges("userId", badge_type) 
WHERE is_active = true;

-- Add foreign key constraint (assuming users table exists)
-- ALTER TABLE degen_badges ADD CONSTRAINT fk_degen_badges_user 
-- FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- Insert sample badge criteria configurations
INSERT INTO degen_badges (id, "userId", badge_type, rarity, criteria, description, image_url, reward_amount) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'high_roller', 'rare', 
 '{"minAmount": 10000, "timeframe": "24h", "conditions": ["single_bet"]}', 
 'Awarded for placing a single bet of 10,000+ tokens', 
 '/badges/high-roller.png', 100.0),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'streak_master', 'epic', 
 '{"streakLength": 10, "riskLevel": 8, "conditions": ["consecutive_wins"]}', 
 'Awarded for 10 consecutive high-risk wins', 
 '/badges/streak-master.png', 500.0),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'degen_legend', 'legendary', 
 '{"minAmount": 100000, "streakLength": 20, "riskLevel": 10, "timeframe": "7d"}', 
 'The ultimate degen achievement - reserved for true legends', 
 '/badges/degen-legend.png', 2500.0);
