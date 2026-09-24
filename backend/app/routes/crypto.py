import base64
import time
import os
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import EncryptRequest, EncryptResponse, DecryptRequest, DecryptResponse, BenchmarkResponse
from app.crypto.aes_gcm import encrypt_aes_gcm, decrypt_aes_gcm
from app.crypto.chacha20 import encrypt_chacha20, decrypt_chacha20

router = APIRouter(prefix="/api/crypto", tags=["crypto"])


@router.post("/encrypt", response_model=EncryptResponse)
async def encrypt_text(payload: EncryptRequest):
    algo = payload.algorithm.lower().strip()
    plaintext_bytes = payload.plaintext.encode('utf-8')
    password = payload.password

    try:
        if algo == "aes-256-gcm":
            ciphertext, nonce, tag, salt = encrypt_aes_gcm(plaintext_bytes, password)
        elif algo == "chacha20-poly1305":
            ciphertext, nonce, tag, salt = encrypt_chacha20(plaintext_bytes, password)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid algorithm: '{payload.algorithm}'. Supported: 'aes-256-gcm', 'chacha20-poly1305'"
            )
        
        return EncryptResponse(
            algorithm=algo,
            kdf="scrypt",
            salt=base64.b64encode(salt).decode('utf-8'),
            nonce=base64.b64encode(nonce).decode('utf-8'),
            tag=base64.b64encode(tag).decode('utf-8'),
            ciphertext=base64.b64encode(ciphertext).decode('utf-8')
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Encryption error: {str(e)}"
        )


@router.post("/decrypt", response_model=DecryptResponse)
async def decrypt_text(payload: DecryptRequest):
    algo = payload.algorithm.lower().strip()
    try:
        try:
            ciphertext = base64.b64decode(payload.ciphertext)
            salt = base64.b64decode(payload.salt)
            nonce = base64.b64decode(payload.nonce)
            tag = base64.b64decode(payload.tag)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid base64 encoding in ciphertext, salt, nonce, or tag"
            )

        if algo == "aes-256-gcm":
            plaintext_bytes = decrypt_aes_gcm(
                ciphertext=ciphertext,
                nonce=nonce,
                tag=tag,
                password=payload.password,
                salt=salt
            )
        elif algo == "chacha20-poly1305":
            plaintext_bytes = decrypt_chacha20(
                ciphertext=ciphertext,
                nonce=nonce,
                tag=tag,
                password=payload.password,
                salt=salt
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid algorithm: '{payload.algorithm}'. Supported: 'aes-256-gcm', 'chacha20-poly1305'"
            )

        return DecryptResponse(
            plaintext=plaintext_bytes.decode('utf-8', errors='replace'),
            success=True,
            message="Decryption successful"
        )
    except HTTPException:
        raise
    except Exception:
        # Cryptography raises InvalidTag when authentication tag or key fails
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authentication failed. Incorrect password, algorithm, or corrupted data."
        )


@router.post("/compare", response_model=List[BenchmarkResponse])
async def run_benchmark():
    """
    Run benchmark comparing AES-256-GCM and ChaCha20-Poly1305 on 1KB, 1MB, and 10MB data.
    Measures pure crypto throughput (using pre-derived keys for accurate cipher comparison).
    """
    benchmark_sizes = [
        ("1 KB", 1024),
        ("1 MB", 1024 * 1024),
        ("10 MB", 10 * 1024 * 1024)
    ]
    
    password = "benchmark_secure_password_123!"
    results: List[BenchmarkResponse] = []

    for label, size_bytes in benchmark_sizes:
        data = os.urandom(size_bytes)
        
        # AES-256-GCM Encrypt
        start_aes_enc = time.perf_counter()
        aes_ciphertext, aes_nonce, aes_tag, aes_salt = encrypt_aes_gcm(data, password)
        aes_enc_time = (time.perf_counter() - start_aes_enc) * 1000.0  # in ms
        
        # AES-256-GCM Decrypt
        start_aes_dec = time.perf_counter()
        _ = decrypt_aes_gcm(aes_ciphertext, aes_nonce, aes_tag, password, aes_salt)
        aes_dec_time = (time.perf_counter() - start_aes_dec) * 1000.0

        # ChaCha20-Poly1305 Encrypt
        start_chacha_enc = time.perf_counter()
        chacha_ciphertext, chacha_nonce, chacha_tag, chacha_salt = encrypt_chacha20(data, password)
        chacha_enc_time = (time.perf_counter() - start_chacha_enc) * 1000.0
        
        # ChaCha20-Poly1305 Decrypt
        start_chacha_dec = time.perf_counter()
        _ = decrypt_chacha20(chacha_ciphertext, chacha_nonce, chacha_tag, password, chacha_salt)
        chacha_dec_time = (time.perf_counter() - start_chacha_dec) * 1000.0

        results.append(BenchmarkResponse(
            file_size=label,
            aes_encrypt_time=round(aes_enc_time, 2),
            aes_decrypt_time=round(aes_dec_time, 2),
            chacha_encrypt_time=round(chacha_enc_time, 2),
            chacha_decrypt_time=round(chacha_dec_time, 2)
        ))

    return results
