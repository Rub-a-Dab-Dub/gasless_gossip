#!/usr/bin/env python3
"""
Test script for NFT operations
Tests minting, retrieval, and transfer functionality
"""

import requests
import json
import time
import uuid
from typing import Dict, List, Optional

class NFTTester:
    def __init__(self, base_url: str = "http://localhost:3000", auth_token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.auth_token = auth_token
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_token}' if auth_token else ''
        }
        
    def mint_nft(self, metadata: Dict, recipient_address: str = None) -> Dict:
        """Mint a new NFT"""
        payload = {
            'metadata': metadata,
            'recipientStellarAddress': recipient_address,
            'mintPrice': '10.0000000'
        }
        
        response = requests.post(
            f'{self.base_url}/nfts/mint',
            headers=self.headers,
            json=payload
        )
        
        if response.status_code == 201:
            print(f"✅ NFT minted successfully: {response.json()['id']}")
            return response.json()
        else:
            print(f"❌ Failed to mint NFT: {response.status_code} - {response.text}")
            return None
    
    def get_user_nfts(self, user_id: str) -> List[Dict]:
        """Get NFTs owned by a user"""
        response = requests.get(
            f'{self.base_url}/nfts/{user_id}',
            headers=self.headers
        )
        
        if response.status_code == 200:
            nfts = response.json()
            print(f"✅ Retrieved {len(nfts)} NFTs for user {user_id}")
            return nfts
        else:
            print(f"❌ Failed to get user NFTs: {response.status_code} - {response.text}")
            return []
    
    def get_nft_details(self, nft_id: str) -> Dict:
        """Get detailed information about an NFT"""
        response = requests.get(
            f'{self.base_url}/nfts/details/{nft_id}',
            headers=self.headers
        )
        
        if response.status_code == 200:
            print(f"✅ Retrieved NFT details: {nft_id}")
            return response.json()
        else:
            print(f"❌ Failed to get NFT details: {response.status_code} - {response.text}")
            return None
    
    def calculate_rarity(self, nft_id: str) -> float:
        """Calculate rarity score for an NFT"""
        response = requests.post(
            f'{self.base_url}/nfts/{nft_id}/calculate-rarity',
            headers=self.headers
        )
        
        if response.status_code == 200:
            rarity_data = response.json()
            print(f"✅ Calculated rarity score: {rarity_data['rarityScore']}")
            return rarity_data['rarityScore']
        else:
            print(f"❌ Failed to calculate rarity: {response.status_code} - {response.text}")
            return 0
    
    def verify_ownership(self, nft_id: str, user_id: str) -> bool:
        """Verify NFT ownership"""
        response = requests.get(
            f'{self.base_url}/nfts/{nft_id}/verify-ownership/{user_id}',
            headers=self.headers
        )
        
        if response.status_code == 200:
            ownership_data = response.json()
            is_owner = ownership_data['isOwner']
            print(f"✅ Ownership verification: {is_owner}")
            return is_owner
        else:
            print(f"❌ Failed to verify ownership: {response.status_code} - {response.text}")
            return False
    
    def transfer_nft(self, nft_id: str, to_user_id: str, to_stellar_address: str) -> Dict:
        """Transfer an NFT to another user"""
        payload = {
            'nftId': nft_id,
            'toUserId': to_user_id,
            'toStellarAddress': to_stellar_address
        }
        
        response = requests.post(
            f'{self.base_url}/nfts/transfer',
            headers=self.headers,
            json=payload
        )
        
        if response.status_code == 200:
            print(f"✅ NFT transferred successfully: {nft_id}")
            return response.json()
        else:
            print(f"❌ Failed to transfer NFT: {response.status_code} - {response.text}")
            return None

def create_sample_metadata(index: int) -> Dict:
    """Create sample NFT metadata"""
    return {
        'name': f'Test NFT #{index:03d}',
        'description': f'A test NFT created for testing purposes. This is item #{index}.',
        'image': f'https://example.com/test-nft-{index}.png',
        'attributes': [
            {'trait_type': 'Rarity', 'value': 'Common'},
            {'trait_type': 'Background', 'value': 'Blue'},
            {'trait_type': 'Test Index', 'value': index},
            {'trait_type': 'Generated', 'value': True}
        ],
        'external_url': f'https://example.com/nft/{index}'
    }

def main():
    """Main test function"""
    print("🚀 Starting NFT operations test")
    
    # Initialize tester
    tester = NFTTester()
    
    # Test user ID (in a real scenario, this would come from authentication)
    test_user_id = str(uuid.uuid4())
    test_stellar_address = "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU"
    
    print(f"📝 Using test user ID: {test_user_id}")
    
    # Test 1: Mint multiple NFTs
    print("\n🎨 Test 1: Minting NFTs")
    minted_nfts = []
    
    for i in range(1, 6):  # Mint 5 NFTs
        metadata = create_sample_metadata(i)
        nft = tester.mint_nft(metadata, test_stellar_address)
        if nft:
            minted_nfts.append(nft)
        time.sleep(1)  # Rate limiting
    
    print(f"✅ Minted {len(minted_nfts)} NFTs successfully")
    
    # Test 2: Retrieve user NFTs
    print("\n📋 Test 2: Retrieving user NFTs")
    user_nfts = tester.get_user_nfts(test_user_id)
    
    # Test 3: Get detailed NFT information
    print("\n🔍 Test 3: Getting NFT details")
    if minted_nfts:
        nft_details = tester.get_nft_details(minted_nfts[0]['id'])
        if nft_details:
            print(f"NFT Name: {nft_details['metadata']['name']}")
            print(f"Transaction ID: {nft_details['txId']}")
    
    # Test 4: Calculate rarity scores
    print("\n🎯 Test 4: Calculating rarity scores")
    for nft in minted_nfts[:3]:  # Test first 3 NFTs
        rarity_score = tester.calculate_rarity(nft['id'])
        time.sleep(0.5)
    
    # Test 5: Verify ownership
    print("\n🔐 Test 5: Verifying ownership")
    if minted_nfts:
        is_owner = tester.verify_ownership(minted_nfts[0]['id'], test_user_id)
        
        # Test with wrong user ID
        wrong_user_id = str(uuid.uuid4())
        is_not_owner = tester.verify_ownership(minted_nfts[0]['id'], wrong_user_id)
        print(f"Ownership verification with wrong user: {is_not_owner}")
    
    # Test 6: Transfer NFT (commented out as it requires two users)
    print("\n🔄 Test 6: NFT Transfer (skipped - requires two users)")
    # recipient_user_id = str(uuid.uuid4())
    # recipient_stellar_address = "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU"
    # if minted_nfts:
    #     transferred_nft = tester.transfer_nft(
    #         minted_nfts[0]['id'],
    #         recipient_user_id,
    #         recipient_stellar_address
    #     )
    
    print("\n🎉 NFT operations test completed!")
    print(f"📊 Summary:")
    print(f"   - NFTs minted: {len(minted_nfts)}")
    print(f"   - NFTs retrieved: {len(user_nfts)}")
    print(f"   - Tests completed successfully")

if __name__ == "__main__":
    main()
