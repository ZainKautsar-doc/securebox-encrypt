from pydantic import BaseModel, Field
from typing import Optional


class EncryptRequest(BaseModel):
    plaintext: str = Field(..., min_length=1, description="Text to encrypt")
    password: str = Field(..., min_length=1, description="Passphrase for encryption")
    algorithm: str = Field(..., description="aes-256-gcm or chacha20-poly1305")


class EncryptResponse(BaseModel):
    algorithm: str
    kdf: str
    salt: str  # base64
    nonce: str  # base64
    tag: str  # base64
    ciphertext: str  # base64


class DecryptRequest(BaseModel):
    ciphertext: str = Field(..., min_length=1, description="Base64 encoded ciphertext")
    password: str = Field(..., min_length=1, description="Passphrase for decryption")
    algorithm: str = Field(..., description="aes-256-gcm or chacha20-poly1305")
    salt: str = Field(..., description="Base64 encoded salt")
    nonce: str = Field(..., description="Base64 encoded nonce")
    tag: str = Field(..., description="Base64 encoded auth tag")


class DecryptResponse(BaseModel):
    plaintext: str
    success: bool
    message: str


class FileEncryptResponseMetadata(BaseModel):
    algorithm: str
    kdf: str
    salt: str  # base64
    nonce: str  # base64
    tag: str  # base64
    file_size: int
    filename: Optional[str] = None


class BenchmarkResponse(BaseModel):
    file_size: str
    aes_encrypt_time: float
    aes_decrypt_time: float
    chacha_encrypt_time: float
    chacha_decrypt_time: float
