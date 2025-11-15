# app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv, find_dotenv

# Load .env from this folder or any parent folder
load_dotenv(find_dotenv())

# 1) Read DATABASE_URL from env, else default to a local SQLite file
#    DB file will live at BackEnd/hydroponics.db
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))  # .../BackEnd
DEFAULT_SQLITE_PATH = os.path.join(PROJECT_ROOT, "hydroponics.db")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_SQLITE_PATH}")

# 2) SQLite needs a special connect arg in SQLAlchemy on macOS
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# 3) Engine / Session / Base
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4) Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
