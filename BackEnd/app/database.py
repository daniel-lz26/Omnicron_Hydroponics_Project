# imports all the libraries and sets up the database connection
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# reads the .env file
load_dotenv

# gets the database url from the env file
DATABASE_URL = os.getenv("DATABASE_URL")

# create the SQLalchemy engine (connection pool to Supabase)
engine = create_engine(DATABASE_URL)

# create a sessionlocal class - each instance is a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base class for our database models
Base = declarative_base()

# Ddpendency function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()