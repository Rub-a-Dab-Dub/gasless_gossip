-- Seed sample NFT data for testing
-- This script creates sample collections and NFTs for development and testing

-- Insert sample NFT collection
INSERT INTO nft_collections (
    id,
    name,
    symbol,
    description,
    metadata,
    contract_address,
    creator_address,
    total_supply,
    max_supply,
    floor_price,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Whisper Genesis Collection',
    'WGC',
    'The first collection of Whisper collectibles, featuring unique characters and rare items from the Whisper universe.',
    '{
        "name": "Whisper Genesis Collection",
        "description": "The first collection of Whisper collectibles, featuring unique characters and rare items from the Whisper universe.",
        "image": "https://example.com/collections/whisper-genesis.png",
        "banner_image": "https://example.com/collections/whisper-genesis-banner.png",
        "external_link": "https://whisper.com/collections/genesis",
        "seller_fee_basis_points": 250,
        "fee_recipient": "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU"
    }'::jsonb,
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    0,
    10000,
    '5.0000000',
    true,
    NOW(),
    NOW()
) ON CONFLICT (name) DO NOTHING;

-- Insert sample users for testing (assuming users table exists)
INSERT INTO users (
    id,
    username,
    email,
    stellar_account_id,
    created_at,
    updated_at
) VALUES 
(
    '123e4567-e89b-12d3-a456-426614174000',
    'test_user_1',
    'test1@example.com',
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    NOW(),
    NOW()
),
(
    '987fcdeb-51a2-43d1-9f12-345678901234',
    'test_user_2',
    'test2@example.com',
    'GDQJUTQYK2MQX2VGDR2FYWLIYAQIEGXTQVTFEMGH2BEWFG4BRUY3SSHP',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample NFTs
INSERT INTO nfts (
    id,
    user_id,
    metadata,
    tx_id,
    contract_address,
    token_id,
    stellar_asset_code,
    stellar_asset_issuer,
    transfer_logs,
    mint_price,
    current_owner,
    rarity_score,
    collection_id,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174000',
    '{
        "name": "Whisper Hero #001",
        "description": "A legendary hero from the Whisper universe with unique powers and rare attributes.",
        "image": "https://example.com/nft-images/whisper-hero-001.png",
        "attributes": [
            {"trait_type": "Rarity", "value": "Legendary"},
            {"trait_type": "Background", "value": "Cosmic"},
            {"trait_type": "Eyes", "value": "Golden"},
            {"trait_type": "Weapon", "value": "Stellar Blade"},
            {"trait_type": "Power Level", "value": 95}
        ],
        "external_url": "https://whisper.com/heroes/001"
    }'::jsonb,
    'sample_tx_001_' || extract(epoch from now())::text,
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    'WHISPER001',
    'WHISPER001',
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    '[{
        "from": "mint",
        "to": "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
        "timestamp": "' || NOW()::text || '",
        "transactionId": "sample_tx_001_' || extract(epoch from now())::text || '"
    }]'::jsonb,
    '50.0000000',
    true,
    95.5,
    (SELECT id FROM nft_collections WHERE symbol = 'WGC' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174000',
    '{
        "name": "Whisper Companion #002",
        "description": "A loyal companion with mystical abilities and charming personality.",
        "image": "https://example.com/nft-images/whisper-companion-002.png",
        "attributes": [
            {"trait_type": "Rarity", "value": "Rare"},
            {"trait_type": "Background", "value": "Forest"},
            {"trait_type": "Eyes", "value": "Emerald"},
            {"trait_type": "Accessory", "value": "Magic Collar"},
            {"trait_type": "Loyalty", "value": 88}
        ],
        "external_url": "https://whisper.com/companions/002"
    }'::jsonb,
    'sample_tx_002_' || extract(epoch from now())::text,
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    'WHISPER002',
    'WHISPER002',
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    '[{
        "from": "mint",
        "to": "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
        "timestamp": "' || NOW()::text || '",
        "transactionId": "sample_tx_002_' || extract(epoch from now())::text || '"
    }]'::jsonb,
    '15.0000000',
    true,
    72.3,
    (SELECT id FROM nft_collections WHERE symbol = 'WGC' LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    '987fcdeb-51a2-43d1-9f12-345678901234',
    '{
        "name": "Whisper Artifact #003",
        "description": "An ancient artifact with mysterious powers from the old world.",
        "image": "https://example.com/nft-images/whisper-artifact-003.png",
        "attributes": [
            {"trait_type": "Rarity", "value": "Epic"},
            {"trait_type": "Background", "value": "Ancient Ruins"},
            {"trait_type": "Material", "value": "Ethereal Crystal"},
            {"trait_type": "Power", "value": "Time Manipulation"},
            {"trait_type": "Age", "value": 1000}
        ],
        "external_url": "https://whisper.com/artifacts/003"
    }'::jsonb,
    'sample_tx_003_' || extract(epoch from now())::text,
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    'WHISPER003',
    'WHISPER003',
    'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU',
    '[{
        "from": "mint",
        "to": "GDQJUTQYK2MQX2VGDR2FYWLIYAQIEGXTQVTFEMGH2BEWFG4BRUY3SSHP",
        "timestamp": "' || NOW()::text || '",
        "transactionId": "sample_tx_003_' || extract(epoch from now())::text || '"
    }]'::jsonb,
    '25.0000000',
    true,
    84.7,
    (SELECT id FROM nft_collections WHERE symbol = 'WGC' LIMIT 1),
    NOW(),
    NOW()
);

-- Insert sample transfer history
INSERT INTO nft_transfer_history (
    id,
    nft_id,
    from_address,
    to_address,
    from_user_id,
    to_user_id,
    transaction_id,
    transfer_type,
    timestamp,
    metadata,
    created_at
) SELECT 
    gen_random_uuid(),
    n.id,
    'mint',
    COALESCE(u.stellar_account_id, 'unknown'),
    NULL,
    n.user_id,
    n.tx_id,
    'mint',
    n.created_at,
    jsonb_build_object(
        'mintPrice', n.mint_price,
        'collectionId', n.collection_id
    ),
    n.created_at
FROM nfts n
LEFT JOIN users u ON n.user_id = u.id
WHERE NOT EXISTS (
    SELECT 1 FROM nft_transfer_history nth 
    WHERE nth.nft_id = n.id AND nth.transfer_type = 'mint'
);

-- Update collection total supply
UPDATE nft_collections 
SET total_supply = (
    SELECT COUNT(*) 
    FROM nfts 
    WHERE collection_id = nft_collections.id
)
WHERE symbol = 'WGC';

-- Add comments
COMMENT ON TABLE nfts IS 'Sample NFT data for testing and development';
COMMENT ON TABLE nft_collections IS 'Sample NFT collections for testing';
COMMENT ON TABLE nft_transfer_history IS 'Sample transfer history for testing';

-- Display summary
SELECT 
    'Sample data inserted successfully' as status,
    (SELECT COUNT(*) FROM nft_collections WHERE symbol = 'WGC') as collections_created,
    (SELECT COUNT(*) FROM nfts) as nfts_created,
    (SELECT COUNT(*) FROM nft_transfer_history) as transfer_records_created;
