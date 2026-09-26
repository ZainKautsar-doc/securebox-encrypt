import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Response
from app.models.schemas import (
    HybridEncryptRequest, HybridEncryptResponse,
    HybridDecryptRequest, HybridDecryptResponse
)
from app.crypto.rsa_service import RSAKeyManager
from app.crypto.hybrid_service import encrypt_hybrid, decrypt_hybrid

router = APIRouter(prefix="/api/hybrid", tags=["hybrid"])
rsa_manager = RSAKeyManager()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/encrypt/text", response_model=HybridEncryptResponse)
async def encrypt_text_hybrid(payload: HybridEncryptRequest):
    try:
        public_key = rsa_manager.load_public_key()
        plaintext_bytes = payload.plaintext.encode('utf-8')
        
        enc_session_key, nonce, auth_tag, ciphertext = encrypt_hybrid(plaintext_bytes, public_key)
        
        return HybridEncryptResponse(
            algorithm="aes-256-gcm",
            key_algorithm="rsa-oaep-sha256",
            encrypted_session_key=base64.b64encode(enc_session_key).decode('utf-8'),
            nonce=base64.b64encode(nonce).decode('utf-8'),
            auth_tag=base64.b64encode(auth_tag).decode('utf-8'),
            ciphertext=base64.b64encode(ciphertext).decode('utf-8')
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hybrid text encryption error: {str(e)}"
        )


@router.post("/decrypt/text", response_model=HybridDecryptResponse)
async def decrypt_text_hybrid(payload: HybridDecryptRequest):
    try:
        try:
            enc_session_key = base64.b64decode(payload.encrypted_session_key)
            nonce = base64.b64decode(payload.nonce)
            auth_tag = base64.b64decode(payload.auth_tag)
            ciphertext = base64.b64decode(payload.ciphertext)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid base64 encoding in hybrid payload"
            )

        private_key = rsa_manager.load_private_key()
        plaintext_bytes = decrypt_hybrid(
            encrypted_session_key=enc_session_key,
            nonce=nonce,
            auth_tag=auth_tag,
            ciphertext=ciphertext,
            private_key=private_key
        )

        return HybridDecryptResponse(
            plaintext=plaintext_bytes.decode('utf-8', errors='replace'),
            success=True,
            message="Hybrid decryption successful"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hybrid decryption failed. Invalid RSA key, corrupted ciphertext, or tampered auth tag."
        )


@router.post("/encrypt/file")
async def encrypt_file_hybrid(file: UploadFile = File(...)):
    file_bytes = await file.read()
    file_size = len(file_bytes)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum supported file size is 10 MB."
        )

    try:
        public_key = rsa_manager.load_public_key()
        enc_session_key, nonce, auth_tag, ciphertext = encrypt_hybrid(file_bytes, public_key)

        orig_filename = file.filename or "file.bin"
        headers = {
            "X-Crypto-Algorithm": "aes-256-gcm",
            "X-Crypto-Key-Algorithm": "rsa-oaep-sha256",
            "X-Crypto-Encrypted-Session-Key": base64.b64encode(enc_session_key).decode('utf-8'),
            "X-Crypto-Nonce": base64.b64encode(nonce).decode('utf-8'),
            "X-Crypto-Tag": base64.b64encode(auth_tag).decode('utf-8'),
            "X-Crypto-Original-Filename": orig_filename,
            "X-Crypto-File-Size": str(file_size),
            "Content-Disposition": f'attachment; filename="{orig_filename}.enc"',
            "Access-Control-Expose-Headers": "X-Crypto-Algorithm, X-Crypto-Key-Algorithm, X-Crypto-Encrypted-Session-Key, X-Crypto-Nonce, X-Crypto-Tag, X-Crypto-Original-Filename, X-Crypto-File-Size, Content-Disposition"
        }

        return Response(
            content=ciphertext,
            media_type="application/octet-stream",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hybrid file encryption error: {str(e)}"
        )


@router.post("/decrypt/file")
async def decrypt_file_hybrid(
    file: UploadFile = File(...),
    encrypted_session_key: str = Form(...),
    nonce: str = Form(...),
    tag: str = Form(...)
):
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum supported file size is 10 MB."
        )

    try:
        try:
            enc_session_key_bytes = base64.b64decode(encrypted_session_key)
            nonce_bytes = base64.b64decode(nonce)
            tag_bytes = base64.b64decode(tag)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid base64 encoding in metadata"
            )

        private_key = rsa_manager.load_private_key()
        plaintext_bytes = decrypt_hybrid(
            encrypted_session_key=enc_session_key_bytes,
            nonce=nonce_bytes,
            auth_tag=tag_bytes,
            ciphertext=file_bytes,
            private_key=private_key
        )

        orig_name = file.filename or "decrypted_file"
        if orig_name.endswith(".enc"):
            orig_name = orig_name[:-4]

        headers = {
            "Content-Disposition": f'attachment; filename="{orig_name}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }

        return Response(
            content=plaintext_bytes,
            media_type="application/octet-stream",
            headers=headers
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hybrid file decryption failed. Invalid RSA key, corrupted ciphertext, or tampered auth tag."
        )
