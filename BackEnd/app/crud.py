from datetime import datetime, timedelta
from typing import Optional, List

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import ProbeReading
from app.schemas import ProbeReadingCreate


# create
def create_probe_reading(db: Session, reading: ProbeReadingCreate) -> ProbeReading:
    """Insert a new probe reading row."""
    new_reading = ProbeReading(**reading.model_dump())
    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)
    return new_reading


# read
def get_all_readings(db: Session) -> List[ProbeReading]:
    return db.query(ProbeReading).all()


def get_reading_by_id(db: Session, reading_id: int) -> Optional[ProbeReading]:
    return db.query(ProbeReading).filter(ProbeReading.id == reading_id).first()


def get_latest_reading(db: Session) -> Optional[ProbeReading]:
    return db.query(ProbeReading).order_by(ProbeReading.timestamp.desc()).first()


def get_readings_by_date_range(
    db: Session, start_date: datetime, end_date: datetime
) -> List[ProbeReading]:
    """Return readings between start_date and end_date (inclusive) ordered newest first."""
    return (
        db.query(ProbeReading)
        .filter(
            ProbeReading.timestamp >= start_date,
            ProbeReading.timestamp <= end_date,
        )
        .order_by(ProbeReading.timestamp.desc())
        .all()
    )


def get_low_ph_readings(db: Session, ph_thresh: float = 6.5, limit: int = 10) -> List[ProbeReading]:
    return (
        db.query(ProbeReading)
        .filter(ProbeReading.ph_level <= ph_thresh)
        .order_by(ProbeReading.timestamp.desc())
        .limit(limit)
        .all()
    )


def get_water_level_alerts(
    db: Session, min_level: float = 10.0, max_level: float = 90.0, limit: int = 10
) -> List[ProbeReading]:
    return (
        db.query(ProbeReading)
        .filter(
            (ProbeReading.water_level < min_level)
            | (ProbeReading.water_level > max_level)
        )
        .order_by(ProbeReading.timestamp.desc())
        .limit(limit)
        .all()
    )


def get_nutrient_level_alerts(
    db: Session, min_level: float = 800.0, max_level: float = 1500.0, limit: int = 10
) -> List[ProbeReading]:
    return (
        db.query(ProbeReading)
        .filter(
            (ProbeReading.nutrient_level < min_level)
            | (ProbeReading.nutrient_level > max_level)
        )
        .order_by(ProbeReading.timestamp.desc())
        .limit(limit)
        .all()
    )


# UPDATE
def update_reading(
    db: Session,
    reading_id: int,
    water_level: Optional[float] = None,
    nutrient_level: Optional[float] = None,
    ph_level: Optional[float] = None,
) -> Optional[ProbeReading]:
    reading = db.query(ProbeReading).filter(ProbeReading.id == reading_id).first()
    if not reading:
        return None

    if water_level is not None:
        reading.water_level = water_level
    if nutrient_level is not None:
        reading.nutrient_level = nutrient_level
    if ph_level is not None:
        reading.ph_level = ph_level

    db.commit()
    db.refresh(reading)
    return reading


# delete
def delete_reading(db: Session, reading_id: int) -> bool:
    reading = db.query(ProbeReading).filter(ProbeReading.id == reading_id).first()
    if not reading:
        return False
    db.delete(reading)
    db.commit()
    return True


def delete_old_readings(db: Session, days_to_keep: int = 30) -> int:
    """Delete rows older than N days; returns number deleted."""
    cutoff_date = datetime.now() - timedelta(days=days_to_keep)
    deleted_count = (
        db.query(ProbeReading).filter(ProbeReading.timestamp < cutoff_date).delete()
    )
    db.commit()
    return deleted_count


# stats
def get_average_ph(db: Session, hours: int = 24) -> Optional[float]:
    cutoff_time = datetime.now() - timedelta(hours=hours)
    result = (
        db.query(func.avg(ProbeReading.ph_level))
        .filter(ProbeReading.timestamp >= cutoff_time)
        .scalar()
    )
    return round(result, 2) if result is not None else None


def get_average_nutrient_level(db: Session, hours: int = 24) -> Optional[float]:
    cutoff_time = datetime.now() - timedelta(hours=hours)
    result = (
        db.query(func.avg(ProbeReading.nutrient_level))
        .filter(ProbeReading.timestamp >= cutoff_time)
        .scalar()
    )
    return round(result, 2) if result is not None else None


def get_average_water_level(db: Session, hours: int = 24) -> Optional[float]:
    cutoff_time = datetime.now() - timedelta(hours=hours)
    result = (
        db.query(func.avg(ProbeReading.water_level))
        .filter(ProbeReading.timestamp >= cutoff_time)
        .scalar()
    )
    return round(result, 2) if result is not None else None


def get_min_max_stats(db: Session, hours: int = 24) -> Optional[dict]:
    """
    Return min/max for ph, water_level, nutrient_level over the last <hours>.
    Returns None if no rows in the window (prevents rounding None).
    """
    cutoff_time = datetime.now() - timedelta(hours=hours)
    stats = (
        db.query(
            func.min(ProbeReading.ph_level).label("min_ph"),
            func.max(ProbeReading.ph_level).label("max_ph"),
            func.min(ProbeReading.water_level).label("min_water"),
            func.max(ProbeReading.water_level).label("max_water"),
            func.min(ProbeReading.nutrient_level).label("min_nutrient"),
            func.max(ProbeReading.nutrient_level).label("max_nutrient"),
        )
        .filter(ProbeReading.timestamp >= cutoff_time)
        .first()
    )

    # When there are no rows, or any value is None, return None
    if not stats or any(
        v is None
        for v in (
            stats.min_ph,
            stats.max_ph,
            stats.min_water,
            stats.max_water,
            stats.min_nutrient,
            stats.max_nutrient,
        )
    ):
        return None

    return {
        "ph": {
            "min": round(stats.min_ph, 2),
            "max": round(stats.max_ph, 2),
        },
        "water_level": {
            "min": round(stats.min_water, 2),
            "max": round(stats.max_water, 2),
        },
        "nutrient_level": {
            "min": round(stats.min_nutrient, 2),
            "max": round(stats.max_nutrient, 2),
        },
    }
