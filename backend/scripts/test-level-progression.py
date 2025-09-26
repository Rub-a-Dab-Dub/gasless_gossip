import requests
import json
import time
from typing import List, Dict, Any

class LevelSystemTester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def test_sample_data_generation(self) -> Dict[str, Any]:
        """Test the sample data generation endpoint"""
        print("🧪 Testing sample data generation...")
        
        try:
            response = self.session.post(f"{self.base_url}/sample-data/generate")
            response.raise_for_status()
            
            result = response.json()
            print(f"✅ Sample data generated: {result['message']}")
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to generate sample data: {e}")
            return {"error": str(e)}
    
    def test_user_level_retrieval(self, user_id: str) -> Dict[str, Any]:
        """Test retrieving a user's level information"""
        print(f"📊 Testing level retrieval for user {user_id[:8]}...")
        
        try:
            response = self.session.get(f"{self.base_url}/levels/{user_id}")
            response.raise_for_status()
            
            level_data = response.json()
            print(f"✅ User Level: {level_data['level']}, Total XP: {level_data['totalXp']}")
            return level_data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to retrieve user level: {e}")
            return {"error": str(e)}
    
    def test_xp_addition(self, user_id: str, xp_amount: int) -> Dict[str, Any]:
        """Test adding XP to a user"""
        print(f"⚡ Testing XP addition: {xp_amount} XP to user {user_id[:8]}...")
        
        try:
            response = self.session.post(
                f"{self.base_url}/levels/{user_id}/add-xp",
                json={"xpToAdd": xp_amount}
            )
            response.raise_for_status()
            
            result = response.json()
            print(f"✅ XP Added. New Level: {result['level']}, Total XP: {result['totalXp']}")
            
            if result.get('isLevelUpPending'):
                print("🎉 LEVEL UP DETECTED!")
                
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to add XP: {e}")
            return {"error": str(e)}
    
    def test_leaderboard(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Test the leaderboard functionality"""
        print(f"🏆 Testing leaderboard (top {limit})...")
        
        try:
            response = self.session.get(f"{self.base_url}/levels?limit={limit}")
            response.raise_for_status()
            
            leaderboard = response.json()
            print("📋 Leaderboard:")
            for i, entry in enumerate(leaderboard, 1):
                print(f"  #{i}: Level {entry['level']}, {entry['totalXp']} XP")
                
            return leaderboard
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to retrieve leaderboard: {e}")
            return []
    
    def test_level_check(self, user_id: str) -> Dict[str, Any]:
        """Test the level check functionality"""
        print(f"🔍 Testing level check for user {user_id[:8]}...")
        
        try:
            response = self.session.post(f"{self.base_url}/levels/{user_id}/check")
            response.raise_for_status()
            
            result = response.json()
            print(f"✅ Level Check Complete. Level: {result['level']}")
            return result
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to check level: {e}")
            return {"error": str(e)}
    
    def test_xp_threshold_configuration(self) -> Dict[str, Any]:
        """Test XP threshold configuration endpoints"""
        print("⚙️ Testing XP threshold configuration...")
        
        try:
            # Get all thresholds
            response = self.session.get(f"{self.base_url}/config/xp-thresholds")
            response.raise_for_status()
            
            thresholds = response.json()
            print(f"✅ Retrieved {len(thresholds)} XP thresholds")
            
            # Test validation
            validation_response = self.session.get(f"{self.base_url}/config/xp-thresholds/validate/all")
            validation_response.raise_for_status()
            
            validation = validation_response.json()
            if validation['isValid']:
                print("✅ XP thresholds validation passed")
            else:
                print(f"⚠️ XP thresholds validation failed: {validation['errors']}")
            
            return {"thresholds": thresholds, "validation": validation}
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to test configuration: {e}")
            return {"error": str(e)}
    
    def test_level_preview(self, total_xp: int) -> Dict[str, Any]:
        """Test level preview functionality"""
        print(f"🔮 Testing level preview for {total_xp} XP...")
        
        try:
            response = self.session.get(f"{self.base_url}/config/xp-thresholds/preview/{total_xp}")
            response.raise_for_status()
            
            preview = response.json()
            print(f"✅ Preview: Level {preview['level']}, {preview['progressPercentage']}% progress")
            return preview
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to get level preview: {e}")
            return {"error": str(e)}
    
    def run_comprehensive_test(self):
        """Run a comprehensive test of the level system"""
        print("🚀 Starting comprehensive level system test...\n")
        
        # Test 1: Generate sample data
        self.test_sample_data_generation()
        time.sleep(2)  # Wait for data generation to complete
        
        # Test 2: Test leaderboard
        leaderboard = self.test_leaderboard()
        
        if leaderboard:
            # Test 3: Test individual user operations
            top_user_id = leaderboard[0]['userId']
            
            # Get current level
            current_level = self.test_user_level_retrieval(top_user_id)
            
            # Add some XP
            self.test_xp_addition(top_user_id, 500)
            
            # Check level after XP addition
            self.test_level_check(top_user_id)
        
        # Test 4: Configuration tests
        self.test_xp_threshold_configuration()
        
        # Test 5: Level preview tests
        test_xp_values = [0, 100, 500, 1000, 5000, 10000, 25000]
        for xp in test_xp_values:
            self.test_level_preview(xp)
        
        print("\n🎯 Comprehensive test completed!")

def main():
    """Main function to run the level system tests"""
    print("Level System Testing Script")
    print("=" * 50)
    
    tester = LevelSystemTester()
    
    try:
        tester.run_comprehensive_test()
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")

if __name__ == "__main__":
    main()
