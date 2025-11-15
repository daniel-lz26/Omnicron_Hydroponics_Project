from pydantic import BaseModel
from datetime import datetime

class ProbeReadingBase(BaseModel):
    water_level: float          # 👈 float
    nutrient_level: float
    ph_level: float

class ProbeReadingCreate(ProbeReadingBase):
    pass

class ProbeReadingResponse(ProbeReadingBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
