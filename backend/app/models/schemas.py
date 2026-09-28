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
    checksum_sha256: Optional[str] = None  # sha256 hex digest of ciphertext


class DecryptRequest(BaseModel):
    ciphertext: str = Field(..., min_length=1, description="Base64 encoded ciphertext")
    password: str = Field(..., min_length=1, description="Passphrase for decryption")
    algorithm: str = Field(..., description="aes-256-gcm or chacha20-poly1305")
    salt: str = Field(..., description="Base64 encoded salt")
    nonce: str = Field(..., description="Base64 encoded nonce")
    tag: str = Field(..., description="Base64 encoded auth tag")
    checksum_sha256: Optional[str] = None  # Optional integrity checksum


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
    checksum_sha256: Optional[str] = None



class BenchmarkResponse(BaseModel):
    file_size: str
    aes_encrypt_time: float
    aes_decrypt_time: float
    chacha_encrypt_time: float
    chacha_decrypt_time: float


class HybridEncryptRequest(BaseModel):
    plaintext: str = Field(..., min_length=1, description="Text to encrypt using hybrid encryption")


class HybridEncryptResponse(BaseModel):
    algorithm: str = "aes-256-gcm"
    key_algorithm: str = "rsa-oaep-sha256"
    encrypted_session_key: str  # base64
    nonce: str  # base64
    auth_tag: str  # base64
    ciphertext: str  # base64


class HybridDecryptRequest(BaseModel):
    encrypted_session_key: str = Field(..., min_length=1, description="Base64 encoded encrypted session key")
    nonce: str = Field(..., min_length=1, description="Base64 encoded nonce")
    auth_tag: str = Field(..., min_length=1, description="Base64 encoded authentication tag")
    ciphertext: str = Field(..., min_length=1, description="Base64 encoded ciphertext")


class HybridDecryptResponse(BaseModel):
    plaintext: str
    success: bool
    message: str

