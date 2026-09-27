import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.crypto.kdf import derive_key


def encrypt_aes_gcm(plaintext: bytes, password: str, nonce: bytes | None = None, salt: bytes | None = None) -> tuple[bytes, bytes, bytes, bytes]:
    """
    Mengenkripsi plaintext menggunakan algoritma simetris AES-256-GCM (NIST SP 800-38D).
    
    Tahapan:
    1. Menurunkan kunci 256-bit dan salt acak (16 byte) dari password via scrypt KDF.
    2. Menghasilkan nonce/IV acak (12 byte / 96-bit) jika belum disediakan.
    3. Mengenkripsi payload dan menghasilkan 16-byte authentication tag (Galois MAC).
    
    Returns: (ciphertext, nonce, tag, salt)
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
