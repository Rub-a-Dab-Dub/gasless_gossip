-- Create visits table for tracking room visits
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    duration INTEGER DEFAULT 1,
    
    -- Foreign key constraint
    CONSTRAINT fk_visits_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visits_room_id ON visits(room_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_room_user_date ON visits(room_id, user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_visits_room_date ON visits(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);

-- Create a composite index for unique visit counting
CREATE INDEX IF NOT EXISTS idx_visits_unique_counting ON visits(room_id, user_id, DATE(created_at));
