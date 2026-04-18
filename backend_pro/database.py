import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient

# Provide fallback for local non-docker dev
POSTGRES_URL = os.getenv("DB_URL", "sqlite:///./asgpps_local.db")
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# --- PostgreSQL Setup (SQLAlchemy) ---
# Check if using sqlite for local fallback
connect_args = {"check_same_thread": False} if POSTGRES_URL.startswith("sqlite") else {}

engine = create_engine(POSTGRES_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- MongoDB Setup (Motor) ---
mongo_client = AsyncIOMotorClient(MONGO_URL)
mongo_db = mongo_client["asgpps_ai_data"]

def get_mongo():
    return mongo_db
