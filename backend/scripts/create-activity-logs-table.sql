-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    metadata JSONB,
    room_id VARCHAR(255),
    target_user_id UUID,
    amount DECIMAL(10, 2),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id_created_at ON activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_created_at ON activity_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_room_id ON activity_logs(room_id) WHERE room_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_activity_logs_target_user_id ON activity_logs(target_user_id) WHERE target_user_id IS NOT NULL;

-- Add foreign key constraints (assuming users table exists)
-- ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_logs_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_logs_target_user_id FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create enum type for actions
DO $$ BEGIN
    CREATE TYPE activity_action AS ENUM (
        'message_sent',
        'message_received',
        'tip_sent',
        'tip_received',
        'room_joined',
        'room_left',
        'profile_updated',
        'badge_earned',
        'level_up',
        'nft_minted',
        'nft_transferred',
        'login',
        'logout'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the action column to use the enum
ALTER TABLE activity_logs ALTER COLUMN action TYPE activity_action USING action::activity_action;
