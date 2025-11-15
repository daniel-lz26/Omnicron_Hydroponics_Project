from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app import crud, schemas
from app.database import engine, get_db, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hydroponic System API",
    description="API for monitoring hydroponic garden system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================
# CREATE NEW READING (POST)
# =============================
@app.post("/readings/", response_model=schemas.ProbeReadingResponse)
def create_reading(reading: schemas.ProbeReadingCreate, db: Session = Depends(get_db)):

    # Incoming water_level is a string percentage from the Pi, convert to float
    try:
        percent = float(reading.water_level)
    except:
        percent = 0.0   # fallback if malformed data comes in

    # Convert % → text status
    if percent < 5:
        reading.water_level = "OUT OF WATER"
    elif percent > 67:
        reading.water_level = "IN WATER"
    else:
        reading.water_level = "MID LEVEL"

    print(f"Water % Received: {percent} → Saved as: {reading.water_level}")

    # Save to DB
    return crud.create_probe_reading(db=db, reading=reading)


# =============================
# GET ALL READINGS
# =============================
@app.get("/readings/", response_model=list[schemas.ProbeReadingResponse])
def get_all_readings(db: Session = Depends(get_db)):
    return crud.get_all_readings(db)


# =============================
# GET LATEST READING
# =============================
@app.get("/readings/latest", response_model=schemas.ProbeReadingResponse)
def get_latest_reading(db: Session = Depends(get_db)):
    latest = crud.get_latest_reading(db)
    if not latest:
        raise HTTPException(status_code=404, detail="No readings found")
    return latest


# =============================
# GET MIN/MAX STATS
# =============================
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_min_max_stats(db)
