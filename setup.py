#!/usr/bin/env python3
"""
Setup script for Flask Work Tracker API
"""

import os
import shutil
from pathlib import Path

def create_env_file():
    """Create .env file from env.example if it doesn't exist"""
    if not os.path.exists('.env'):
        if os.path.exists('env.example'):
            shutil.copy('env.example', '.env')
            print("✓ Created .env file from env.example")
            print("  Please update the .env file with your database credentials")
        else:
            print("✗ env.example not found")
    else:
        print("✓ .env file already exists")

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import flask_sqlalchemy
        import flask_jwt_extended
        import dotenv
        print("✓ All required dependencies are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("  Please run: pip install -r requirements.txt")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ['auth', 'work_entries']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✓ Created directory: {directory}")

def main():
    """Main setup function"""
    print("Flask Work Tracker API Setup")
    print("=" * 40)
    
    # Create directories
    create_directories()
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Create .env file
    create_env_file()
    
    print("\n" + "=" * 40)
    print("Setup completed!")
    print("\nNext steps:")
    print("1. Update the .env file with your database credentials")
    print("2. Run: python app.py")
    print("3. Test the API with: python test_api.py")

if __name__ == "__main__":
    main() 