# Schemas.py file is for PYDANTIC models which is basically data validation for API requests and responses
from pydantic import BaseModel
from datetime import datetime


class ProbeReadingBase(BaseModel):
    water_level: str
    nutrient_level: float
    ph_level: float


class ProbeReadingCreate(ProbeReadingBase):
    pass


class ProbeReadingResponse(ProbeReadingBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
