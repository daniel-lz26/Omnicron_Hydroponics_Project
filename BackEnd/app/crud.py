from sqlalchemy.orm import Session
from app.models import ProbeReading
from app.schemas import ProbeReadingCreate

def create_probe_reading(db: Session, reading: ProbeReadingCreate) -> ProbeReading:
    # 🚫 no more mapping "5.2 → MID LEVEL" here
    db_reading = ProbeReading(
        water_level=reading.water_level,          # keep numeric %
        nutrient_level=reading.nutrient_level,
        ph_level=reading.ph_level,
    )
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading
