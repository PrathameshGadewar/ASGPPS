from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
import numpy as np

class EligibilityModel:
    def __init__(self):
        # In a real environment, we load weights here using joblib/pickle
        # We will mock a trained structure for robust pipeline execution
        self.sectors = ["Product", "Service", "Startup", "Government"]
        self.organizations = ["Amazon", "TCS", "ISRO", "DRDO", "BHEL"]
        
    def predict_eligibility(self, data: dict) -> dict:
        """
        Multiclass classification prediction logic based on standard ML probabilities.
        """
        skill_score = data.get("skill_match", 50)
        exp = data.get("experience_years", 0)
        
        # Simulated probability distribution based on skill scoring
        product_prob = min(98, skill_score + (exp * 5))
        service_prob = min(99, 60 + (skill_score * 0.4))
        startup_prob = min(95, 40 + (skill_score * 0.6))
        govt_prob = min(85, 30 + (skill_score * 0.5))
        
        return {
            "Amazon (Product)": int(product_prob * 0.9),
            "TCS (Service)": int(service_prob),
            "ISRO (Govt)": int(govt_prob * 0.8),
            "Flipkart (Startup)": int(startup_prob)
        }

class SalaryModel:
    def __init__(self):
        self.base_salary = 4.0
        
    def predict_salary(self, data: dict) -> dict:
        """
        Regression model logic for salary estimation.
        """
        skill_score = data.get("skill_match", 50)
        exp = data.get("experience_years", 0)
        
        # Logic: Base 4 LPA + (skill/10) + (exp * 2)
        estimate = self.base_salary + (skill_score / 15.0) + (exp * 2.5)
        
        low = max(3.0, round(estimate * 0.8, 1))
        high = round(estimate * 1.2, 1)
        
        return {
            "india_salary_range": f"{low} - {high} LPA",
            "global_salary_range": f"${int(low*8)}K - ${int(high*10)}K USD"
        }

# Global instances Pipeline
eligibility_model = EligibilityModel()
salary_model = SalaryModel()
