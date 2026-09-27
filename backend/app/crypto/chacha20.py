import os
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
from app.crypto.kdf import derive_key


def encrypt_chacha20(plaintext: bytes, password: str, nonce: bytes | None = None, salt: bytes | None = None) -> tuple[bytes, bytes, bytes, bytes]:
    """
    Encrypts plaintext using ChaCha20-Poly1305.
    Returns: (ciphertext, nonce, tag, salt)
    """
    key, salt = derive_key(password, salt)
    if nonce is None:
        nonce = os.urandom(12)
    
    chacha = ChaCha20Poly1305(key)
    ciphertext_and_tag = chacha.encrypt(nonce, plaintext, None)
    ciphertext = ciphertext_and_tag[:-16]
    tag = ciphertext_and_tag[-16:]
    return ciphertext, nonce, tag, salt


def decrypt_chacha20(ciphertext: bytes, nonce: bytes, tag: bytes, password: str, salt: bytes) -> bytes:
    """
    Decrypts ChaCha20-Poly1305 ciphertext using password and metadata.
    Raises InvalidTag or Exception if authentication/decryption fails.
    """
    key, _ = derive_key(password, salt)
    chacha = ChaCha20Poly1305(key)
    ciphertext_and_tag = ciphertext + tag
    plaintext = chacha.decrypt(nonce, ciphertext_and_tag, None)
    return plaintext
