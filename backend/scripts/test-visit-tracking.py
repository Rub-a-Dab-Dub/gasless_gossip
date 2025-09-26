import requests
import json
import time
import random
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "http://localhost:3000"
API_TOKEN = "your-jwt-token-here"  # Replace with actual JWT token

# Headers for API requests
headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def test_visit_creation():
    """Test creating visits for different rooms and users"""
    print("Testing visit creation...")
    
    rooms = ["lobby", "gaming-room", "study-hall", "music-lounge", "art-gallery"]
    users = [str(uuid.uuid4()) for _ in range(10)]  # Generate 10 random user IDs
    
    visits_created = 0
    
    for _ in range(50):  # Create 50 test visits
        visit_data = {
            "roomId": random.choice(rooms),
            "userId": random.choice(users),
            "duration": random.randint(60, 3600),  # 1 minute to 1 hour
            "ipAddress": f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
            "userAgent": "Mozilla/5.0 (Test) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/visits", json=visit_data, headers=headers)
            if response.status_code == 201:
                visits_created += 1
                print(f"✓ Created visit for room {visit_data['roomId']}")
            else:
                print(f"✗ Failed to create visit: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"✗ Error creating visit: {e}")
        
        time.sleep(0.1)  # Small delay to avoid overwhelming the server
    
    print(f"Created {visits_created} visits successfully")
    return rooms, users

def test_visit_retrieval(rooms, users):
    """Test retrieving visits by room and user"""
    print("\nTesting visit retrieval...")
    
    # Test getting visits by room
    for room in rooms[:3]:  # Test first 3 rooms
        try:
            response = requests.get(f"{BASE_URL}/visits/room/{room}?limit=10", headers=headers)
            if response.status_code == 200:
                visits = response.json()
                print(f"✓ Retrieved {len(visits)} visits for room {room}")
            else:
                print(f"✗ Failed to get visits for room {room}: {response.status_code}")
        except Exception as e:
            print(f"✗ Error getting visits for room {room}: {e}")
    
    # Test getting visits by user
    for user in users[:3]:  # Test first 3 users
        try:
            response = requests.get(f"{BASE_URL}/visits/user/{user}?limit=5", headers=headers)
            if response.status_code == 200:
                visits = response.json()
                print(f"✓ Retrieved {len(visits)} visits for user {user[:8]}...")
            else:
                print(f"✗ Failed to get visits for user: {response.status_code}")
        except Exception as e:
            print(f"✗ Error getting visits for user: {e}")

def test_visit_statistics(rooms):
    """Test visit statistics endpoints"""
    print("\nTesting visit statistics...")
    
    for room in rooms[:3]:  # Test first 3 rooms
        try:
            response = requests.get(f"{BASE_URL}/visits/stats/{room}", headers=headers)
            if response.status_code == 200:
                stats = response.json()
                print(f"✓ Room {room} stats:")
                print(f"  - Total visits: {stats['totalVisits']}")
                print(f"  - Unique visitors: {stats['uniqueVisitors']}")
                print(f"  - Average duration: {stats['averageDuration']}s")
                print(f"  - Peak hour: {stats['peakHour']}:00")
            else:
                print(f"✗ Failed to get stats for room {room}: {response.status_code}")
        except Exception as e:
            print(f"✗ Error getting stats for room {room}: {e}")

def test_popular_rooms():
    """Test popular rooms endpoint"""
    print("\nTesting popular rooms...")
    
    try:
        response = requests.get(f"{BASE_URL}/visits/popular?limit=5", headers=headers)
        if response.status_code == 200:
            popular_rooms = response.json()
            print("✓ Popular rooms:")
            for i, room_data in enumerate(popular_rooms, 1):
                print(f"  {i}. {room_data['roomId']}: {room_data['visitCount']} visits")
        else:
            print(f"✗ Failed to get popular rooms: {response.status_code}")
    except Exception as e:
        print(f"✗ Error getting popular rooms: {e}")

def test_duplicate_visit_handling():
    """Test that duplicate visits within an hour are handled correctly"""
    print("\nTesting duplicate visit handling...")
    
    visit_data = {
        "roomId": "test-room",
        "userId": str(uuid.uuid4()),
        "duration": 300
    }
    
    try:
        # Create first visit
        response1 = requests.post(f"{BASE_URL}/visits", json=visit_data, headers=headers)
        if response1.status_code == 201:
            visit1 = response1.json()
            print(f"✓ Created first visit with duration {visit1['duration']}s")
            
            # Create second visit with same room/user (should update duration)
            visit_data["duration"] = 200
            response2 = requests.post(f"{BASE_URL}/visits", json=visit_data, headers=headers)
            if response2.status_code == 201:
                visit2 = response2.json()
                expected_duration = 300 + 200
                if visit2['duration'] == expected_duration:
                    print(f"✓ Duplicate visit correctly updated duration to {visit2['duration']}s")
                else:
                    print(f"✗ Expected duration {expected_duration}s, got {visit2['duration']}s")
            else:
                print(f"✗ Failed to create second visit: {response2.status_code}")
        else:
            print(f"✗ Failed to create first visit: {response1.status_code}")
    except Exception as e:
        print(f"✗ Error testing duplicate visits: {e}")

def main():
    """Run all visit tracking tests"""
    print("Starting Visit Tracking System Tests")
    print("=" * 50)
    
    # Test visit creation
    rooms, users = test_visit_creation()
    
    # Wait a moment for data to be processed
    time.sleep(2)
    
    # Test visit retrieval
    test_visit_retrieval(rooms, users)
    
    # Test statistics
    test_visit_statistics(rooms)
    
    # Test popular rooms
    test_popular_rooms()
    
    # Test duplicate handling
    test_duplicate_visit_handling()
    
    print("\n" + "=" * 50)
    print("Visit tracking tests completed!")
    print("\nNote: Make sure to:")
    print("1. Replace API_TOKEN with a valid JWT token")
    print("2. Ensure the server is running on localhost:3000")
    print("3. Have proper authentication set up")

if __name__ == "__main__":
    main()
