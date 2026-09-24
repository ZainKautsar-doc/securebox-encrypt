import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv

from app.routes.crypto import router as crypto_router
from app.routes.file import router as file_router

load_dotenv()

app = FastAPI(
    title="SecureBox Cryptographic API",
    description="Modern encryption and decryption service using AES-256-GCM and ChaCha20-Poly1305 with scrypt KDF",
    version="1.0.0"
)

# CORS setup
cors_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail)
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_msg = "; ".join([f"{err.get('loc', ['field'])[-1]}: {err.get('msg')}" for err in errors])
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": f"Validation Error: {error_msg}"
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": f"Internal Server Error: {str(exc)}"
        }
    )


@app.get("/")
async def root():
    return {
        "service": "SecureBox API",
        "status": "online",
        "supported_algorithms": ["aes-256-gcm", "chacha20-poly1305"],
        "kdf": "scrypt"
    }


# Include Routers
app.include_router(crypto_router)
app.include_router(file_router)
