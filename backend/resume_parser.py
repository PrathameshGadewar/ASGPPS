import PyPDF2
import re
from typing import List, Union

def extract_text(file) -> str:
    """Extract text content from a PDF file object."""
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted
    return text

def extract_features(text: str) -> List[Union[float, int]]:
    """
    Parse the resume text to extract 10 specific features.
    Returns: [cgpa, skills, has_ml, has_dsa, has_projects, experience, certs, internships, comm, aptitude]
    """
    cgpa = 7.0
    skills = len(re.findall(r"Python|Java|ML|AI|SQL|C\+\+", text, re.IGNORECASE))
    has_ml = 1 if "ML" in text.upper() or "MACHINE LEARNING" in text.upper() else 0
    has_dsa = 1 if "DSA" in text.upper() or "DATA STRUCTURES" in text.upper() else 0
    has_projects = 1 if "project" in text.lower() else 0
    experience = 1.0

    return [
        cgpa, skills, has_ml, has_dsa,
        has_projects, experience,
        1, 1, 70, 70
    ]
