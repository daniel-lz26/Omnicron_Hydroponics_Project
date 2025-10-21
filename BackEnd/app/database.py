# Daniel Lopez worked on this
# imports all the libraries and sets up the database connection
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# reads the .env file
load_dotenv

# gets the database url from the environment variable
DATABASE_URL = os.getenv("DATABASE_URL")