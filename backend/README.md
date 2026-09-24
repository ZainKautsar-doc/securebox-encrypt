# SecureBox Backend

FastAPI-based cryptographic web service providing authenticated symmetric encryption and key derivation.

## Supported Cryptography
- **AES-256-GCM** (Galois/Counter Mode) with 128-bit authentication tag
- **ChaCha20-Poly1305** (RFC 8439) with 128-bit Poly1305 tag
- **scrypt KDF** ($N=16384, r=8, p=1$) for secure key derivation from user passphrases

## Quickstart

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Server
```bash
python -m uvicorn app.main:app --reload --port 8000
```

API docs will be available at: `http://localhost:8000/docs`

### 3. Run Tests
```bash
pytest
```
