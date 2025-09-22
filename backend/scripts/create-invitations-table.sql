-- Create invitations table for secret room invitation system
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    inviter_id UUID NOT NULL,
    invitee_id UUID NULL,
    code VARCHAR(12) UNIQUE NOT NULL,
    message VARCHAR(255) NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    stellar_tx_id VARCHAR(255) NULL,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER DEFAULT 1,
    metadata JSONB NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);
CREATE INDEX IF NOT EXISTS idx_invitations_room_inviter ON invitations(room_id, inviter_id);
CREATE INDEX IF NOT EXISTS idx_invitations_expires_at ON invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_invitee ON invitations(invitee_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invitations_updated_at
    BEFORE UPDATE ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_invitations_updated_at();

-- Create function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS INTEGER AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE invitations 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE invitations IS 'Stores invitation codes for secret room access';
COMMENT ON COLUMN invitations.code IS 'Unique 12-character invitation code';
COMMENT ON COLUMN invitations.room_id IS 'ID of the secret room being invited to';
COMMENT ON COLUMN invitations.inviter_id IS 'ID of the user who created the invitation';
COMMENT ON COLUMN invitations.invitee_id IS 'ID of the user who accepted the invitation (if any)';
COMMENT ON COLUMN invitations.stellar_tx_id IS 'Stellar transaction ID for on-chain verification';
COMMENT ON COLUMN invitations.usage_count IS 'Number of times this invitation has been used';
COMMENT ON COLUMN invitations.max_usage IS 'Maximum number of times this invitation can be used';
