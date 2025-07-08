# Flask Work Tracker API

A Flask application with PostgreSQL database, JWT authentication, and work entry management.

## Features

- **User Authentication**: JWT-based authentication with register/login endpoints
- **Work Entry Management**: CRUD operations for work entries (date, hours, description)
- **PostgreSQL Database**: Robust database with proper relationships
- **Blueprint Architecture**: Modular code organization with auth and work_entries blueprints
- **Environment Configuration**: Secure configuration management with .env files

## Project Structure

```
bloomteq-fullstack-task/
├── app.py                 # Main Flask application
├── models.py              # Database models (User, WorkEntry)
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

#### Option A: PostgreSQL (Recommended)
1. Install PostgreSQL on your system
2. Create a database named `work_tracker`
3. Update the `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/work_tracker
   ```

#### Option B: SQLite (Development)
The application will automatically use SQLite if no PostgreSQL connection is configured.

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
   DATABASE_URL=postgresql://username:password@localhost:5432/work_tracker
   JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
   ```

### 4. Run the Application

```bash
python app.py
```

The application will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body**: `{"email": "user@example.com", "password": "password123"}`
- **Response**: JWT token and user data

#### Login
- **POST** `/auth/login`
- **Body**: `{"email": "user@example.com", "password": "password123"}`
- **Response**: JWT token and user data

#### Get Profile
- **GET** `/auth/profile`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: User profile data

### Work Entries

#### Get All Work Entries
- **GET** `/work-entries/`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Query Parameters**: 
  - `start_date` (optional): Filter from date (YYYY-MM-DD)
  - `end_date` (optional): Filter to date (YYYY-MM-DD)

#### Get Single Work Entry
- **GET** `/work-entries/<entry_id>`
- **Headers**: `Authorization: Bearer <jwt_token>`

#### Create Work Entry
- **POST** `/work-entries/`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: `{"date": "2024-01-15", "hours": 8.5, "description": "Work description"}`

#### Update Work Entry
- **PUT** `/work-entries/<entry_id>`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: `{"date": "2024-01-15", "hours": 8.5, "description": "Updated description"}`

#### Delete Work Entry
- **DELETE** `/work-entries/<entry_id>`
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

### Unit Tests
Run the test suite:
```bash
python -m pytest tests/ -v
```

### API Testing Script
Run the API testing script (requires the Flask app to be running):
```bash
python api_script.py
```

Example curl commands:

```bash
# Register a user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Create work entry (use token from login response)
curl -X POST http://localhost:5000/work-entries/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"date": "2024-01-15", "hours": 8.5, "description": "Working on project"}'
``` 