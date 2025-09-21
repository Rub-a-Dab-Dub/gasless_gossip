-- Create NFTs table for storing NFT metadata and transaction information
CREATE TABLE IF NOT EXISTS nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    metadata JSONB NOT NULL,
    tx_id VARCHAR(255) UNIQUE NOT NULL,
    contract_address VARCHAR(255) NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    stellar_asset_code VARCHAR(12),
    stellar_asset_issuer VARCHAR(56),
    transfer_logs JSONB DEFAULT '[]'::jsonb,
    mint_price DECIMAL(18, 7),
    current_owner BOOLEAN DEFAULT true,
    rarity_score DECIMAL(10, 2),
    collection_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_nfts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_nfts_user_id ON nfts(user_id);
CREATE INDEX IF NOT EXISTS idx_nfts_tx_id ON nfts(tx_id);
CREATE INDEX IF NOT EXISTS idx_nfts_contract_token ON nfts(contract_address, token_id);
CREATE INDEX IF NOT EXISTS idx_nfts_collection ON nfts(collection_id);
CREATE INDEX IF NOT EXISTS idx_nfts_created_at ON nfts(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nfts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nfts_updated_at
    BEFORE UPDATE ON nfts
    FOR EACH ROW
    EXECUTE FUNCTION update_nfts_updated_at();

-- Add comments for documentation
COMMENT ON TABLE nfts IS 'Stores NFT metadata and transaction information for collectibles';
COMMENT ON COLUMN nfts.metadata IS 'JSON metadata following NFT standards (name, description, image, attributes)';
COMMENT ON COLUMN nfts.tx_id IS 'Stellar transaction ID for the NFT mint operation';
COMMENT ON COLUMN nfts.transfer_logs IS 'Array of transfer history with timestamps and transaction IDs';
COMMENT ON COLUMN nfts.rarity_score IS 'Calculated rarity score based on attributes';
