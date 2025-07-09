import json

import pytest

from app import create_app, db


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
    }
    app = create_app(test_config)
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


def test_register_user(client):
    """Test user registration."""
    response = client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"


def test_register_duplicate_user(client):
    """Test registering a user with existing email."""
    # Register first user
    client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password123"}
    )

    # Try to register same email
    response = client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password456"}
    )
    assert response.status_code == 409


def test_register_invalid_email(client):
    response = client.post(
        "/auth/register", json={"email": "invalidemail", "password": "password123"}
    )
    assert response.status_code == 400
    assert b"Invalid email format" in response.data


def test_register_short_password(client):
    response = client.post(
        "/auth/register", json={"email": "test2@example.com", "password": "short"}
    )
    assert response.status_code == 400
    assert b"Password must be at least 8 characters long" in response.data


def test_login_user(client):
    """Test user login."""
    # Register user first
    client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password123"}
    )

    # Login
    response = client.post(
        "/auth/login", json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "access_token" in data


def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    response = client.post(
        "/auth/login", json={"email": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_login_invalid_email_format(client):
    # Register a valid user first
    client.post(
        "/auth/register", json={"email": "test3@example.com", "password": "password123"}
    )
    # Try to login with invalid email format
    response = client.post(
        "/auth/login", json={"email": "invalidemail", "password": "password123"}
    )
    assert response.status_code == 400
    assert b"Invalid email format" in response.data


def test_login_short_password(client):
    # Register a valid user first
    client.post(
        "/auth/register", json={"email": "test4@example.com", "password": "password123"}
    )
    # Try to login with short password
    response = client.post(
        "/auth/login", json={"email": "test4@example.com", "password": "short"}
    )
    assert response.status_code == 400
    assert b"Password must be at least 8 characters long" in response.data


def test_create_work_entry(client):
    """Test creating a work entry."""
    # Register and login first
    client.post(
        "/auth/register", json={"email": "test5@example.com", "password": "password123"}
    )
    login_response = client.post(
        "/auth/login", json={"email": "test5@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/entries/",
        json={
            "date": "2023-01-01",
            "hours": 8.5,
            "description": "Test work entry",
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json
    assert "work_entry" in data
    assert data["work_entry"]["description"] == "Test work entry"


def test_get_work_entries_with_pagination(client):
    """Test getting work entries with pagination."""
    # Register and login first
    client.post(
        "/auth/register", json={"email": "test6@example.com", "password": "password123"}
    )
    login_response = client.post(
        "/auth/login", json={"email": "test6@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create multiple entries
    for i in range(15):
        client.post(
            "/entries/",
            json={
                "date": f"2023-01-{i+1:02d}",
                "hours": 8.0,
                "description": f"Work entry {i+1}",
            },
            headers=headers,
        )

    # Test first page (default 10 per page)
    response = client.get("/entries/", headers=headers)
    assert response.status_code == 200
    data = response.json
    assert len(data["work_entries"]) == 10
    assert data["pagination"]["page"] == 1
    assert data["pagination"]["per_page"] == 10
    assert data["pagination"]["total"] == 15
    assert data["pagination"]["total_pages"] == 2
    assert data["pagination"]["has_next"] is True
    assert data["pagination"]["has_prev"] is False

    # Test second page
    response = client.get("/entries/?page=2", headers=headers)
    assert response.status_code == 200
    data = response.json
    assert len(data["work_entries"]) == 5
    assert data["pagination"]["page"] == 2
    assert data["pagination"]["has_next"] is False
    assert data["pagination"]["has_prev"] is True

    # Test custom per_page
    response = client.get("/entries/?per_page=5", headers=headers)
    assert response.status_code == 200
    data = response.json
    assert len(data["work_entries"]) == 5
    assert data["pagination"]["per_page"] == 5
    assert data["pagination"]["total_pages"] == 3


def test_get_work_entries_with_date_filters(client):
    """Test getting work entries with date filters."""
    # Register and login first
    client.post(
        "/auth/register", json={"email": "test7@example.com", "password": "password123"}
    )
    login_response = client.post(
        "/auth/login", json={"email": "test7@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create entries with different dates
    client.post(
        "/entries/",
        json={
            "date": "2023-01-01",
            "hours": 8.0,
            "description": "Entry 1",
        },
        headers=headers,
    )
    client.post(
        "/entries/",
        json={
            "date": "2023-01-15",
            "hours": 8.0,
            "description": "Entry 2",
        },
        headers=headers,
    )
    client.post(
        "/entries/",
        json={
            "date": "2023-02-01",
            "hours": 8.0,
            "description": "Entry 3",
        },
        headers=headers,
    )

    # Test date range filter
    response = client.get(
        "/entries/?start_date=2023-01-01&end_date=2023-01-31", headers=headers
    )
    assert response.status_code == 200
    data = response.json
    assert len(data["work_entries"]) == 2


def test_create_work_entry_invalid_date(client):
    """Test creating work entry with invalid date format."""
    # Register and login first
    client.post(
        "/auth/register", json={"email": "test8@example.com", "password": "password123"}
    )
    login_response = client.post(
        "/auth/login", json={"email": "test8@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/entries/",
        json={
            "date": "invalid-date",
            "hours": 8.0,
            "description": "Test work entry",
        },
        headers=headers,
    )
    assert response.status_code == 400
    assert b"Invalid date format" in response.data


def test_create_work_entry_invalid_hours(client):
    """Test creating work entry with invalid hours."""
    # Register and login first
    client.post(
        "/auth/register", json={"email": "test9@example.com", "password": "password123"}
    )
    login_response = client.post(
        "/auth/login", json={"email": "test9@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/entries/",
        json={
            "date": "2023-01-01",
            "hours": -5,
            "description": "Test work entry",
        },
        headers=headers,
    )
    assert response.status_code == 400
    assert b"Hours must be greater than 0" in response.data


def test_work_entry_ownership_check(client):
    """Test that users can only access their own entries."""
    # Register two users
    client.post(
        "/auth/register", json={"email": "user1@example.com", "password": "password123"}
    )
    client.post(
        "/auth/register", json={"email": "user2@example.com", "password": "password123"}
    )

    # Login as user1
    login_response = client.post(
        "/auth/login", json={"email": "user1@example.com", "password": "password123"}
    )
    token1 = login_response.json["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Create entry as user1
    create_response = client.post(
        "/entries/",
        json={
            "date": "2023-01-01",
            "hours": 8.0,
            "description": "User1's entry",
        },
        headers=headers1,
    )
    assert create_response.status_code == 201
    entry_id = create_response.json["work_entry"]["id"]

    # Login as user2
    login_response2 = client.post(
        "/auth/login", json={"email": "user2@example.com", "password": "password123"}
    )
    token2 = login_response2.json["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # Try to access user1's entry as user2
    response = client.get(f"/entries/{entry_id}", headers=headers2)
    assert response.status_code == 404

    # Try to delete user1's entry as user2
    response = client.delete(f"/entries/{entry_id}", headers=headers2)
    assert response.status_code == 404

    # Verify user1 can still access their entry
    response = client.get(f"/entries/{entry_id}", headers=headers1)
    assert response.status_code == 200


def test_delete_work_entry(client):
    """Test deleting a work entry."""
    # Register and login first
    client.post(
        "/auth/register",
        json={"email": "test10@example.com", "password": "password123"},
    )
    login_response = client.post(
        "/auth/login", json={"email": "test10@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create an entry
    create_response = client.post(
        "/entries/",
        json={
            "date": "2023-01-01",
            "hours": 8.0,
            "description": "Test work entry",
        },
        headers=headers,
    )
    assert create_response.status_code == 201
    entry_id = create_response.json["work_entry"]["id"]

    # Delete the entry
    response = client.delete(f"/entries/{entry_id}", headers=headers)
    assert response.status_code == 200

    # Verify it's deleted
    response = client.get(f"/entries/{entry_id}", headers=headers)
    assert response.status_code == 404


def test_unauthorized_access(client):
    """Test accessing protected endpoints without token."""
    response = client.get("/auth/profile")
    assert response.status_code == 401  # JWT missing


def test_invalid_work_entry_data(client):
    """Test creating work entry with missing fields returns 400."""
    client.post(
        "/auth/register",
        json={"email": "test11@example.com", "password": "password123"},
    )
    login_response = client.post(
        "/auth/login", json={"email": "test11@example.com", "password": "password123"}
    )
    token = login_response.json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Missing 'hours'
    response = client.post(
        "/entries/",
        json={"date": "2023-01-01", "description": "Missing hours"},
        headers=headers,
    )
    assert response.status_code == 400
    assert b"hours is required" in response.data

    # Missing 'date'
    response = client.post(
        "/entries/",
        json={"hours": 8, "description": "Missing date"},
        headers=headers,
    )
    assert response.status_code == 400
    assert b"date is required" in response.data

    # Missing 'description'
    response = client.post(
        "/entries/",
        json={"date": "2023-01-01", "hours": 8},
        headers=headers,
    )
    assert response.status_code == 400
    assert b"description is required" in response.data
