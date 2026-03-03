import requests
import json

# Test health endpoint
print("=== Testing Health Endpoint ===")
resp = requests.get("http://localhost:8000/api/v1/health")
print(f"Status: {resp.status_code}")
print(f"Response: {resp.json()}\n")

# Test fortune endpoint
print("=== Testing Fortune Endpoint ===")
payload = {
    "date": "1989-10-17",
    "time": "12:00",
    "gender": "male",
    "template": "lite"
}

try:
    resp = requests.post("http://localhost:8000/api/v1/fortune", json=payload, timeout=60)
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Success: {data.get('success')}")
    if data.get('report'):
        print(f"Report length: {len(data['report'])} chars")
        print(f"Report preview: {data['report'][:500]}...")
    else:
        print(f"Error: {data}")
except Exception as e:
    print(f"Error: {e}")
