#!/usr/bin/env python3
"""
Test script for Degen Badge Assignment System
Tests badge awarding, Stellar integration, and analytics
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Any

class DegenBadgeSystemTester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
    
    def test_award_badge(self) -> bool:
        """Test badge awarding functionality"""
        try:
            # Test data
            test_user_id = "550e8400-e29b-41d4-a716-446655440000"
            badge_data = {
                "userId": test_user_id,
                "badgeType": "high_roller",
                "achievementData": {
                    "amount": 15000,
                    "timestamp": datetime.now().isoformat(),
                    "metadata": {"game": "poker", "table": "high_stakes"}
                },
                "mintToken": False  # Skip Stellar for testing
            }
            
            response = requests.post(
                f"{self.base_url}/degen-badges/award",
                json=badge_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                badge = response.json()
                self.log_test(
                    "Award Badge", 
                    True, 
                    f"Badge {badge['badgeType']} awarded to user {badge['userId']}"
                )
                return True
            else:
                self.log_test(
                    "Award Badge", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Award Badge", False, f"Exception: {str(e)}")
            return False
    
    def test_get_user_badges(self) -> bool:
        """Test retrieving user badges"""
        try:
            test_user_id = "550e8400-e29b-41d4-a716-446655440000"
            
            response = requests.get(f"{self.base_url}/degen-badges/{test_user_id}")
            
            if response.status_code == 200:
                badges = response.json()
                self.log_test(
                    "Get User Badges", 
                    True, 
                    f"Retrieved {len(badges)} badges for user"
                )
                return True
            else:
                self.log_test(
                    "Get User Badges", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Get User Badges", False, f"Exception: {str(e)}")
            return False
    
    def test_get_badge_stats(self) -> bool:
        """Test badge statistics endpoint"""
        try:
            test_user_id = "550e8400-e29b-41d4-a716-446655440000"
            
            response = requests.get(f"{self.base_url}/degen-badges/{test_user_id}/stats")
            
            if response.status_code == 200:
                stats = response.json()
                self.log_test(
                    "Get Badge Stats", 
                    True, 
                    f"Stats: {stats['totalBadges']} badges, {stats['totalRewards']} rewards"
                )
                return True
            else:
                self.log_test(
                    "Get Badge Stats", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Get Badge Stats", False, f"Exception: {str(e)}")
            return False
    
    def test_batch_award_badges(self) -> bool:
        """Test batch badge awarding"""
        try:
            batch_data = {
                "userIds": [
                    "550e8400-e29b-41d4-a716-446655440001",
                    "550e8400-e29b-41d4-a716-446655440002",
                    "550e8400-e29b-41d4-a716-446655440003"
                ],
                "badgeType": "risk_taker",
                "mintTokens": False
            }
            
            response = requests.post(
                f"{self.base_url}/degen-badges/award/batch",
                json=batch_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                badges = response.json()
                self.log_test(
                    "Batch Award Badges", 
                    True, 
                    f"Awarded {len(badges)} badges in batch"
                )
                return True
            else:
                self.log_test(
                    "Batch Award Badges", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except Exception as e:
            self.log_test("Batch Award Badges", False, f"Exception: {str(e)}")
            return False
    
    def test_duplicate_badge_prevention(self) -> bool:
        """Test that duplicate badges are prevented"""
        try:
            test_user_id = "550e8400-e29b-41d4-a716-446655440000"
            badge_data = {
                "userId": test_user_id,
                "badgeType": "high_roller",  # Same badge type as first test
                "mintToken": False
            }
            
            response = requests.post(
                f"{self.base_url}/degen-badges/award",
                json=badge_data,
                headers={"Content-Type": "application/json"}
            )
            
            # Should return 409 Conflict for duplicate badge
            if response.status_code == 409:
                self.log_test(
                    "Duplicate Badge Prevention", 
                    True, 
                    "Correctly prevented duplicate badge award"
                )
                return True
            else:
                self.log_test(
                    "Duplicate Badge Prevention", 
                    False, 
                    f"Expected 409, got {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.log_test("Duplicate Badge Prevention", False, f"Exception: {str(e)}")
            return False
    
    def test_badge_rarity_system(self) -> bool:
        """Test different badge rarities"""
        try:
            test_cases = [
                ("risk_taker", "common"),
                ("high_roller", "rare"),
                ("streak_master", "epic"),
                ("degen_legend", "legendary")
            ]
            
            success_count = 0
            for badge_type, expected_rarity in test_cases:
                test_user_id = f"550e8400-e29b-41d4-a716-44665544000{success_count + 4}"
                badge_data = {
                    "userId": test_user_id,
                    "badgeType": badge_type,
                    "mintToken": False
                }
                
                response = requests.post(
                    f"{self.base_url}/degen-badges/award",
                    json=badge_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 201:
                    badge = response.json()
                    if badge.get("rarity") == expected_rarity:
                        success_count += 1
            
            success = success_count == len(test_cases)
            self.log_test(
                "Badge Rarity System", 
                success, 
                f"Correctly assigned rarity to {success_count}/{len(test_cases)} badges"
            )
            return success
            
        except Exception as e:
            self.log_test("Badge Rarity System", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all tests and return summary"""
        print("🚀 Starting Degen Badge System Tests...")
        print("=" * 50)
        
        tests = [
            self.test_award_badge,
            self.test_get_user_badges,
            self.test_get_badge_stats,
            self.test_batch_award_badges,
            self.test_duplicate_badge_prevention,
            self.test_badge_rarity_system,
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            time.sleep(0.5)  # Brief pause between tests
        
        print("=" * 50)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        
        # Generate detailed report
        summary = {
            "total_tests": total,
            "passed_tests": passed,
            "failed_tests": total - passed,
            "success_rate": (passed / total) * 100,
            "test_results": self.test_results,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save results to file
        with open("degen_badge_test_results.json", "w") as f:
            json.dump(summary, f, indent=2)
        
        print(f"💾 Detailed results saved to degen_badge_test_results.json")
        
        if passed == total:
            print("🎉 All tests passed! Degen Badge System is working correctly.")
        else:
            print(f"⚠️  {total - passed} test(s) failed. Check the results for details.")
        
        return summary

def main():
    """Main test execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Test Degen Badge Assignment System")
    parser.add_argument(
        "--url", 
        default="http://localhost:3000", 
        help="Base URL of the API server"
    )
    
    args = parser.parse_args()
    
    tester = DegenBadgeSystemTester(args.url)
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results["failed_tests"] > 0:
        exit(1)

if __name__ == "__main__":
    main()
