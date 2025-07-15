#!/usr/bin/env python3
"""
Database setup script for Neon PostgreSQL
Run this script to initialize your production database
"""

import os

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection string
DATABASE_URL = "postgresql://neondb_owner:npg_eMm9Ehzp7ivt@ep-rapid-bird-a2doz6ex-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


def setup_database():
    """Initialize the database with required tables"""
    try:
        # Connect to the database
        conn = psycopg2.connect(DATABASE_URL)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Create users table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        )

        # Create work_entries table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS work_entries (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                hours DECIMAL(4,2) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """
        )

        # Create indexes for better performance
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_work_entries_user_id ON work_entries(user_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_work_entries_date ON work_entries(date);"
        )
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")

        cursor.close()
        conn.close()

    except Exception as e:
        return False

    return True


if __name__ == "__main__":
    success = setup_database()
    if success:
        print("\n🎉 Database setup completed successfully!")
        print("Your application is ready for deployment!")
    else:
        print("\n❌ Database setup failed. Please check your connection string.")
