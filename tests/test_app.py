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


def test_create_work_entry(client):
    """Test creating a work entry."""
    # Register and login to get token
    register_response = client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password123"}
    )
    token = json.loads(register_response.data)["access_token"]

    # Create work entry
    response = client.post(
        "/work-entries/",
        json={"date": "2024-01-15", "hours": 8.5, "description": "Test work"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["work_entry"]["hours"] == 8.5
    assert data["work_entry"]["description"] == "Test work"


def test_get_work_entries(client):
    """Test getting work entries."""
    # Register and login to get token
    register_response = client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password123"}
    )
    token = json.loads(register_response.data)["access_token"]

    # Create a work entry
    client.post(
        "/work-entries/",
        json={"date": "2024-01-15", "hours": 8.5, "description": "Test work"},
        headers={"Authorization": f"Bearer {token}"},
    )

    # Get work entries
    response = client.get(
        "/work-entries/", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["work_entries"]) == 1


def test_unauthorized_access(client):
    """Test accessing protected endpoints without token."""
    response = client.get("/auth/profile")
    assert response.status_code == 401  # JWT missing


def test_invalid_work_entry_data(client):
    """Test creating work entry with invalid data."""
    # Register and login to get token
    register_response = client.post(
        "/auth/register", json={"email": "test@example.com", "password": "password123"}
    )
    token = json.loads(register_response.data)["access_token"]

    # Try to create work entry without required fields
    response = client.post(
        "/work-entries/",
        json={"date": "2024-01-15"},  # Missing hours and description
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
