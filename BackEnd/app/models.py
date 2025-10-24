# File uses SQLAlchemy to define database models for a web application.
# it basic terms this file is where we make the db tables.

# imports tools for SQLAlchemy (python library)
from sqlalchemy import Column, Integer, Float, DateTime, String
# imports a tool that creates a base template for all models
from sqlalchemy.ext.declarative import declarative_base
# tool that collects data in real time and saves it

Base = declarative_base()
# creates base that all models will build upon, connects python classes to actual database tables


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)

    water_level = Column(Float, nullable=False)
    nutrient_level = Column(Float, nullable=False)
    ph_level = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=DateTime.utcnow, nullable=False)
