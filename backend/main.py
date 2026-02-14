from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from model import predict_all
from resume_parser import extract_text, extract_features

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        cgpa, skills, has_ml, has_dsa,
        has_projects, experience,
        certs, internships, comm, aptitude
    ]
    return predict_all(data)

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text(file.file)
    features = extract_features(text)
    return predict_all(features)
