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

    print("--- TEST 1: Request with camelCase (Official GUVI Spec) ---")
    payload_camel = {
        "language": "English",
        "audioFormat": "mp3",
        "audioBase64": audio_b64
    }
    response = requests.post(BASE_URL, headers=HEADERS, json=payload_camel)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 2: Request with snake_case (Legacy/Internal) ---")
    payload_snake = {
        "language": "English",
        "audio_format": "mp3",
        "audio_base_64": audio_b64
    }
    response = requests.post(BASE_URL, headers=HEADERS, json=payload_snake)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 3: Invalid Base64 (Negative) ---")
    payload_invalid = payload_camel.copy()
    payload_invalid["audioBase64"] = "not-base64-!!!"
    response = requests.post(BASE_URL, headers=HEADERS, json=payload_invalid)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 4: Unsupported Language (Negative) ---")
    payload_lang = payload_camel.copy()
    payload_lang["language"] = "French"
    response = requests.post(BASE_URL, headers=HEADERS, json=payload_lang)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    print("\n--- TEST 5: Missing API Key (Negative) ---")
    response = requests.post(BASE_URL, headers={"Content-Type": "application/json"}, json=payload_camel)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    test_api()
