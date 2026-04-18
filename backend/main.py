from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from model import placement_model
from resume_parser import extract_text, extract_features
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Train the models effectively during application startup 
    placement_model.train()
    yield
    # Cleanup runs here if required on shutdown

app = FastAPI(lifespan=lifespan)

# ✅ CORS Middleware (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- PREDICT API ----------------------

@app.post("/predict")
async def predict(
    cgpa: float,
    skills: int,
    has_ml: int,
    has_dsa: int,
    has_projects: int,
    experience: float,
    certs: int,
    internships: int,
    comm: int,
    aptitude: int
):
    data = [
        cgpa,
        skills,
        has_ml,
        has_dsa,
        has_projects,
        experience,
        certs,
        internships,
        comm,
        aptitude
    ]

    return placement_model.predict_all(data)

# ---------------------- RESUME UPLOAD ----------------------

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text(file.file)
    features = extract_features(text)
    return placement_model.predict_all(features)
