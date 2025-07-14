import os
import re
from datetime import datetime, timedelta

from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

# Load environment variables
load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()


# Models
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    work_entries = db.relationship(
        "WorkEntry", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class WorkEntry(db.Model):
    __tablename__ = "work_entries"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hours = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "hours": self.hours,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


# Helper functions for auth blueprint
def _validate_auth_data(data):
    """Validate authentication data with email format and password length."""
    if not data or not data.get("email") or not data.get("password"):
        return False, "Email and password are required"
    email = data["email"]
    password = data["password"]
    # Simple email regex
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, email):
        return False, "Invalid email format"
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    return True, None


def _create_user_response(user):
    """Create user response with token."""
    access_token = create_access_token(
        identity=str(user.id), expires_delta=timedelta(hours=24)
    )
    return (
        jsonify(
            {
                "message": "User registered successfully",
                "access_token": access_token,
                "user": user.to_dict(),
            }
        ),
        201,
    )


def _create_login_response(user):
    """Create login response with token."""
    access_token = create_access_token(
        identity=str(user.id), expires_delta=timedelta(hours=24)
    )
    return (
        jsonify(
            {
                "message": "Login successful",
                "access_token": access_token,
                "user": user.to_dict(),
            }
        ),
        200,
    )


def _create_auth_blueprint():
    """Create and configure the auth blueprint."""
    auth_bp = Blueprint("auth", __name__)

    @auth_bp.route("/register", methods=["POST"])
    def register():
        data = request.get_json()
        is_valid, error_msg = _validate_auth_data(data)
        if not is_valid:
            return jsonify({"error": error_msg}), 400

        email = data["email"]
        password = data["password"]

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User with this email already exists"}), 409

        user = User(email=email)
        user.set_password(password)

        try:
            db.session.add(user)
            db.session.commit()
            return _create_user_response(user)
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Registration failed"}), 500

    @auth_bp.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        is_valid, error_msg = _validate_auth_data(data)
        if not is_valid:
            return jsonify({"error": error_msg}), 400

        email = data["email"]
        password = data["password"]

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

        return _create_login_response(user)

    @auth_bp.route("/profile", methods=["GET"])
    @jwt_required()
    def profile():
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": user.to_dict()}), 200

    return auth_bp


