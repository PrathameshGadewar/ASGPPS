import PyPDF2
import re

def extract_text(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_features(text):
    cgpa = 7.0
    skills = len(re.findall(r"Python|Java|ML|AI|SQL|C\+\+", text))
    has_ml = 1 if "ML" in text else 0
    has_dsa = 1 if "DSA" in text else 0
    has_projects = 1 if "project" in text.lower() else 0
    experience = 1

    return [
        cgpa, skills, has_ml, has_dsa,
        has_projects, experience,
        1, 1, 70, 70
    ]
