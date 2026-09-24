import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Response
from app.crypto.aes_gcm import encrypt_aes_gcm, decrypt_aes_gcm
from app.crypto.chacha20 import encrypt_chacha20, decrypt_chacha20

router = APIRouter(prefix="/api/crypto/file", tags=["file"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/encrypt")
async def encrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
    algorithm: str = Form(...)
):
    if not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password cannot be empty")
    
    file_bytes = await file.read()
    file_size = len(file_bytes)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum supported file size is 10 MB."
        )
    
    algo = algorithm.lower().strip()
    try:
        if algo == "aes-256-gcm":
            ciphertext, nonce, tag, salt = encrypt_aes_gcm(file_bytes, password)
        elif algo == "chacha20-poly1305":
            ciphertext, nonce, tag, salt = encrypt_chacha20(file_bytes, password)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid algorithm: '{algorithm}'. Supported: 'aes-256-gcm', 'chacha20-poly1305'"
            )
        
        # We send metadata in custom response headers and encrypted ciphertext binary in body
        salt_b64 = base64.b64encode(salt).decode('utf-8')
        nonce_b64 = base64.b64encode(nonce).decode('utf-8')
        tag_b64 = base64.b64encode(tag).decode('utf-8')
        orig_filename = file.filename or "file.bin"
        
        headers = {
            "X-Crypto-Algorithm": algo,
            "X-Crypto-KDF": "scrypt",
            "X-Crypto-Salt": salt_b64,
            "X-Crypto-Nonce": nonce_b64,
            "X-Crypto-Tag": tag_b64,
            "X-Crypto-Original-Filename": orig_filename,
            "X-Crypto-File-Size": str(file_size),
            "Content-Disposition": f'attachment; filename="{orig_filename}.enc"',
            "Access-Control-Expose-Headers": "X-Crypto-Algorithm, X-Crypto-KDF, X-Crypto-Salt, X-Crypto-Nonce, X-Crypto-Tag, X-Crypto-Original-Filename, X-Crypto-File-Size, Content-Disposition"
        }
        
        return Response(
            content=ciphertext,
            media_type="application/octet-stream",
            headers=headers
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File encryption failed: {str(e)}"
        )


@router.post("/decrypt")
async def decrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
    algorithm: str = Form(...),
    salt: str = Form(...),
    nonce: str = Form(...),
    tag: str = Form(...)
):
    if not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password cannot be empty")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum supported file size is 10 MB."
        )

    algo = algorithm.lower().strip()
    try:
        try:
            salt_bytes = base64.b64decode(salt)
            nonce_bytes = base64.b64decode(nonce)
            tag_bytes = base64.b64decode(tag)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid base64 encoding in salt, nonce, or tag metadata."
            )

        if algo == "aes-256-gcm":
            plaintext_bytes = decrypt_aes_gcm(
                ciphertext=file_bytes,
                nonce=nonce_bytes,
                tag=tag_bytes,
                password=password,
                salt=salt_bytes
            )
        elif algo == "chacha20-poly1305":
            plaintext_bytes = decrypt_chacha20(
                ciphertext=file_bytes,
                nonce=nonce_bytes,
                tag=tag_bytes,
                password=password,
                salt=salt_bytes
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid algorithm: '{algorithm}'. Supported: 'aes-256-gcm', 'chacha20-poly1305'"
            )

        # Remove .enc extension if present
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
            detail="Authentication failed. Incorrect password, algorithm, corrupted metadata, or tampered file."
        )
