-- Create intent_logs table
CREATE TABLE IF NOT EXISTS intent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    chains JSONB NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_intent_logs_user_id ON intent_logs(user_id);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_intent_logs_created_at ON intent_logs(created_at);