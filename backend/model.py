import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score

df = pd.read_csv("placement_dataset_1000.csv")

le = LabelEncoder()
df["company_encoded"] = le.fit_transform(df["eligibility_label"])

features = [
    "cgpa", "number_of_skills", "has_ml",
    "has_dsa", "has_projects", "experience_years",
    "certifications_count", "internships",
    "communication_score", "aptitude_score"
]

X = df[features]
y_class = df["company_encoded"]
y_salary = df["salary_lpa"]

# ---------------- TRAIN TEST SPLIT ----------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y_class, test_size=0.2, random_state=42
)

# ---------------- RANDOM FOREST ----------------
rf = RandomForestClassifier()
rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)
print("Random Forest Accuracy:", round(accuracy_score(y_test, y_pred) * 100, 2), "%")

# ---------------- LOGISTIC REGRESSION ----------------
y_binary = (df["eligibility_label"] == "Product").astype(int)

X_train2, X_test2, y_train2, y_test2 = train_test_split(
    X, y_binary, test_size=0.2, random_state=42
)

# log_reg = LogisticRegression(max_iter=1000)
log_reg = LogisticRegression(max_iter=2000)
log_reg.fit(X_train2, y_train2)

y_pred_log = log_reg.predict(X_test2)
print("Logistic Regression Accuracy:", round(accuracy_score(y_test2, y_pred_log) * 100, 2), "%")

# ---------------- SALARY REGRESSION ----------------
reg = LinearRegression()
reg.fit(X_train, y_salary.loc[X_train.index])

salary_pred = reg.predict(X_test)
print("Salary R2 Score:", round(r2_score(y_salary.loc[X_test.index], salary_pred), 2))

# ---------------- KMEANS ----------------
kmeans = KMeans(n_clusters=3)
kmeans.fit(X)

# ---------------- PREDICTION FUNCTION ----------------
# def predict_all(data):
#     sector = rf.predict([data])[0]
#     salary = reg.predict([data])[0]
#     product_prob = log_reg.predict_proba([data])[0][1]
#     cluster = kmeans.predict([data])[0]


# input_df = pd.DataFrame([data], columns=features)

# sector = rf.predict(input_df)[0]
# salary = reg.predict(input_df)[0]
# product_prob = log_reg.predict_proba(input_df)[0][1]
# cluster = kmeans.predict(input_df)[0]

    # return {
    #     "sector": le.inverse_transform([sector])[0],
    #     "salary": round(float(salary), 2),
    #     "product_probability": round(float(product_prob * 100), 2),
    #     "cluster": int(cluster)
    # }
def predict_all(data):
    input_df = pd.DataFrame([data], columns=features)

    sector = rf.predict(input_df)[0]
    salary = reg.predict(input_df)[0]
    product_prob = log_reg.predict_proba(input_df)[0][1]
    cluster = kmeans.predict(input_df)[0]

    return {
        "sector": le.inverse_transform([sector])[0],
        "salary": round(float(salary), 2),
        "product_probability": round(float(product_prob * 100), 2),
        "cluster": int(cluster)
    }