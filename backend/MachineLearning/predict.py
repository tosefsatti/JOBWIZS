# recommender_service.py
from flask import Flask, request, jsonify
import pickle, os

app = Flask(__name__)
BASE = os.path.dirname(__file__)

# Load artifacts
with open(os.path.join(BASE, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)
with open(os.path.join(BASE, "resume_model.pkl"), "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    if not text or len(text) < 2:
        return jsonify({ "error": "Please provide at least 2 characters of skills string." }), 400

    # Vectorize and predict category
    vec = vectorizer.transform([text])
    category = model.predict(vec)[0]
    return jsonify({ "category": category })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)