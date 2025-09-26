-- Create listings table for marketplace
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_id VARCHAR(255) NOT NULL,
    price DECIMAL(18,7) NOT NULL CHECK (price >= 0),
    seller_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active listings
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(is_active) WHERE is_active = true;

-- Create index for seller lookups
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);