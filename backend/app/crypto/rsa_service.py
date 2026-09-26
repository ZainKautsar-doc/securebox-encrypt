import os
from typing import Tuple
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization

# Default key directory outside source code (e.g. backend/keys or configurable via env)
DEFAULT_KEYS_DIR = os.getenv("KEYS_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "keys"))


class RSAKeyManager:
    """
    Manages RSA public/private key pairs.
    Keys are stored outside the source code directory.
    """
    def __init__(self, keys_dir: str = DEFAULT_KEYS_DIR, key_size: int = 2048):
        self.keys_dir = keys_dir
        self.key_size = key_size
        self.private_key_path = os.path.join(self.keys_dir, "private_key.pem")
        self.public_key_path = os.path.join(self.keys_dir, "public_key.pem")
        self.ensure_keys_exist()

    def generate_key_pair(self) -> Tuple[rsa.RSAPrivateKey, rsa.RSAPublicKey]:
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=self.key_size
        )
        public_key = private_key.public_key()
        return private_key, public_key

    def save_keys(self, private_key: rsa.RSAPrivateKey, public_key: rsa.RSAPublicKey) -> None:
        os.makedirs(self.keys_dir, exist_ok=True)
        
        pem_private = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        with open(self.private_key_path, "wb") as f:
            f.write(pem_private)

        pem_public = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        with open(self.public_key_path, "wb") as f:
            f.write(pem_public)

    def ensure_keys_exist(self) -> None:
        if not os.path.exists(self.private_key_path) or not os.path.exists(self.public_key_path):
            private_key, public_key = self.generate_key_pair()
            self.save_keys(private_key, public_key)

    def load_private_key(self, path: str = None) -> rsa.RSAPrivateKey:
        target_path = path or self.private_key_path
        with open(target_path, "rb") as f:
            return serialization.load_pem_private_key(f.read(), password=None)

    def load_public_key(self, path: str = None) -> rsa.RSAPublicKey:
        target_path = path or self.public_key_path
        with open(target_path, "rb") as f:
            return serialization.load_pem_public_key(f.read())


def encrypt_rsa_oaep(public_key: rsa.RSAPublicKey, data: bytes) -> bytes:
    """
    Encrypts data (e.g. AES session key) using RSA-OAEP with SHA-256.
    """
    return public_key.encrypt(
        data,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )


def decrypt_rsa_oaep(private_key: rsa.RSAPrivateKey, encrypted_data: bytes) -> bytes:
    """
    Decrypts data (e.g. encrypted session key) using RSA-OAEP with SHA-256.
    """
    return private_key.decrypt(
        encrypted_data,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
