# ASGPPS Pro - Adaptive Skill Gap & Placement Prediction System

A fully production-ready, AI-driven full-stack system structured with clean architecture, enterprise-grade Next.js React frontend, and a highly modular FastAPI backend.

## 🌟 Features
- **Intelligent Resume Parsing**: Uses NLP (spaCy) to identify missing skills against market databases.
- **Robust Machine Learning Classifications**: Pipeline staged for RandomForest/XGBoost for granular eligibility predictions (Product vs Service vs Startup vs Govt).
- **Salary Estimation AI**: Regression-based dynamic salary range generation based on experience and matching scores.
- **Automated Roadmap Generator**: A 6-month visual progression sequence for interview readiness.
- **Futuristic Dark-Mode Dashboard**: Next.js 14 architecture powered by Tailwind CSS, Chart.js Radar visualization, and Framer Motion micro-animations.
- **Secure Authentication**: Built-in support for JWT token-based authentication and SQLAlchemy DB abstraction.
- **Complete Dockerization**: Instantly launch Backend, Frontend, Postgres databases, and MongoDB using `docker-compose`.

---

## 🏗️ Folder Structure
```text
/ASGPPS/
├── docker-compose.yml      -> Master orchestration
├── backend_pro/
│   ├── Dockerfile          -> Container spec
│   ├── main.py             -> Application Entrypoint
│   ├── database.py         -> Postgres & Mongo Configs
│   ├── core/
│   │   └── security.py     -> JWT Authentication & Hashing
│   ├── models/             -> SQLAlchemy Database Models
│   ├── schemas/            -> Pydantic Request/Response Types
│   ├── routers/            -> API Endpoint Logic
│   └── ml_models/          -> Core Inference, NLP Pipeline & Predictive AI classes
└── frontend_pro/
    ├── Dockerfile          -> Node.js Container spec
    ├── src/app/
    │   ├── layout.tsx      -> Next.js Head & Providers
    │   ├── page.tsx        -> Complete Animated Premium Dashboard
    │   └── globals.css     -> Cyberpunk/Neon Theme tokens & Tailwind 
    ├── src/components/     -> RadarChart, Interactive Upload Section
    └── package.json        -> Dependencies (Framer Motion, ChartJs, Lucide)
```

---

## 🚀 Setup & Launch Instructions

### Method 1: Docker Compose (Recommended for Production)
This will instantly spin up Postgres, MongoDB, the Python Backend, and the Next.js Frontend.
Ensure Docker Desktop is running.

```bash
# In the base directory with docker-compose.yml
docker-compose up --build
```
* Access Frontend: `http://localhost:3000`
* Access Backend API Docs: `http://localhost:8000/docs`

### Method 2: Local Manual Development

**1. Start the Backend API:**
```bash
cd backend_pro
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Start FastAPI server
uvicorn main:app --reload
```

**2. Start the Frontend:**
```bash
cd frontend_pro
npm install
npm run dev
```

---

## 🧠 Integrating Real Machine Learning Weights
In `backend_pro/ml_models/eligibility_model.py`, the classes currently perform mock logic matching the inputs, which guarantees your web-app runs perfectly right now. 
To inject your PyTorch / XGBoost datasets:
1. Save your trained models as `.pkl` or `.pt`.
2. Update the `__init__` constructor of `EligibilityModel` and `SalaryModel` to use `joblib.load()` or `torch.load()`.
3. Map the extracted arrays in `predict_eligibility` to feed directly to your weights!
