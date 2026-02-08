
# VeritasVoice: AI Audio Forensics

VeritasVoice is an advanced AI-generated voice detection system built for the GUVI 2026 Hackathon. It leverages Google Gemini's multimodal capabilities to perform signal-level forensic analysis on audio samples.

## Key Features
- **Multi-Language Support**: Optimized for Tamil, English, Hindi, Malayalam, and Telugu.
- **Deep Forensic Analysis**: Goes beyond simple classification to provide spectral, prosodic, and voice quality reasoning.
- **Low Latency**: Utilizes `gemini-3-flash` for high-speed, high-accuracy inference (< 2s).
- **Zero Hard-Coding**: Detection is based on real-time signal analysis rather than static rules.

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, TypeScript.
- **Engine**: Google Gemini API (`gemini-3-flash-preview`).
- **Audio Processing**: Web Audio API for real-time visualization and capture.

---

## 📋 How to Access

1. **Open the Application**: 
   - Navigate to http://localhost:3000 in your browser
   - The VeritasVoice forensic dashboard should be visible

2. **Test the Backend API**:
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"ok"}
   ```

---

## 🔧 Running Commands

### Start Backend
```bash
.\.venv\Scripts\activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend
```bash
npm run dev
```

---

## 🧪 Testing the API

You can test the detection endpoint using the included test script:

```bash
# Activate virtual environment first
.\.venv\Scripts\activate.ps1

# Run the test suite
python test_api.py
```

This will test:
- ✅ Valid requests (camelCase format)
- ✅ Legacy snake_case format
- ✅ Invalid base64 handling
- ✅ Unsupported language detection
- ✅ API key authentication

---

## 🎯 Key Features

### Multi-Language Support
- Tamil (ta)
- English (en)
- Hindi (hi)
- Malayalam (ml)
- Telugu (te)

### Scan Modes
- **DEEP**: Comprehensive forensic analysis
- **FAST**: Quick detection

### AI Engine
- **Model**: Google Gemini 3 Flash Preview
- **Latency**: ~1.8s average
- **Confidence Scoring**: Deterministic based on signal analysis

---

## 📁 Project Structure

```
veritasvoice-pro---ai-audio-forensics/
├── app/                    # Backend FastAPI application
│   ├── main.py            # FastAPI app with CORS & auth
│   ├── api.py             # Detection endpoint
│   └── detector.py        # Voice detection logic
├── components/            # React components
│   ├── Header.tsx
│   ├── ForensicDashboard.tsx
│   ├── AudioRecorder.tsx
│   └── AnalysisResult.tsx
├── services/              # Frontend services
│   └── geminiService.ts   # Gemini API integration
├── .env                   # Environment variables (API keys)
├── main.py               # Backend entry point
├── App.tsx               # React app entry
├── index.html            # HTML template
└── test_api.py           # API test suite
```

---

## 🔐 Environment Variables

Required in `.env`:
```env
GEMINI_API_KEY=Google Cloude API Key
X_API_KEY=Create Your API Key
```

---

## 🎓 Hackathon Compliance

✅ **API Endpoint**: `/api/v1/detect`  
✅ **Authentication**: `x-api-key` header validation  
✅ **Request Format**: Supports both camelCase and snake_case  
✅ **Response Schema**: JSON structure  
✅ **Health Checks**: `/` and `/health` endpoints  
✅ **Error Handling**: Standardized error responses  
✅ **Multi-Language**: Tamil, English, Hindi, Malayalam, Telugu  
✅ **Explainable AI**: Technical forensic explanations included  

---

## 🌐 Next Steps

1. **Test the UI**: Open http://localhost:3000 and try recording or uploading audio
2. **Verify API**: Run `python test_api.py` to ensure all endpoints work
3. **Deploy**: Ready for Railway/Cloud Run deployment
4. **Monitor**: Check logs for any errors or warnings

---

## 📞 Support

For issues or questions:
- Check the console logs in both terminal windows
- Verify `.env` file has correct API keys
- Ensure ports 3000 and 8000 are not blocked by firewall

**Status**: 🟢 All systems operational

