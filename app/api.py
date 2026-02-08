from fastapi import APIRouter, HTTPException, Response, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator, Field, ConfigDict
from .detector import VoiceDetector
import base64
from typing import Optional, Dict, Any

router = APIRouter()
detector = VoiceDetector()

MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024 

class DetectionRequest(BaseModel):
    language: str
    audio_format: str = Field("mp3", alias="audioFormat")
    audio_base_64: str = Field(..., alias="audioBase64")

    model_config = ConfigDict(
        populate_by_name=True
    )

    @field_validator('audio_base_64')
    @classmethod
    def validate_base_64_and_format(cls, v: str):
        v = v.strip() if v else v
        if not v:
            raise ValueError("Invalid MP3 audio")
        try:
            decoded = base64.b64decode(v, validate=True)
            if len(decoded) < 10:
                raise ValueError("Invalid MP3 audio")
        except Exception:
            raise ValueError("Invalid MP3 audio")
        if len(v) > (MAX_AUDIO_SIZE_BYTES * 1.5):
            raise ValueError("Payload exceeds limit")
        return v

    @field_validator('language')
    @classmethod
    def validate_language(cls, v: str):
        allowed = ["Tamil", "English", "Hindi", "Malayalam", "Telugu", "ta", "en", "hi", "ml", "te"]
        if v not in allowed:
            raise ValueError("Unsupported language")
        return v

@router.post("/detect")
async def detect_voice(
    request: DetectionRequest, 
    response: Response
):
    """
    GUVI COMPLIANT FORENSIC ENDPOINT
    """
    try:
        # Core forensic analysis
        # detector.analyze handles lang mapping internally
        result = await detector.analyze(request.audio_base_64, request.language)
        
        # Inject audit tracking headers (transparency)
        sig = result.get("forensic_metadata", {}).get("signature", "NONE")
        response.headers["X-Audit-Signature"] = str(sig)
        
        # MANDATORY GUVI RESPONSE SCHEMA
        return {
            "status": "success",
            "language": result["language"],
            "classification": result["prediction"],
            "confidenceScore": result["confidence"],
            "explanation": result["explanation"]
        }
        
    except ValueError as ve:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": f"Malformed request: {str(ve)}"}
        )
    except Exception as e:
        print(f"CRITICAL API ERROR: {str(e)}") # LOGGING!
        # Fallback to local model for stability (Judge's requirement for 99.9% uptime)
        try:
            # Fix fallback execution to match new signature
            try:
                b = base64.b64decode(request.audio_base_64)
            except:
                b = b""
            
            feats = detector._extract_audio_features(b)
            local_result = detector._execute_local_forensic_model(b, feats)
            
            if local_result:
                return {
                    "status": "success",
                    "language": request.language,
                    "classification": local_result["prediction"],
                    "confidenceScore": local_result["confidence"],
                    "explanation": "Verified via local acoustic fingerprint (Engine Fallback)."
                }
        except Exception as fallback_e:
            print(f"CRITICAL FALLBACK ERROR: {fallback_e}")
            pass
            
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Forensic Engine Interruption."}
        )
