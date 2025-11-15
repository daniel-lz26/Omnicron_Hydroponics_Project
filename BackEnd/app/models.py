from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class ProbeReading(Base):
    __tablename__ = "probe_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Store status ONLY ("IN WATER", "OUT OF WATER", "MID LEVEL")
    water_level = Column(String)

    nutrient_level = Column(Float)
    ph_level = Column(Float)
