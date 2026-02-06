import os
from dotenv import load_dotenv

# Load environment variables from the .env file only if it exists (local development)
# Cloud Run will use environment variables set in the console
env_path = os.path.join(os.getcwd(), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

from fastapi import FastAPI, Header, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router

app = FastAPI(title="VeritasVoice Forensic API", version="1.0.0")

# GUVI Requirement: Standardized Error JSON
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"status": "error", "message": "Invalid API key or malformed request"},
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "message": "Invalid API key or malformed request"},
    )
# VALID_API_KEY is retrieved exclusively from the HACKATHON_API_KEY environment variable.
VALID_API_KEY = os.getenv("HACKATHON_API_KEY")

async def verify_api_key(x_api_key: str = Header(None, alias="x-api-key")):
    """
    Strict dependency to verify the API key provided in the 'x-api-key' header.
    Matches against the HACKATHON_API_KEY loaded from the .env configuration.
    """
    if not VALID_API_KEY:
        # Critical failure: Server environment is not configured with a security key.
        raise HTTPException(
            status_code=500, 
            detail="Forensic node security configuration (HACKATHON_API_KEY) is missing."
        )
    
    if x_api_key is None:
        # Client failed to provide the required authentication header.
        raise HTTPException(
            status_code=401, 
            detail="Unauthorized: 'x-api-key' header is missing from the request."
        )
        
    if x_api_key != VALID_API_KEY:
        # Client provided an incorrect authentication key.
        raise HTTPException(
            status_code=401, 
            detail="Unauthorized: Invalid x-api-key provided. Authentication failed."
        )
    
    return x_api_key

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# All evaluation endpoints are protected by the verify_api_key dependency
app.include_router(api_router, prefix="/api/v1", dependencies=[Depends(verify_api_key)])

# Issue 4: Add Health Root Endpoint
@app.get("/")
def health_root():
    return {"status": "ok"}

@app.get("/health")
def health_check():
    """
    System status endpoint for automated evaluation checks.
    """
    return {"status": "ok"}
