import pytest
import os
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric import rsa
from app.crypto.rsa_service import RSAKeyManager, encrypt_rsa_oaep, decrypt_rsa_oaep
from app.crypto.hybrid_service import encrypt_hybrid, decrypt_hybrid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_rsa_key_manager(tmp_path):
    keys_dir = os.path.join(tmp_path, "keys")
    manager = RSAKeyManager(keys_dir=keys_dir)
    assert os.path.exists(manager.private_key_path)
    assert os.path.exists(manager.public_key_path)
    
    priv_key = manager.load_private_key()
    pub_key = manager.load_public_key()
    assert isinstance(priv_key, rsa.RSAPrivateKey)
    assert isinstance(pub_key, rsa.RSAPublicKey)


def test_rsa_encrypted_session_key_decryption(tmp_path):
    """TEST 3: RSA encrypted session key bisa didecrypt kembali."""
    manager = RSAKeyManager(keys_dir=os.path.join(tmp_path, "keys"))
    priv_key = manager.load_private_key()
    pub_key = manager.load_public_key()

    session_key = os.urandom(32)
    enc_session_key = encrypt_rsa_oaep(pub_key, session_key)
    dec_session_key = decrypt_rsa_oaep(priv_key, enc_session_key)

    assert dec_session_key == session_key


def test_hybrid_text_encrypt_decrypt():
    """TEST 1: Hybrid text encrypt/decrypt berhasil."""
    payload = {"plaintext": "Sensitif Rahasia Hybrid Text 123!"}
    enc_res = client.post("/api/hybrid/encrypt/text", json=payload)
    assert enc_res.status_code == 200
    enc_data = enc_res.json()

    assert enc_data["algorithm"] == "aes-256-gcm"
    assert enc_data["key_algorithm"] == "rsa-oaep-sha256"
    assert "encrypted_session_key" in enc_data
    assert "nonce" in enc_data
    assert "auth_tag" in enc_data
    assert "ciphertext" in enc_data

    dec_res = client.post("/api/hybrid/decrypt/text", json={
        "encrypted_session_key": enc_data["encrypted_session_key"],
        "nonce": enc_data["nonce"],
        "auth_tag": enc_data["auth_tag"],
        "ciphertext": enc_data["ciphertext"]
    })
    assert dec_res.status_code == 200
    dec_data = dec_res.json()
    assert dec_data["success"] is True
    assert dec_data["plaintext"] == payload["plaintext"]


def test_hybrid_file_encrypt_decrypt():
    """TEST 2: Hybrid file encrypt/decrypt berhasil."""
    file_content = b"Dokumen penting file rahasia untuk pengujian hybrid file!"
    files = {"file": ("rahasia.pdf", file_content, "application/pdf")}

    enc_res = client.post("/api/hybrid/encrypt/file", files=files)
    assert enc_res.status_code == 200
    encrypted_bytes = enc_res.content

    enc_session_key = enc_res.headers["X-Crypto-Encrypted-Session-Key"]
    nonce = enc_res.headers["X-Crypto-Nonce"]
    tag = enc_res.headers["X-Crypto-Tag"]

    dec_files = {"file": ("rahasia.pdf.enc", encrypted_bytes, "application/octet-stream")}
    dec_data = {
        "encrypted_session_key": enc_session_key,
        "nonce": nonce,
        "tag": tag
    }
    dec_res = client.post("/api/hybrid/decrypt/file", files=dec_files, data=dec_data)
    assert dec_res.status_code == 200
    assert dec_res.content == file_content


def test_wrong_rsa_private_key_fails(tmp_path):
    """TEST 4: Wrong RSA private key menyebabkan decrypt gagal."""
    # Generate original key
    manager1 = RSAKeyManager(keys_dir=os.path.join(tmp_path, "keys1"))
    pub_key1 = manager1.load_public_key()
    
    # Generate wrong key
    manager2 = RSAKeyManager(keys_dir=os.path.join(tmp_path, "keys2"))
    wrong_priv_key = manager2.load_private_key()

    enc_session_key, nonce, auth_tag, ciphertext = encrypt_hybrid(b"Data Test", pub_key1)

    with pytest.raises(Exception):
        decrypt_hybrid(enc_session_key, nonce, auth_tag, ciphertext, wrong_priv_key)


def test_tampered_ciphertext_fails(tmp_path):
    """TEST 5: Ciphertext yang diubah menyebabkan decrypt gagal."""
    manager = RSAKeyManager(keys_dir=os.path.join(tmp_path, "keys"))
    pub_key = manager.load_public_key()
    priv_key = manager.load_private_key()

    enc_session_key, nonce, auth_tag, ciphertext = encrypt_hybrid(b"Data Asli Rahasia", pub_key)

    # Tamper 1 byte ciphertext
    tampered_ciphertext = bytearray(ciphertext)
    tampered_ciphertext[0] ^= 0xFF

    with pytest.raises(Exception):
        decrypt_hybrid(enc_session_key, nonce, auth_tag, bytes(tampered_ciphertext), priv_key)


def test_tampered_auth_tag_fails(tmp_path):
    """TEST 6: Authentication tag yang diubah menyebabkan decrypt gagal."""
    manager = RSAKeyManager(keys_dir=os.path.join(tmp_path, "keys"))
    pub_key = manager.load_public_key()
    priv_key = manager.load_private_key()

    enc_session_key, nonce, auth_tag, ciphertext = encrypt_hybrid(b"Data Asli Rahasia", pub_key)

    # Tamper 1 byte auth tag
    tampered_tag = bytearray(auth_tag)
    tampered_tag[0] ^= 0xFF

    with pytest.raises(Exception):
        decrypt_hybrid(enc_session_key, nonce, bytes(tampered_tag), ciphertext, priv_key)
