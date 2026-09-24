import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.crypto.kdf import derive_key


def encrypt_aes_gcm(plaintext: bytes, password: str, nonce: bytes = None, salt: bytes = None) -> tuple[bytes, bytes, bytes, bytes]:
    """
    Encrypts plaintext using AES-256-GCM.
    Returns: (ciphertext, nonce, tag, salt)
    Note: In cryptography library AESGCM, encrypt returns ciphertext + 16-byte tag appended at the end.
    We split ciphertext and tag for explicit schema output.
    """
    key, salt = derive_key(password, salt)
    if nonce is None:
        nonce = os.urandom(12)
    
    aesgcm = AESGCM(key)
    # ciphertext_and_tag contains ciphertext + 16 bytes tag
    ciphertext_and_tag = aesgcm.encrypt(nonce, plaintext, None)
    ciphertext = ciphertext_and_tag[:-16]
    tag = ciphertext_and_tag[-16:]
    return ciphertext, nonce, tag, salt


def decrypt_aes_gcm(ciphertext: bytes, nonce: bytes, tag: bytes, password: str, salt: bytes) -> bytes:
    """
    Decrypts AES-256-GCM ciphertext using password and metadata.
    Raises InvalidTag or Exception if authentication/decryption fails.
    """
    key, _ = derive_key(password, salt)
    aesgcm = AESGCM(key)
    ciphertext_and_tag = ciphertext + tag
    plaintext = aesgcm.decrypt(nonce, ciphertext_and_tag, None)
    return plaintext
