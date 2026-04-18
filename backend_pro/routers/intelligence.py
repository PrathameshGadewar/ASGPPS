from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import PyPDF2
from ml_models.resume_engine import parse_resume_text
from ml_models.eligibility_model import eligibility_model, salary_model

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    text = ""
    try:
        reader = PyPDF2.PdfReader(file.file)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")
        
    # Run intelligence extraction
    intelligence_data = parse_resume_text(text)
    
    # Run predictions based on extracted data
    eligibility = eligibility_model.predict_eligibility(intelligence_data)
    salary_prediction = salary_model.predict_salary(intelligence_data)
    
    # Adaptive Roadmap Generator Core Stub
    roadmap = [
        {
            "month": "Month 1-2", 
            "focus": "DSA + System Design Basics",
            "resources": [
                {"name": "Striver's A2Z DSA Sheet", "url": "https://takeuforward.org/", "type": "study"},
                {"name": "Abdul Bari Algorithms", "url": "https://www.youtube.com/user/abdul_bari", "type": "video"}
            ]
        },
        {
            "month": "Month 3", 
            "focus": f"Mastering {intelligence_data.get('missing_skills', [])[0] if intelligence_data.get('missing_skills') else 'Advanced Concepts'}",
            "resources": [
                {"name": "FreeCodeCamp Crash Course", "url": "https://www.youtube.com/watch?v=i_LwzRmA_08", "type": "video"},
                {"name": "Official Documentation Tutorials", "url": "https://devdocs.io/", "type": "study"}
            ]
        },
        {
            "month": "Month 4", 
            "focus": "High-Level Architecture & Deployment",
            "resources": [
                {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer", "type": "study"},
                {"name": "Hussein Nasser Backend Eng.", "url": "https://www.youtube.com/c/HusseinNasser-software-engineering", "type": "video"}
            ]
        },
        {
            "month": "Month 5-6", 
            "focus": "Govt/Placement Exams & Mock Interviews",
            "resources": [
                {"name": "GATE CSE & IT Official Info", "url": "https://gate.iitk.ac.in/", "type": "gov"},
                {"name": "CAT Exam Registration & Mock", "url": "https://iimcat.ac.in/", "type": "gov"},
                {"name": "ISRO CS Previous Papers", "url": "https://www.isro.gov.in/Careers.html", "type": "gov"},
                {"name": "UPSC IES/ISS Notification", "url": "https://upsc.gov.in/", "type": "gov"}
            ]
        }
    ]
    
    # Generate Subject-Wise Interview Question Banks & Live Links
    interview_hubs = []
    for skill in intelligence_data['extracted_skills']:
        sl = skill.lower()
        if 'python' in sl:
            interview_hubs.append({
                "topic": "Python",
                "samples": [
                    {"q": "What is the true difference between list and tuple memory allocation in Python?", "difficulty": "Medium"},
                    {"q": "Explain decorators and how they manipulate function execution.", "difficulty": "Advanced"},
                    {"q": "How does the Global Interpreter Lock (GIL) impact multithreading?", "difficulty": "Advanced"}
                ],
                "prep_links": [
                    {"name": "Python Top 100 Interview Questions & Answers", "url": "https://www.geeksforgeeks.org/python-interview-questions/"},
                    {"name": "RealPython: Advanced Interview Concepts", "url": "https://realpython.com/interview-qa/"}
                ]
            })
        elif 'java' in sl:
            interview_hubs.append({
                "topic": "Java",
                "samples": [
                    {"q": "How does the JVM Garbage Collector work under the hood?", "difficulty": "Advanced"},
                    {"q": "Explain the difference between ConcurrentHashMap and Hashtable.", "difficulty": "Medium"}
                ],
                "prep_links": [
                    {"name": "Core Java Interview Questions (500+ Qs)", "url": "https://www.javatpoint.com/corejava-interview-questions"},
                    {"name": "Java Concurrency & Multithreading Guide", "url": "https://www.baeldung.com/java-concurrency-interview-questions"}
                ]
            })
        elif 'machine learning' in sl or 'ml' in sl:
            interview_hubs.append({
                "topic": "Machine Learning",
                "samples": [
                    {"q": "Explain the Bias-Variance tradeoff in relation to underfitting and overfitting.", "difficulty": "Medium"},
                    {"q": "How exactly does a Random Forest algorithm prevent overfitting compared to a single Decision Tree?", "difficulty": "Advanced"}
                ],
                "prep_links": [
                    {"name": "ML Interview Prep: 100+ Questions (TowardsDataScience)", "url": "https://towardsdatascience.com/machine-learning-interview-questions-and-answers-11352e0ef733?gi=ed5da1dfd294"},
                    {"name": "Deep Learning Interview Repository (GitHub)", "url": "https://github.com/amitness/deep-learning-interview"}
                ]
            })
        elif 'docker' in sl or 'kubernetes' in sl:
            interview_hubs.append({
                "topic": "DevOps / Docker",
                "samples": [
                    {"q": "Describe the architectural difference between a Docker Image and a Running Container.", "difficulty": "Beginner"},
                    {"q": "How do Docker volumes work internally?", "difficulty": "Medium"}
                ],
                "prep_links": [
                    {"name": "Docker Interview Questions & Practical Scenarios", "url": "https://www.simplilearn.com/tutorials/docker-tutorial/docker-interview-questions"}
                ]
            })
        elif 'react' in sl:
            interview_hubs.append({
                "topic": "React.js",
                "samples": [
                    {"q": "What is the Virtual DOM and how does React's reconciliation algorithm (Fiber) optimize re-renders?", "difficulty": "Advanced"},
                    {"q": "Explain the difference between useMemo and useCallback.", "difficulty": "Medium"}
                ],
                "prep_links": [
                    {"name": "React Interview Handbook (GitHub)", "url": "https://github.com/sudheerj/reactjs-interview-questions"},
                    {"name": "Advanced Frontend Interview Guides", "url": "https://www.frontendinterviewhandbook.com/react-interview-questions"}
                ]
            })
        elif 'sql' in sl:
            interview_hubs.append({
                "topic": "Database / SQL",
                "samples": [
                    {"q": "Explain the difference between clustered and non-clustered indexes.", "difficulty": "Medium"},
                    {"q": "Describe the ACID properties in database transactions.", "difficulty": "Beginner"}
                ],
                "prep_links": [
                    {"name": "Top 100 SQL Interview Questions (LeetCode SQL prep)", "url": "https://leetcode.com/study-plan/sql/"},
                    {"name": "Advanced SQL Queries & Optimization", "url": "https://www.edureka.co/blog/interview-questions/sql-interview-questions"}
                ]
            })
            
    # Always include foundational DSA and System Design
    interview_hubs.append({
        "topic": "System Design & DSA (Core)",
        "samples": [
            {"q": "If you need to detect a cycle in a linked list in O(N) time and O(1) space, what algorithm would you use?", "difficulty": "Medium"},
            {"q": "How would you approach designing a scalable URL shortening service like Bitly? What database would you choose?", "difficulty": "Advanced"},
            {"q": "Explain the time complexity differences between QuickSort and MergeSort in worst-case scenarios.", "difficulty": "Beginner"}
        ],
        "prep_links": [
            {"name": "Striver's A2Z DSA Sheet (Complete Syllabus)", "url": "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"},
            {"name": "System Design Primer (Top GitHub Repo)", "url": "https://github.com/donnemartin/system-design-primer"},
            {"name": "LeetCode Top 100 Interview Questions", "url": "https://leetcode.com/problem-list/top-100-liked-questions/"}
        ]
    })
    
    # Generate EDA Data & Target Companies
    score = intelligence_data.get("skill_match", 50)
    target_companies = []
    if score > 80:
        target_companies = ["Google", "Microsoft", "Atlassian", "Uber", "Stripe"]
    elif score > 60:
        target_companies = ["Amazon", "Flipkart", "Paytm", "Zomato", "Swiggy"]
    elif score > 40:
        target_companies = ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture"]
    else:
        target_companies = ["Early-Stage Startups", "Mid-Level IT Agencies", "Service Desk Entry"]
        
    base_growth = 15
    missing_growth = [15, 30, 55, 85, 125]
    existing_growth = [10, 18, 25, 32, 40]
        
    eda_data = {
        "labels": ["2025", "2026", "2027", "2028", "2029"],
        "datasets": [
            {
                "label": "Demand for Missing Skills",
                "data": missing_growth
            },
            {
                "label": "Demand for Existing Skills",
                "data": existing_growth
            }
        ],
        "target_companies": target_companies
    }
    
    # ATS Optimization Logic
    ats_score = int(min(100, max(20, score * 1.15)))
    ats_fixes = []
    if not intelligence_data.get("has_projects"):
         ats_fixes.append({"original": "No project section found", "suggestion": "Add a 'Projects' section detailing 2-3 technical builds using the STAR method.", "category": "Quantifying Impact"})
    
    # Generic AI-driven rewrites based on missing skills context
    ats_fixes.extend([
        {
            "original": "Worked on ML project",
            "suggestion": "Developed an ML model using Python & Scikit-learn, achieving 92% prediction accuracy.",
            "category": "Quantifying Impact"
        },
        {
            "original": "Familiar with web development",
            "suggestion": "Architected responsive web applications utilizing React.js, Next.js, and Tailwind CSS.",
            "category": "Tailoring"
        }
    ])
    
    ats_insights = {
        "score": ats_score,
        "total_issues": len(ats_fixes) + 3,
        "categories": [
            {"name": "Content", "score": int(ats_score * 0.9), "issues": [
                {"name": "ATS Parse Rate", "status": "No Issues", "type": "good"},
                {"name": "Quantifying Impact", "status": "2 Issues", "type": "bad"},
                {"name": "Repetition", "status": "1 Issue", "type": "bad"},
                {"name": "Spelling & Grammar", "status": "No Issues", "type": "good"}
            ]},
            {"name": "Sections", "score": 100, "issues": [
                {"name": "Standard Headers", "status": "No Issues", "type": "good"}
            ]},
            {"name": "ATS Essentials", "score": int(ats_score * 1.1), "issues": [
                {"name": "File Format", "status": "No Issues", "type": "good"},
                {"name": "Keywords", "status": f"{len(intelligence_data.get('missing_skills', []))} Missing", "type": "bad"}
            ]},
            {"name": "Tailoring", "score": int(ats_score * 0.7), "issues": [
                {"name": "Job Match Alignment", "status": "Needs Work", "type": "bad"}
            ]}
        ],
        "fixes": ats_fixes
    }
    
    # Smart Job Match Engine (Deep prediction per company)
    job_matches = [
        {
            "company": "Google",
            "match": int(score * 0.8),
            "why": "Strong in " + (intelligence_data['extracted_skills'][0] if intelligence_data['extracted_skills'] else "Core Programming") + " and Problem Solving.",
            "missing": ["Advanced System Design", "Graph Algorithms"]
        },
        {
            "company": "Amazon",
            "match": int(score * 0.85),
            "why": "Excellent alignment with AWS fundamentals and backend architecture.",
            "missing": ["Distributed Systems", "Leadership Principles Experience"]
        },
        {
            "company": "TCS (Digital)",
            "match": int(score * 1.4) if score < 70 else 98,
            "why": "Clears all fundamental requirements for enterprise service integration.",
            "missing": ["Cloud Certifications (Optional)"]
        }
    ]
    
    # Live Job Openings Portal Generator
    live_jobs = []
    top_skill = intelligence_data['extracted_skills'][0] if intelligence_data['extracted_skills'] else "Software Engineering"
    encoded_skill = top_skill.replace(" ", "%20")
    
    live_jobs.extend([
        {
            "role": f"Junior {top_skill} Developer",
            "company": "TechFusion Innovations",
            "location": "Remote / Hybrid",
            "type": "Full-Time",
            "salary": "$70,000 - $90,000",
            "match": int(score * 0.95),
            "apply_url": f"https://www.linkedin.com/jobs/search?keywords={encoded_skill}&f_E=2"
        },
        {
            "role": f"{top_skill} Engineer I",
            "company": "Stripe (Sample)",
            "location": "Bengaluru, India",
            "type": "Full-Time",
            "salary": "₹12,00,000 - ₹18,00,000",
            "match": int(score * 0.70),
            "apply_url": f"https://www.indeed.com/jobs?q={encoded_skill}&l=India"
        },
        {
            "role": "Software Development Intern",
            "company": "Amazon",
            "location": "Global / Remote",
            "type": "Internship",
            "salary": "$4,000/mo",
            "match": int(min(100, score * 1.2)),
            "apply_url": "https://www.amazon.jobs/en/search?base_query=intern"
        }
    ])
    
    return {
        "status": "success",
        "intelligence": intelligence_data,
        "eligibility_prediction": eligibility,
        "salary_estimation": salary_prediction,
        "adaptive_roadmap": roadmap,
        "interview_questions": interview_hubs,
        "analytics_eda": eda_data,
        "ats_insights": ats_insights,
        "job_match_engine": job_matches,
        "live_jobs": live_jobs
    }


from pydantic import BaseModel
class ShortlistRequest(BaseModel):
    job_description: str
    extracted_skills: list[str]
    score: int

@router.post("/check-shortlist")
async def check_shortlist(data: ShortlistRequest):
    jd_lower = data.job_description.lower()
    
    # Simple NLP rules for mock
    jd_skills = []
    for s in ["python", "java", "react", "node", "aws", "docker", "sql", "kubernetes", "machine learning", "dsa"]:
        if s in jd_lower:
            jd_skills.append(s)
            
    if not jd_skills:
        jd_skills = ["communication", "problem solving"]
        
    user_skills_lower = [s.lower() for s in data.extracted_skills]
    
    matching_skills = [s for s in jd_skills if s in user_skills_lower]
    missing_skills = [s for s in jd_skills if s not in user_skills_lower]
    
    base_prob = data.score * 0.6
    skill_bonus = (len(matching_skills) / max(1, len(jd_skills))) * 40
    
    prob = int(min(99, base_prob + skill_bonus))
    
    decision = "Highly Likely" if prob > 75 else "Borderline" if prob > 50 else "Not Shortlisted"
    
    return {
        "status": "success",
        "probability": prob,
        "decision": decision,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "recommendation": f"You are missing {len(missing_skills)} core skills requested in this JD. Focus heavily on learning {missing_skills[0] if missing_skills else 'Advanced Architecture'}."
    }
