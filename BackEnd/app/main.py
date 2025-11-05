from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

import crud
import schemas
from database import engine, get_db, Base


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hydroponic System API"
    description="API for monitoring hydroponic garden system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_orgins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Creating the endpoints for the API
@app.post("/readings/", response_model=schemas.ProbeReadingResponse)
def create_reading(reading: schemas.ProbeReadingCreate,)