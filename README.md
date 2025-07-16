# Flask Work Tracker API

A Flask application with PostgreSQL (Neon) database, JWT authentication, and work entry management.

## Features

- **User Authentication**: JWT-based authentication with register/login endpoints
- **Work Entry Management**: CRUD operations for work entries (date, hours, description)
- **PostgreSQL Database**: Robust database with proper relationships (Neon recommended for production)
- **Blueprint Architecture**: Modular code organization with auth and work_entries blueprints
- **Environment Configuration**: Secure configuration management with .env files

## Project Structure

```
bloomteq-fullstack-task/
├── app.py                 # Main Flask application (contains models)
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
├── auth/                 # Authentication blueprint
│   ├── __init__.py
│   └── routes.py         # Auth routes (register, login, profile)
└── work_entries/         # Work entries blueprint
    ├── __init__.py
    └── routes.py         # Work entry CRUD routes
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Database Setup

#### Option A: Neon/PostgreSQL (Recommended for Production)
1. Create a Neon Postgres database (or use any Postgres instance)
2. Update the `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@host:port/dbname
   ```

#### Option B: SQLite (Development/Testing)
If `DATABASE_URL` is not set, the application will use SQLite for local development or testing.

### 3. Environment Configuration

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-change-this-in-production
   DATABASE_URL=postgresql://username:password@host:port/dbname
   JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
   ```

### 4. Run the Application

```bash
python app.py
```

The application will run on `http://localhost:5000`

## API Endpoints

**All endpoints are prefixed with `/api`.**

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{"email": "user@example.com", "password": "password123"}`
- **Response**: JWT token and user data

#### Login
- **POST** `/api/auth/login`
- **Body**: `{"email": "user@example.com", "password": "password123"}`
- **Response**: JWT token and user data

#### Get Profile
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: User profile data

### Work Entries

#### Get All Work Entries
- **GET** `/api/entries/`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Query Parameters**: 
  - `start_date` (optional): Filter from date (YYYY-MM-DD)
  - `end_date` (optional): Filter to date (YYYY-MM-DD)

#### Get Single Work Entry
- **GET** `/api/entries/<entry_id>`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Create Work Entry
- **POST** `/api/entries/`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: `{"date": "2024-01-15", "hours": 8.5, "description": "Work description"}`

#### Update Work Entry
- **PUT** `/api/entries/<entry_id>`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: `{"date": "2024-01-15", "hours": 8.5, "description": "Updated description"}`

#### Delete Work Entry
- **DELETE** `/api/entries/<entry_id>`
- **Headers**: `Authorization: Bearer <jwt_token>`

## Database Models

### User Model
- `id`: Primary key
- `email`: Unique email address
- `password_hash`: Hashed password
- `created_at`: User creation timestamp

### WorkEntry Model
- `id`: Primary key
- `user_id`: Foreign key to User
- `date`: Work date
- `hours`: Hours worked (float)
- `description`: Work description
- `created_at`: Entry creation timestamp
- `updated_at`: Entry update timestamp

## Security Features

- **Password Hashing**: Passwords are hashed using Werkzeug's security functions
- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: Users can only access their own work entries
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Proper error responses and database rollbacks

## Development

The application uses Flask's application factory pattern for better testing and configuration management. The blueprints provide modular organization of routes and functionality.

## Testing

### Unit Tests (Backend)
By default, tests use in-memory SQLite for speed and isolation. To test against Neon/Postgres, set `DATABASE_URL` in your environment or test config.

```bash
python -m pytest tests/ -v --tb=short
```

### API Testing Script
Run the API testing script (requires the Flask app to be running):
```bash
python api_script.py
```

Example curl commands:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Create work entry (use token from login response)
curl -X POST http://localhost:5000/api/entries/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"date": "2024-01-15", "hours": 8.5, "description": "Working on project"}'
```

## Running Tests

### Backend (Python)

```bash
python -m pytest tests/ -v --tb=short
```

### Frontend (React)

```bash
cd frontend/frontend
npm install
npm test
```

## Health Check Endpoint

A health check endpoint is available for monitoring and uptime checks:

```
GET /health
```
**Response:**
```
{
  "status": "ok",
  "db": "ok" // or "error" if the database is unreachable
}
```
Use this endpoint with uptime monitoring services (e.g., UptimeRobot, Pingdom, cloud provider health checks).



