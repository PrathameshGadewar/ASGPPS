import spacy
import re
from typing import List, Dict

# Try to load spaCy model, gracefully fallback if not downloaded yet
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback to simple regex if spacy not initialized on startup
    nlp = None

JOB_MARKET_SKILLS = {
    "Python", "Java", "C++", "Docker", "Kubernetes", "AWS", "Machine Learning", 
    "Deep Learning", "React", "Next.js", "Node.js", "System Design", "Advanced DSA",
    "SQL", "NoSQL", "Git", "CI/CD", "FastAPI"
}

def parse_resume_text(text: str) -> Dict:
    """Extracts features from resume text using NLP and rules."""
    extracted_skills = set()
    
    # 1. Skill Extraction
    text_lower = text.lower()
    for skill in JOB_MARKET_SKILLS:
        if skill.lower() in text_lower:
            extracted_skills.add(skill)
            
    # Calculate match percentage
    skill_match = 0
    missing_skills = list(JOB_MARKET_SKILLS)
    if extracted_skills:
        skill_match = int((len(extracted_skills) / len(JOB_MARKET_SKILLS)) * 100)
        missing_skills = list(JOB_MARKET_SKILLS - extracted_skills)
        
    # Pick top 5 missing skills for feedback
    missing_skills_sample = missing_skills[:5]
        
    return {
        "extracted_skills": list(extracted_skills),
        "skill_match": skill_match,
        "missing_skills": missing_skills_sample,
        "has_projects": 1 if "project" in text_lower else 0,
        "cgpa": 7.5, # Placeholder fallback
        "experience_years": 1.5
    }
