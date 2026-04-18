import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder

class PlacementModel:
    def __init__(self, data_path: str = "placement_dataset_1000.csv"):
        self.data_path = data_path
        self.is_trained = False
        
        self.le = LabelEncoder()
        self.rf = RandomForestClassifier(random_state=42)
        self.log_reg = LogisticRegression(random_state=42, max_iter=1000)
        self.reg = LinearRegression()
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        
        self.features = [
            "cgpa", "number_of_skills", "has_ml",
            "has_dsa", "has_projects", "experience_years",
            "certifications_count", "internships",
            "communication_score", "aptitude_score"
        ]
        
    def train(self):
        if self.is_trained:
            return
            
        print("Training models... Please wait.")
        # Ensure path is relative to the file location
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(base_dir, self.data_path)
        
        df = pd.read_csv(csv_path)
        
        # df["company_encoded"] = self.le.fit_transform(df["company_type"])
        df["company_encoded"] = self.le.fit_transform(df["eligibility_label"])
        
        X = df[self.features]
        y_class = df["company_encoded"]
        y_salary = df["salary_lpa"]
        
        # Fit models
        self.rf.fit(X, y_class)
        # self.log_reg.fit(X, (df["company_type"] == "Product").astype(int))
        self.log_reg.fit(X, (df["eligibility_label"] == "Product").astype(int))
        self.reg.fit(X, y_salary)
        self.kmeans.fit(X)
        
        self.is_trained = True
        print("Models explicitly trained successfully.")

    def predict_all(self, data: list) -> dict:
        if not self.is_trained:
            self.train()
            
        sector = self.rf.predict([data])[0]
        salary = self.reg.predict([data])[0]
        product_prob = self.log_reg.predict_proba([data])[0][1]
        cluster = self.kmeans.predict([data])[0]

        return {
            "sector": self.le.inverse_transform([sector])[0],
            "salary": round(float(salary), 2),
            "product_probability": round(float(product_prob * 100), 2),
            "cluster": int(cluster)
        }

# Instantiate the global model ready for use
placement_model = PlacementModel()
