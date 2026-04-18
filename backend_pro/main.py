from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import os

# Create PostgreSQL tables based on models
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ASGPPS Production API",
    description="Adaptive Skill Gap & Placement Prediction System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ASGPPS Intelligence Engine Online"}

# Included Routers
from routers.auth import router as auth_router
from routers.intelligence import router as intel_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(intel_router, prefix="/api/intelligence", tags=["AI Engine"])
