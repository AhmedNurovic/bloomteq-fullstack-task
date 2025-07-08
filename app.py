import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
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
    work_entries = db.relationship("WorkEntry", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "created_at": self.created_at.isoformat() if self.created_at else None}


class WorkEntry(db.Model):
    __tablename__ = "work_entries"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hours = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "hours": self.hours,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


def _create_auth_blueprint():
    """Create and configure the auth blueprint."""
    auth_bp = Blueprint("auth", __name__)

    @auth_bp.route("/register", methods=["POST"])
    def register():
        data = request.get_json()
        if not data or not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password are required"}), 400
        email = data["email"]
        password = data["password"]
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User with this email already exists"}), 409
        user = User(email=email)
        user.set_password(password)
        try:
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
            return (
                jsonify({"message": "User registered successfully", "access_token": access_token, "user": user.to_dict()}),
                201,
            )
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Registration failed"}), 500

    @auth_bp.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        if not data or not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password are required"}), 400
        email = data["email"]
        password = data["password"]
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
        return jsonify({"message": "Login successful", "access_token": access_token, "user": user.to_dict()}), 200

    @auth_bp.route("/profile", methods=["GET"])
    @jwt_required()
    def profile():
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": user.to_dict()}), 200

    return auth_bp


def _create_work_entries_blueprint():
    """Create and configure the work entries blueprint."""
    work_entries_bp = Blueprint("work_entries", __name__)

    @work_entries_bp.route("/", methods=["GET"])
    @jwt_required()
    def get_work_entries():
        current_user_id = get_jwt_identity()
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        query = WorkEntry.query.filter_by(user_id=int(current_user_id))
        if start_date:
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
                query = query.filter(WorkEntry.date >= start_date)
            except ValueError:
                return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400
        if end_date:
            try:
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
                query = query.filter(WorkEntry.date <= end_date)
            except ValueError:
                return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD"}), 400
        work_entries = query.order_by(WorkEntry.date.desc()).all()
        return jsonify({"work_entries": [entry.to_dict() for entry in work_entries]}), 200

    @work_entries_bp.route("/<int:entry_id>", methods=["GET"])
    @jwt_required()
    def get_work_entry(entry_id):
        current_user_id = get_jwt_identity()
        work_entry = WorkEntry.query.filter_by(id=entry_id, user_id=int(current_user_id)).first()
        if not work_entry:
            return jsonify({"error": "Work entry not found"}), 404
        return jsonify({"work_entry": work_entry.to_dict()}), 200

    @work_entries_bp.route("/", methods=["POST"])
    @jwt_required()
    def create_work_entry():
        current_user_id = get_jwt_identity()
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        required_fields = ["date", "hours", "description"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400
        try:
            date_val = datetime.strptime(data["date"], "%Y-%m-%d").date()
            hours = float(data["hours"])
            if hours <= 0:
                return jsonify({"error": "Hours must be greater than 0"}), 400
            work_entry = WorkEntry(user_id=int(current_user_id), date=date_val, hours=hours, description=data["description"])
            db.session.add(work_entry)
            db.session.commit()
            return jsonify({"message": "Work entry created successfully", "work_entry": work_entry.to_dict()}), 201
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Failed to create work entry"}), 500

    @work_entries_bp.route("/<int:entry_id>", methods=["PUT"])
    @jwt_required()
    def update_work_entry(entry_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        work_entry = WorkEntry.query.filter_by(id=entry_id, user_id=int(current_user_id)).first()
        if not work_entry:
            return jsonify({"error": "Work entry not found"}), 404
        if not data:
            return jsonify({"error": "No data provided"}), 400
        try:
            if "date" in data:
                work_entry.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
            if "hours" in data:
                hours = float(data["hours"])
                if hours <= 0:
                    return jsonify({"error": "Hours must be greater than 0"}), 400
                work_entry.hours = hours
            if "description" in data:
                work_entry.description = data["description"]
            db.session.commit()
            return jsonify({"message": "Work entry updated successfully", "work_entry": work_entry.to_dict()}), 200
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Failed to update work entry"}), 500

    @work_entries_bp.route("/<int:entry_id>", methods=["DELETE"])
    @jwt_required()
    def delete_work_entry(entry_id):
        current_user_id = get_jwt_identity()
        work_entry = WorkEntry.query.filter_by(id=entry_id, user_id=int(current_user_id)).first()
        if not work_entry:
            return jsonify({"error": "Work entry not found"}), 404
        try:
            db.session.delete(work_entry)
            db.session.commit()
            return jsonify({"message": "Work entry deleted successfully"}), 200
        except Exception:
            db.session.rollback()
            return jsonify({"error": "Failed to delete work entry"}), 500

    return work_entries_bp


def create_app(test_config=None):
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///instance/work_tracker.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(_create_auth_blueprint(), url_prefix="/auth")
    app.register_blueprint(_create_work_entries_blueprint(), url_prefix="/work-entries")

    # Create database tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
