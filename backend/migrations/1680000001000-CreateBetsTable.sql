CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outcome VARCHAR NOT NULL,
    stakes DECIMAL(18,7) NOT NULL,
    user_id UUID NOT NULL,
    tx_id VARCHAR,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);