water_level = Column(Float)
from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class ProbeReading(Base):
    __tablename__ = "probe_readings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    water_level = Column(String)
    nutrient_level = Column(Float, nullable=False)
    ph_level = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
