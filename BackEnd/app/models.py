# File uses SQLAlchemy to define database models for a web application.
# it basic terms this file is where we make the db tables.
from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime
from database import Base


class ProbeReading(Base):
    __tablename__ = "probe_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)

    water_level = Column(Float, nullable=False)
    nutrient_level = Column(Float, nullable=False)
    ph_level = Column(Float, nullable=False)
    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
