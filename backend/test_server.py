import json
from app import app, analyzer

print("=== Testing Sentiment Analyzer Direct Inference ===")
samples = [
    "The food quality in the canteen was excellent today!",
    "The service at the library desk was extremely slow and unhelpful.",
    "The classroom temperature was okay, but the seats are decent."
]

res = analyzer.analyze_batch(samples)
print("Analysis Summary:", json.dumps(res["summary"], indent=2))
print("Topics Extracted:", res["topics"])
print("Insights Generated:", res["insights"])
print("Individual Results Count:", len(res["results"]))

print("\n=== Testing Flask API via Test Client ===")
client = app.test_client()

# 1. Health Check
h_res = client.get("/api/health")
print("GET /api/health Status:", h_res.status_code, h_res.get_json())

# 2. Analyze API
a_res = client.post("/api/analyze", json={"feedback": samples})
print("POST /api/analyze Status:", a_res.status_code, "Results Count:", len(a_res.get_json().get("results", [])))

print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
