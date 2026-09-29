import os
from typing import Tuple, Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import rsa
from app.crypto.rsa_service import encrypt_rsa_oaep, decrypt_rsa_oaep


def encrypt_hybrid(
    data: bytes,
    public_key: rsa.RSAPublicKey,
    session_key: Optional[bytes] = None,
    nonce: Optional[bytes] = None
) -> Tuple[bytes, bytes, bytes, bytes]:
    """
    Performs hybrid encryption:
    1. Generate random 256-bit (32 bytes) AES session key (if not provided).
    2. Generate random 12-byte nonce (if not provided).
    3. Encrypt data using AES-256-GCM.
    4. Encrypt session key using RSA public key (RSA-OAEP with SHA-256).
    
    Returns: (encrypted_session_key, nonce, auth_tag, ciphertext)
    """
    if session_key is None:
        session_key = AESGCM.generate_key(bit_length=256)
    
    if nonce is None:
        nonce = os.urandom(12)
    
    aesgcm = AESGCM(session_key)
    ciphertext_and_tag = aesgcm.encrypt(nonce, data, None)
    ciphertext = ciphertext_and_tag[:-16]
    auth_tag = ciphertext_and_tag[-16:]
    
    encrypted_session_key = encrypt_rsa_oaep(public_key, session_key)
    
    return encrypted_session_key, nonce, auth_tag, ciphertext


def decrypt_hybrid(
    encrypted_session_key: bytes,
    nonce: bytes,
    auth_tag: bytes,
    ciphertext: bytes,
    private_key: rsa.RSAPrivateKey
) -> bytes:
    """
    Performs hybrid decryption:
    1. Decrypt session key using RSA private key + RSA-OAEP.
    2. Decrypt ciphertext using AES-256-GCM with session key, nonce, and auth_tag.
    
    Returns: decrypted plaintext bytes.
    """
    session_key = decrypt_rsa_oaep(private_key, encrypted_session_key)
    
    aesgcm = AESGCM(session_key)
    ciphertext_and_tag = ciphertext + auth_tag
    plaintext = aesgcm.decrypt(nonce, ciphertext_and_tag, None)
    return plaintext
