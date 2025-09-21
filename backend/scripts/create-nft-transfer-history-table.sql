-- Create NFT transfer history table for detailed transfer logging
CREATE TABLE IF NOT EXISTS nft_transfer_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID NOT NULL,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    from_user_id UUID,
    to_user_id UUID,
    transaction_id VARCHAR(255) NOT NULL,
    block_number BIGINT,
    gas_used BIGINT,
    transfer_type VARCHAR(20) NOT NULL CHECK (transfer_type IN ('mint', 'transfer', 'burn')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_nft_transfer_history_nft_id FOREIGN KEY (nft_id) REFERENCES nfts(id) ON DELETE CASCADE,
    CONSTRAINT fk_nft_transfer_history_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_nft_transfer_history_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_nft_id ON nft_transfer_history(nft_id);
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_from_user ON nft_transfer_history(from_user_id);
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_to_user ON nft_transfer_history(to_user_id);
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_transaction ON nft_transfer_history(transaction_id);
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_timestamp ON nft_transfer_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_type ON nft_transfer_history(transfer_type);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_nft_timestamp ON nft_transfer_history(nft_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_nft_transfer_history_user_timestamp ON nft_transfer_history(from_user_id, timestamp DESC);

-- Add comments for documentation
COMMENT ON TABLE nft_transfer_history IS 'Detailed history of all NFT transfers including mints, transfers, and burns';
COMMENT ON COLUMN nft_transfer_history.from_address IS 'Source blockchain address';
COMMENT ON COLUMN nft_transfer_history.to_address IS 'Destination blockchain address';
COMMENT ON COLUMN nft_transfer_history.transfer_type IS 'Type of transfer: mint (creation), transfer (ownership change), burn (destruction)';
COMMENT ON COLUMN nft_transfer_history.metadata IS 'Additional transfer metadata like gas fees, block info, etc.';
