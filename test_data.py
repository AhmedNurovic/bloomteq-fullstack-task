#!/usr/bin/env python3
"""
Simple script to add test data for testing statistics
"""
import json
from datetime import datetime, timedelta

import requests

BASE_URL = "http://127.0.0.1:5000"


def register_user():
    """Register a test user"""
    data = {"email": "test@example.com", "password": "testpassword123"}
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    if response.status_code == 201:
        return response.json()["access_token"]
    return None


def add_test_entries(token):
    """Add test entries with some completed"""
    headers = {"Authorization": f"Bearer {token}"}

    # Today's entries
    today = datetime.now().date()

    # Add a completed entry for today
    entry1 = {
        "date": today.isoformat(),
        "hours": 4.5,
        "description": "Completed task for today",
        "completed": True,
    }
    response = requests.post(f"{BASE_URL}/entries/", json=entry1, headers=headers)
    print(f"Added today's completed entry: {response.status_code}")

    # Add an incomplete entry for today
    entry2 = {
        "date": today.isoformat(),
        "hours": 2.0,
        "description": "Incomplete task for today",
        "completed": False,
    }
    response = requests.post(f"{BASE_URL}/entries/", json=entry2, headers=headers)
    print(f"Added today's incomplete entry: {response.status_code}")

    # Add completed entries for last week
    for i in range(1, 4):
        date = today - timedelta(days=i)
        entry = {
            "date": date.isoformat(),
            "hours": 3.0 + i,
            "description": f"Completed task from {date}",
            "completed": True,
        }
        response = requests.post(f"{BASE_URL}/entries/", json=entry, headers=headers)
        print(f"Added completed entry for {date}: {response.status_code}")


def check_statistics(token):
    """Check the statistics"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/entries/statistics", headers=headers)
    if response.status_code == 200:
        stats = response.json()
        print("\n=== STATISTICS ===")
        print(f"Today's hours: {stats['today_hours']}")
        print(f"Last week hours: {stats['last_week_hours']}")
        print(f"Last week tasks: {stats['last_week_tasks']}")
    else:
        print(f"Failed to get statistics: {response.status_code}")


if __name__ == "__main__":
    print("Adding test data...")
    token = register_user()
    if token:
        add_test_entries(token)
        check_statistics(token)
    else:
        print("Failed to register user")
