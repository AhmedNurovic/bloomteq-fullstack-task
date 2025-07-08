#!/usr/bin/env python3
"""
Simple test script to verify the Flask API endpoints
"""

import requests
from datetime import date

BASE_URL = "http://localhost:5000"


def test_auth_endpoints():
    """Test authentication endpoints"""
    print("Testing Authentication Endpoints...")

    # Test registration
    register_data = {"email": "test@example.com", "password": "password123"}

    print("1. Testing user registration...")
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        print("   ✓ Registration successful")
        token = response.json().get("access_token")
    else:
        print(f"   ✗ Registration failed: {response.text}")
        return None

    # Test login
    print("2. Testing user login...")
    response = requests.post(f"{BASE_URL}/auth/login", json=register_data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✓ Login successful")
        token = response.json().get("access_token")
    else:
        print(f"   ✗ Login failed: {response.text}")
        return None

    # Test profile
    print("3. Testing profile endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✓ Profile retrieval successful")
    else:
        print(f"   ✗ Profile retrieval failed: {response.text}")

    return token


def test_work_entries_endpoints(token):
    """Test work entries endpoints"""
    print("\nTesting Work Entries Endpoints...")

    headers = {"Authorization": f"Bearer {token}"}

    # Test creating work entry
    print("1. Testing work entry creation...")
    work_entry_data = {"date": date.today().isoformat(), "hours": 8.5, "description": "Testing the API endpoints"}

    response = requests.post(f"{BASE_URL}/work-entries/", json=work_entry_data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        print("   ✓ Work entry creation successful")
        entry_id = response.json().get("work_entry", {}).get("id")
    else:
        print(f"   ✗ Work entry creation failed: {response.text}")
        return

    # Test getting all work entries
    print("2. Testing get all work entries...")
    response = requests.get(f"{BASE_URL}/work-entries/", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        entries = response.json().get("work_entries", [])
        print(f"   ✓ Retrieved {len(entries)} work entries")
    else:
        print(f"   ✗ Failed to retrieve work entries: {response.text}")

    # Test getting single work entry
    print("3. Testing get single work entry...")
    response = requests.get(f"{BASE_URL}/work-entries/{entry_id}", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✓ Single work entry retrieval successful")
    else:
        print(f"   ✗ Single work entry retrieval failed: {response.text}")

    # Test updating work entry
    print("4. Testing work entry update...")
    update_data = {"description": "Updated description for testing"}
    response = requests.put(f"{BASE_URL}/work-entries/{entry_id}", json=update_data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✓ Work entry update successful")
    else:
        print(f"   ✗ Work entry update failed: {response.text}")

    # Test deleting work entry
    print("5. Testing work entry deletion...")
    response = requests.delete(f"{BASE_URL}/work-entries/{entry_id}", headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print("   ✓ Work entry deletion successful")
    else:
        print(f"   ✗ Work entry deletion failed: {response.text}")


def main():
    """Main test function"""
    print("Flask Work Tracker API Test")
    print("=" * 40)

    try:
        # Test authentication
        token = test_auth_endpoints()

        if token:
            # Test work entries
            test_work_entries_endpoints(token)

        print("\n" + "=" * 40)
        print("Test completed!")

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the Flask application.")
        print("Make sure the application is running on http://localhost:5000")
    except Exception as e:
        print(f"Error during testing: {e}")


if __name__ == "__main__":
    main()
