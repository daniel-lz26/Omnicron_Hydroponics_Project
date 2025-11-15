from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

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
# PUMP STATE STORAGE (In-Memory)
# =============================
pump_state = {
    "status": "off",      # "on" or "off"
    "last_updated": None,
    "requested_by": "system"
}


# =============================
# CREATE NEW READING (POST)
# =============================
@app.post("/readings/", response_model=schemas.ProbeReadingResponse)
def create_reading(reading: schemas.ProbeReadingCreate, db: Session = Depends(get_db)):

    # Convert water level to float
    try:
        reading.water_level = float(reading.water_level)
    except:
        reading.water_level = 0.0

    print(f"Water % Received: {reading.water_level}")

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


# =============================
# MANUAL PUMP CONTROL ENDPOINTS
# =============================
@app.post("/pump/on")
def pump_on():
    """Turn pump ON - Updates state for Pi to read"""
    from datetime import datetime

    pump_state["status"] = "on"
    pump_state["last_updated"] = datetime.now().isoformat()
    pump_state["requested_by"] = "web_ui"

    print("🔵 PUMP ON - Manual control activated")
    print(f"   State updated: {pump_state}")

    return {
        "status": "success",
        "device": "pump",
        "action": "on",
        "message": "Pump turned ON",
        "current_state": pump_state
    }


@app.post("/pump/off")
def pump_off():
    """Turn pump OFF - Updates state for Pi to read"""
    from datetime import datetime

    pump_state["status"] = "off"
    pump_state["last_updated"] = datetime.now().isoformat()
    pump_state["requested_by"] = "web_ui"

    print("🔴 PUMP OFF - Manual control deactivated")
    print(f"   State updated: {pump_state}")

    return {
        "status": "success",
        "device": "pump",
        "action": "off",
        "message": "Pump turned OFF",
        "current_state": pump_state
    }


@app.get("/pump/status")
def get_pump_status():
    """Get current pump status - Pi polls this endpoint"""
    return {
        "status": pump_state["status"],
        "last_updated": pump_state["last_updated"],
        "requested_by": pump_state["requested_by"]
    }
