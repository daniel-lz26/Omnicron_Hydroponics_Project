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
# MANUAL CONTROL ENDPOINTS (TEST)
# =============================
@app.post("/pump/on")
def pump_on():
    """Turn pump ON - Placeholder for GPIO control"""
    # TODO: Add actual GPIO/relay control when hardware is connected
    # Example: GPIO.output(PUMP_PIN, GPIO.HIGH)
    print("🔵 PUMP ON - Manual control activated")
    return {
        "status": "success",
        "device": "pump",
        "action": "on",
        "message": "Pump turned ON (simulated)"
    }


@app.post("/pump/off")
def pump_off():
    """Turn pump OFF - Placeholder for GPIO control"""
    # TODO: Add actual GPIO/relay control when hardware is connected
    # Example: GPIO.output(PUMP_PIN, GPIO.LOW)
    print("🔴 PUMP OFF - Manual control deactivated")
    return {
        "status": "success",
        "device": "pump",
        "action": "off",
        "message": "Pump turned OFF (simulated)"
    }


@app.post("/spray/on")
def spray_on():
    """Turn spray ON - Placeholder for GPIO control"""
    # TODO: Add actual GPIO/relay control when hardware is connected
    # Example: GPIO.output(SPRAY_PIN, GPIO.HIGH)
    print("💧 SPRAY ON - Manual control activated")
    return {
        "status": "success",
        "device": "spray",
        "action": "on",
        "message": "Spray turned ON (simulated)"
    }


@app.post("/spray/off")
def spray_off():
    """Turn spray OFF - Placeholder for GPIO control"""
    # TODO: Add actual GPIO/relay control when hardware is connected
    # Example: GPIO.output(SPRAY_PIN, GPIO.LOW)
    print("🛑 SPRAY OFF - Manual control deactivated")
    return {
        "status": "success",
        "device": "spray",
        "action": "off",
        "message": "Spray turned OFF (simulated)"
    }
