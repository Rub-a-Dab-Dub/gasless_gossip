#!/usr/bin/env python3
"""
Test script for Activity Logging System
Tests activity logging, retrieval, and analytics functionality
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import random

# Configuration
BASE_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/activity"

# Sample data
SAMPLE_USERS = [
    str(uuid.uuid4()) for _ in range(5)
]

SAMPLE_ROOMS = [
    "general", "gaming", "music", "tech", "random"
]

ACTIVITY_ACTIONS = [
    "message_sent", "tip_sent", "room_joined", "room_left", 
    "profile_updated", "badge_earned", "level_up", "login"
]

def generate_sample_activity():
    """Generate a sample activity log entry"""
    user_id = random.choice(SAMPLE_USERS)
    action = random.choice(ACTIVITY_ACTIONS)
    
    activity = {
        "userId": user_id,
        "action": action,
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "source": "test_script"
        }
    }
    
    # Add action-specific data
    if action == "message_sent":
        activity["roomId"] = random.choice(SAMPLE_ROOMS)
        activity["metadata"]["messageLength"] = random.randint(1, 280)
    elif action == "tip_sent":
        activity["targetUserId"] = random.choice([u for u in SAMPLE_USERS if u != user_id])
        activity["amount"] = round(random.uniform(1.0, 50.0), 2)
        activity["roomId"] = random.choice(SAMPLE_ROOMS)
    elif action in ["room_joined", "room_left"]:
        activity["roomId"] = random.choice(SAMPLE_ROOMS)
    elif action == "badge_earned":
        activity["metadata"]["badgeType"] = random.choice(["first_message", "generous_tipper", "social_butterfly"])
    elif action == "level_up":
        activity["metadata"]["newLevel"] = random.randint(2, 20)
        activity["metadata"]["xpGained"] = random.randint(100, 500)
    
    return activity

def test_log_activity():
    """Test logging activities"""
    print("🧪 Testing activity logging...")
    
    activities_logged = 0
    
    # Log multiple activities
    for i in range(50):
        activity = generate_sample_activity()
        
        try:
            response = requests.post(f"{API_BASE}/log", json=activity)
            
            if response.status_code == 201:
                activities_logged += 1
                if i % 10 == 0:
                    print(f"   ✅ Logged {i + 1} activities...")
            else:
                print(f"   ❌ Failed to log activity: {response.status_code}")
                print(f"      Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Request failed: {e}")
    
    print(f"✅ Successfully logged {activities_logged} activities")
    return activities_logged > 0

def test_get_user_activities():
    """Test retrieving user activities"""
    print("\n🧪 Testing user activity retrieval...")
    
    user_id = SAMPLE_USERS[0]
    
    try:
        # Test basic retrieval
        response = requests.get(f"{API_BASE}/{user_id}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Retrieved {len(data.get('activities', []))} activities for user")
            print(f"   📊 Total activities: {data.get('total', 0)}")
            
            # Test with filters
            response = requests.get(f"{API_BASE}/{user_id}?action=message_sent&limit=5")
            if response.status_code == 200:
                filtered_data = response.json()
                print(f"   ✅ Filtered retrieval: {len(filtered_data.get('activities', []))} message activities")
            
            return True
        else:
            print(f"   ❌ Failed to retrieve activities: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def test_user_activity_stats():
    """Test user activity statistics"""
    print("\n🧪 Testing user activity statistics...")
    
    user_id = SAMPLE_USERS[0]
    
    try:
        response = requests.get(f"{API_BASE}/{user_id}/stats")
        
        if response.status_code == 200:
            stats = response.json()
            print(f"   ✅ Retrieved activity statistics")
            print(f"   📊 Total activities: {stats.get('totalActivities', 0)}")
            print(f"   📊 Last 24h: {stats.get('last24Hours', 0)}")
            print(f"   📊 Most common action: {stats.get('mostCommonAction', {}).get('action', 'N/A')}")
            print(f"   📊 Average per day: {stats.get('averagePerDay', 0)}")
            
            return True
        else:
            print(f"   ❌ Failed to retrieve stats: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def test_recent_activities():
    """Test retrieving recent activities"""
    print("\n🧪 Testing recent activities retrieval...")
    
    try:
        response = requests.get(f"{API_BASE}/recent/20")
        
        if response.status_code == 200:
            activities = response.json()
            print(f"   ✅ Retrieved {len(activities)} recent activities")
            
            if activities:
                latest = activities[0]
                print(f"   📊 Latest activity: {latest.get('action')} by user {latest.get('userId')[:8]}...")
            
            return True
        else:
            print(f"   ❌ Failed to retrieve recent activities: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def test_activities_by_action():
    """Test retrieving activities by action type"""
    print("\n🧪 Testing activities by action retrieval...")
    
    action = "message_sent"
    
    try:
        response = requests.get(f"{API_BASE}/action/{action}?limit=10")
        
        if response.status_code == 200:
            activities = response.json()
            print(f"   ✅ Retrieved {len(activities)} {action} activities")
            
            return True
        else:
            print(f"   ❌ Failed to retrieve activities by action: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def test_activity_aggregates():
    """Test activity aggregates and analytics"""
    print("\n🧪 Testing activity aggregates...")
    
    try:
        # Test without date filters
        response = requests.get(f"{API_BASE}/aggregates/summary")
        
        if response.status_code == 200:
            aggregates = response.json()
            print(f"   ✅ Retrieved activity aggregates")
            print(f"   📊 Total activities: {aggregates.get('totalActivities', 0)}")
            print(f"   📊 Unique users: {aggregates.get('uniqueUsers', 0)}")
            
            action_breakdown = aggregates.get('actionBreakdown', {})
            if action_breakdown:
                top_action = max(action_breakdown.items(), key=lambda x: x[1])
                print(f"   📊 Top action: {top_action[0]} ({top_action[1]} times)")
            
            return True
        else:
            print(f"   ❌ Failed to retrieve aggregates: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {e}")
        return False

def main():
    """Run all activity logging tests"""
    print("🚀 Starting Activity Logging System Tests")
    print("=" * 50)
    
    tests = [
        test_log_activity,
        test_get_user_activities,
        test_user_activity_stats,
        test_recent_activities,
        test_activities_by_action,
        test_activity_aggregates,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"   ❌ Test failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print(f"🏁 Tests completed: {passed}/{total} passed")
    
    if passed == total:
        print("🎉 All tests passed! Activity logging system is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the API server and database connection.")
    
    return passed == total

if __name__ == "__main__":
    main()
