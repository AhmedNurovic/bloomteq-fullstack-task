#!/usr/bin/env python3
"""
Simple test script to verify the Flask API endpoints
"""

from datetime import date

import requests

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


def test_work_entries_endpoints():
    """Test work entries endpoints"""
    print("Testing Work Entries Endpoints...")

    # Register and login first
    register_data = {"email": "work@example.com", "password": "password123"}
    print("1. Registering user for work entries test...")
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    if response.status_code == 201:
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print("   ✓ Registration successful")
    else:
        print(f"   ✗ Registration failed: {response.text}")
        return

    # Test creating work entries
    print("2. Testing work entry creation...")
    work_entries = [
        {"date": "2023-01-01", "hours": 8.0, "description": "Morning shift"},
        {"date": "2023-01-02", "hours": 7.5, "description": "Afternoon shift"},
        {"date": "2023-01-03", "hours": 9.0, "description": "Overtime shift"},
    ]

    for i, entry in enumerate(work_entries, 1):
        response = requests.post(f"{BASE_URL}/entries/", json=entry, headers=headers)
        print(f"   Entry {i}: Status {response.status_code}")
        if response.status_code == 201:
            print(f"   ✓ Created: {entry['description']}")

    # Test getting work entries with pagination
    print("3. Testing work entries retrieval with pagination...")
    response = requests.get(f"{BASE_URL}/entries/", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Retrieved {len(data['work_entries'])} entries")
        print(
            f"   Pagination: Page {data['pagination']['page']}, "
            f"Total: {data['pagination']['total']}, "
            f"Pages: {data['pagination']['total_pages']}"
        )
    else:
        print(f"   ✗ Failed to retrieve entries: {response.text}")

    # Test getting work entries with date filters
    print("4. Testing work entries with date filters...")
    response = requests.get(
        f"{BASE_URL}/entries/?start_date=2023-01-01&end_date=2023-01-02",
        headers=headers,
    )
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Retrieved {len(data['work_entries'])} entries in date range")
    else:
        print(f"   ✗ Failed to retrieve filtered entries: {response.text}")

    # Test getting a specific work entry
    print("5. Testing getting specific work entry...")
    response = requests.get(f"{BASE_URL}/entries/1", headers=headers)
    if response.status_code == 200:
        entry = response.json().get("work_entry")
        print(f"   ✓ Retrieved entry: {entry['description']}")
    else:
        print(f"   ✗ Failed to retrieve specific entry: {response.text}")

    # Test updating a work entry
    print("6. Testing work entry update...")
    update_data = {"hours": 8.5, "description": "Updated morning shift"}
    response = requests.put(f"{BASE_URL}/entries/1", json=update_data, headers=headers)
    if response.status_code == 200:
        print("   ✓ Updated work entry successfully")
    else:
        print(f"   ✗ Failed to update entry: {response.text}")

    # Test deleting a work entry
    print("7. Testing work entry deletion...")
    response = requests.delete(f"{BASE_URL}/entries/3", headers=headers)
    if response.status_code == 200:
        print("   ✓ Deleted work entry successfully")
    else:
        print(f"   ✗ Failed to delete entry: {response.text}")

    # Test ownership check (should not be able to access other user's entries)
    print("8. Testing ownership check...")
    # Create another user
    other_user_data = {"email": "other@example.com", "password": "password123"}
    response = requests.post(f"{BASE_URL}/auth/register", json=other_user_data)
    if response.status_code == 201:
        other_token = response.json().get("access_token")
        other_headers = {"Authorization": f"Bearer {other_token}"}

        # Try to access first user's entry
        response = requests.get(f"{BASE_URL}/entries/1", headers=other_headers)
        if response.status_code == 404:
            print("   ✓ Ownership check working: Cannot access other user's entries")
        else:
            print(f"   ✗ Ownership check failed: {response.status_code}")


def main():
    """Main test function"""
    print("Flask Work Tracker API Test")
    print("=" * 40)

    try:
        # Test authentication
        token = test_auth_endpoints()

        if token:
            # Test work entries
            test_work_entries_endpoints()

        print("\n" + "=" * 40)
        print("Test completed!")

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the Flask application.")
        print("Make sure the application is running on http://localhost:5000")
    except Exception as e:
        print(f"Error during testing: {e}")


if __name__ == "__main__":
    main()
