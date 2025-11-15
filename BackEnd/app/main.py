from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app import crud, schemas  # Change to absolute imports like crud.py uses
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
# Creating the endpoints for the API
#sends the data from the database using post
@app.post("/readings/", response_model=schemas.ProbeReadingResponse)
def create_reading(reading: schemas.ProbeReadingCreate, db: Session = Depends(get_db)):
    return crud.create_probe_reading(db=db, reading=reading)

# retrives all probe readings


@app.get("/readings/", response_model=list[schemas.ProbeReadingResponse])
def get_all_readings(db: Session = Depends(get_db)):
    return crud.get_all_readings(db)

#retrives most recent reading 
@app.get("/readings/latest", response_model=schemas.ProbeReadingResponse)
def get_latest_reading(db: Session = Depends(get_db)):
    latest = crud.get_latest_reading(db)
    if not latest:
        raise HTTPException(status_code=404, detail="No readings found")
    return latest
#returns summary of the readings like min and max
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_min_max_stats(db)