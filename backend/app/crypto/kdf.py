import os
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.backends import default_backend


def derive_key(password: str, salt: bytes = None) -> tuple[bytes, bytes]:
    """
    Derives a 256-bit (32-byte) key from a password using scrypt KDF.
    Returns: (key_bytes, salt_bytes)
    """
    if salt is None:
        salt = os.urandom(16)
    
    password_bytes = password.encode('utf-8')
    kdf = Scrypt(
        salt=salt,
        length=32,
        n=2**14,
        r=8,
        p=1,
        backend=default_backend()
    )
    key = kdf.derive(password_bytes)
    return key, salt
