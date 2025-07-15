#!/usr/bin/env python3
"""
Test script to verify the health endpoint
"""

import sys

import requests


def test_health_endpoint(base_url):
    """Test the health endpoint."""
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5000"
    print(f"Testing health endpoint at: {base_url}/api/health")
    success = test_health_endpoint(base_url)
    sys.exit(0 if success else 1)