# Helper functions for work entries blueprint
def _validate_date_format(date_str):
    """Validate date format."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date(), None
    except ValueError:
        return None, "Invalid date format. Use YYYY-MM-DD"


def _validate_hours(hours):
    """Validate hours value."""
    try:
        hours_val = float(hours)
        if hours_val <= 0:
            return None, "Hours must be greater than 0"
        return hours_val, None
    except ValueError:
        return None, "Hours must be a valid number"


def _validate_work_entry_data(data):
    """Validate work entry data."""
    if not data:
        return False, "No data provided"

    required_fields = ["date", "hours", "description"]
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"{field.capitalize()} is required"

    return True, None


def _apply_date_filters(query, start_date, end_date):
    """Apply date filters to query."""
    if start_date:
        start_val, error = _validate_date_format(start_date)
        if error:
            return query, error
        query = query.filter(WorkEntry.date >= start_val)

    if end_date:
        end_val, error = _validate_date_format(end_date)
        if error:
            return query, error
        query = query.filter(WorkEntry.date <= end_val)

    return query, None


def _apply_pagination(query, page=1, per_page=10):
    """Apply pagination to query."""
    try:
        page = int(page)
        per_page = int(per_page)
    except ValueError:
        page = 1
        per_page = 10

    offset = (page - 1) * per_page
    return query.offset(offset).limit(per_page), page, per_page


def _get_statistics(user_id):
    """Get work statistics for a user."""
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)

    # Today's hours (only completed entries)
    today_hours = (
        db.session.query(db.func.sum(WorkEntry.hours))
        .filter(
            WorkEntry.user_id == user_id,
            WorkEntry.date == today,
            WorkEntry.completed == True,
        )
        .scalar()
        or 0
    )

    # Last week hours (only completed entries)
    last_week_hours = (
        db.session.query(db.func.sum(WorkEntry.hours))
        .filter(
            WorkEntry.user_id == user_id,
            WorkEntry.date >= week_ago,
            WorkEntry.date <= today,
            WorkEntry.completed == True,
        )
        .scalar()
        or 0
    )

    # Last week completed tasks (entries)
    last_week_tasks = (
        db.session.query(db.func.count(WorkEntry.id))
        .filter(
            WorkEntry.user_id == user_id,
            WorkEntry.date >= week_ago,
            WorkEntry.date <= today,
            WorkEntry.completed == True,
        )
        .scalar()
        or 0
    )

    return {
        "today_hours": round(today_hours, 2),
        "last_week_hours": round(last_week_hours, 2),
        "last_week_tasks": last_week_tasks,
    }


def _create_work_entries_blueprint():
    """Create and configure the work entries blueprint."""
    work_entries_bp = Blueprint("entries", __name__)

    @work_entries_bp.route("/", methods=["GET"])
    @jwt_required()
    def get_work_entries():
        current_user_id = get_jwt_identity()
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        page = request.args.get("page", 1)
        per_page = request.args.get("per_page", 10)

        query = WorkEntry.query.filter_by(user_id=int(current_user_id))
        query, error = _apply_date_filters(query, start_date, end_date)
        if error:
            return jsonify({"error": error}), 400

        # Fix: order_by before pagination
        query = query.order_by(WorkEntry.date.desc())
        paginated_query, current_page, items_per_page = _apply_pagination(
            query, page, per_page
        )
        work_entries = paginated_query.all()

        # Get total count for pagination metadata
        total_count = query.count()
        total_pages = (total_count + items_per_page - 1) // items_per_page

        return (
            jsonify(
                {
                    "work_entries": [entry.to_dict() for entry in work_entries],
                    "pagination": {
                        "page": current_page,
                        "per_page": items_per_page,
                        "total": total_count,
                        "total_pages": total_pages,
                        "has_next": current_page < total_pages,
                        "has_prev": current_page > 1,
                    },
                }
            ),
            200,
        )

    @work_entries_bp.route("/<int:entry_id>", methods=["GET"])
    @jwt_required()
    def get_work_entry(entry_id):
        current_user_id = get_jwt_identity()
        work_entry = WorkEntry.query.filter_by(
            id=entry_id, user_id=int(current_user_id)
        ).first()
        if not work_entry:
            return jsonify({"error": "Work entry not found"}), 404
        return jsonify({"work_entry": work_entry.to_dict()}), 200

    @work_entries_bp.route("/", methods=["POST"])
    @jwt_required()
    def create_work_entry():
        current_user_id = get_jwt_identity()
        data = request.get_json()

        is_valid, error_msg = _validate_work_entry_data(data)
        if not is_valid:
            return jsonify({"error": error_msg}), 400

        date_val, error = _validate_date_format(data["date"])
        if error:
            return jsonify({"error": error}), 400

        hours, error = _validate_hours(data["hours"])
        if error:
            return jsonify({"error": error}), 400

        work_entry = WorkEntry(
            user_id=int(current_user_id),
            date=date_val,
            hours=hours,
            description=data["description"],
            completed=data.get("completed", False),
        )

        try:
            db.session.add(work_entry)
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": "Work entry created successfully",
                        "work_entry": work_entry.to_dict(),
                    }
                ),
                201,
            )
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Failed to create work entry"}), 500

    @work_entries_bp.route("/<int:entry_id>", methods=["PUT"])
    @jwt_required()
    def update_work_entry(entry_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()

        work_entry = WorkEntry.query.filter_by(
            id=entry_id, user_id=int(current_user_id)
        ).first()
        if not work_entry:
            return jsonify({"error": "Work entry not found"}), 404

        if not data:
            return jsonify({"error": "No data provided"}), 400

        try:
            if "date" in data:
                date_val, error = _validate_date_format(data["date"])
                if error:
                    return jsonify({"error": error}), 400
                work_entry.date = date_val

            if "hours" in data:
                hours, error = _validate_hours(data["hours"])
                if error:
                    return jsonify({"error": error}), 400
                work_entry.hours = hours

            if "description" in data:
                work_entry.description = data["description"]

            if "completed" in data:
                work_entry.completed = bool(data["completed"])

            db.session.commit()
            return (
                jsonify(
                    {
                        "message": "Work entry updated successfully",
                        "work_entry": work_entry.to_dict(),
                    }
                ),
                200,
            )
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Failed to update work entry"}), 500

    @work_entries_bp.route("/<int:entry_id>", methods=["DELETE"])
    @jwt_required()
    def delete_work_entry(entry_id):
        current_user_id = get_jwt_identity()
        work_entry = WorkEntry.query.filter_by(
            id=entry_id, user_id=int(current_user_id)
        ).first()
        if not work_entry:
            return jsonify({"error": "Work entry not found"}), 404

        try:
            db.session.delete(work_entry)
            db.session.commit()
            return jsonify({"message": "Work entry deleted successfully"}), 200
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Failed to delete work entry"}), 500

    @work_entries_bp.route("/statistics", methods=["GET"])
    @jwt_required()
    def get_statistics():
        current_user_id = get_jwt_identity()
        stats = _get_statistics(int(current_user_id))
        return jsonify(stats), 200

    return work_entries_bp


def create_app(test_config=None):
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///instance/app.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)

    # Enable CORS for frontend (dev and prod, including Vercel previews)
    origins = [
        r"http://localhost(:\d+)?",
        r"https://bloomteq-fullstack-task-.*\.vercel\.app",
        "https://bloomteq-fullstack-task.vercel.app",
    ]
    CORS(
        app,
        origins=origins,
        supports_credentials=True,
    )

    # Temporary: Log CORS validation for debugging
    @app.before_request
    def log_cors_validation():
        origin = request.headers.get("Origin")
        if origin:
            print(
                f"Origin: {origin} - Allowed: {any(re.match(pattern, origin) for pattern in origins)}"
            )

    # Register blueprints
    app.register_blueprint(_create_auth_blueprint(), url_prefix="/auth")
    app.register_blueprint(_create_work_entries_blueprint(), url_prefix="/entries")

    # Create database tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

# Vercel serverless handler
app = create_app()

# Export the Flask app for Vercel
handler = app
