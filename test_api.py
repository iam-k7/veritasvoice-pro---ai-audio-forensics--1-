import base64
import requests
import json

# GUVI SPECIFIC ENDPOINT
BASE_URL = "http://localhost:8000/api/v1/detect"
HEADERS = {"x-api-key": "team-codex-2026", "Content-Type": "application/json"}

def test_api():
    # 1. & 2. Create Dummy MP3 Base64 (Simulating a real file)
    dummy_audio_content = b"ID3\x03\x00\x00\x00\x00\x00\x00" + b"A" * 100
    audio_b64 = base64.b64encode(dummy_audio_content).decode('utf-8')

    payload = {
        "language": "English",
        "audioFormat": "mp3",
        "audioBase64": audio_b64
    }

    print("--- TEST 1: Valid Request (GUVI Spec) ---")
    response = requests.post(BASE_URL, headers=HEADERS, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 2: Invalid Base64 (Negative) ---")
    payload_invalid = payload.copy()
    payload_invalid["audioBase64"] = "not-base64-!!!"
    response = requests.post(BASE_URL, headers=HEADERS, json=payload_invalid)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 3: Unsupported Language (Negative) ---")
    payload_lang = payload.copy()
    payload_lang["language"] = "French"
    response = requests.post(BASE_URL, headers=HEADERS, json=payload_lang)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 4: Missing API Key (Negative) ---")
    response = requests.post(BASE_URL, headers={"Content-Type": "application/json"}, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    test_api()
