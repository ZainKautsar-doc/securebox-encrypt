import os
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.backends import default_backend


def derive_key(password: str, salt: bytes | None = None) -> tuple[bytes, bytes]:
    """
    Menurunkan Kunci Enkripsi Simetris 256-bit (32 byte) dari password menggunakan scrypt KDF (RFC 7914).
    
    Parameter:
    - n = 16384 (2^14): CPU & Memory cost parameter.
    - r = 8: Block size parameter.
    - p = 1: Parallelization parameter.
    
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
