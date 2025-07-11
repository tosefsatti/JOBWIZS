import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import os

# 1. Load data
DATA_PATH = os.path.join(os.path.dirname(__file__), "resume_data.csv")
df = pd.read_csv(DATA_PATH)  # columns: resume_text, job_category

# 2. Vectorize text
vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
X = vectorizer.fit_transform(df["resume_text"])
y = df["job_category"]

# 3. Train model
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

# 4. Save vectorizer + model
ARTIFACT_PATH = os.path.dirname(__file__)
with open(os.path.join(ARTIFACT_PATH, "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)
with open(os.path.join(ARTIFACT_PATH, "resume_model.pkl"), "wb") as f:
    pickle.dump(model, f)

print("✅ Training complete. Artifacts saved to:", ARTIFACT_PATH)
