import sys
import os

# Add parent directory to path so we can import from app folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine
from sqlalchemy import text

def test_connection():
    """Test database connection to Supabase"""
    try:
        print("Attempting to connect to database...")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print("✓ Database connection successful!")
            print(f"✓ PostgreSQL version: {version}")
            return True
    except Exception as e:
        print(f"✗ Connection failed!")
        print(f"✗ Error: {e}")
        print("\nTroubleshooting steps:")
        print("1. Check if DATABASE_URL is set in your .env file")
        print("2. Verify your Supabase credentials are correct")
        print("3. Ensure your .env file is in the BackEnd directory")
        return False

if __name__ == "__main__":
    test_connection()