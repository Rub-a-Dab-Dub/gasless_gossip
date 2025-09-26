-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    prediction VARCHAR(200) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
    outcome VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (outcome IN ('correct', 'incorrect', 'pending')),
    vote_count INTEGER NOT NULL DEFAULT 0,
    correct_votes INTEGER NOT NULL DEFAULT 0,
    incorrect_votes INTEGER NOT NULL DEFAULT 0,
    reward_pool DECIMAL(18,7) NOT NULL DEFAULT 0,
    reward_per_correct_vote DECIMAL(18,7) NOT NULL DEFAULT 0,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create prediction_votes table
CREATE TABLE IF NOT EXISTS prediction_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID NOT NULL,
    user_id UUID NOT NULL,
    is_correct BOOLEAN NOT NULL,
    reward_amount DECIMAL(18,7) NOT NULL DEFAULT 0,
    reward_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    tx_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(prediction_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_predictions_room_id ON predictions(room_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_status ON predictions(status);
CREATE INDEX IF NOT EXISTS idx_predictions_expires_at ON predictions(expires_at);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);

CREATE INDEX IF NOT EXISTS idx_prediction_votes_prediction_id ON prediction_votes(prediction_id);
CREATE INDEX IF NOT EXISTS idx_prediction_votes_user_id ON prediction_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_prediction_votes_is_correct ON prediction_votes(is_correct);
CREATE INDEX IF NOT EXISTS idx_prediction_votes_created_at ON prediction_votes(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_predictions_updated_at 
    BEFORE UPDATE ON predictions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
