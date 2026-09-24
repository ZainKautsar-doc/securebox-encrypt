from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "SecureBox API"


def test_text_encrypt_decrypt_aes():
    payload = {
        "plaintext": "Secret message for testing AES route",
        "password": "my_strong_passphrase",
        "algorithm": "aes-256-gcm"
    }
    enc_res = client.post("/api/crypto/encrypt", json=payload)
    assert enc_res.status_code == 200
    enc_data = enc_res.json()
    assert "ciphertext" in enc_data
    assert "salt" in enc_data
    assert "nonce" in enc_data
    assert "tag" in enc_data

    dec_payload = {
        "ciphertext": enc_data["ciphertext"],
        "password": "my_strong_passphrase",
        "algorithm": "aes-256-gcm",
        "salt": enc_data["salt"],
        "nonce": enc_data["nonce"],
        "tag": enc_data["tag"]
    }
    dec_res = client.post("/api/crypto/decrypt", json=dec_payload)
    assert dec_res.status_code == 200
    dec_data = dec_res.json()
    assert dec_data["success"] is True
    assert dec_data["plaintext"] == payload["plaintext"]


def test_text_encrypt_decrypt_chacha20():
    payload = {
        "plaintext": "Secret message for testing ChaCha20 route",
        "password": "my_chacha_passphrase",
        "algorithm": "chacha20-poly1305"
    }
    enc_res = client.post("/api/crypto/encrypt", json=payload)
    assert enc_res.status_code == 200
    enc_data = enc_res.json()

    dec_payload = {
        "ciphertext": enc_data["ciphertext"],
        "password": "my_chacha_passphrase",
        "algorithm": "chacha20-poly1305",
        "salt": enc_data["salt"],
        "nonce": enc_data["nonce"],
        "tag": enc_data["tag"]
    }
    dec_res = client.post("/api/crypto/decrypt", json=dec_payload)
    assert dec_res.status_code == 200
    assert dec_res.json()["plaintext"] == payload["plaintext"]


def test_decrypt_invalid_password_returns_400():
    payload = {
        "plaintext": "Secret message",
        "password": "correct_pass",
        "algorithm": "aes-256-gcm"
    }
    enc_data = client.post("/api/crypto/encrypt", json=payload).json()

    dec_payload = {
        "ciphertext": enc_data["ciphertext"],
        "password": "wrong_password",
        "algorithm": "aes-256-gcm",
        "salt": enc_data["salt"],
        "nonce": enc_data["nonce"],
        "tag": enc_data["tag"]
    }
    dec_res = client.post("/api/crypto/decrypt", json=dec_payload)
    assert dec_res.status_code == 400
    assert "Authentication failed" in dec_res.json()["message"]


def test_invalid_algorithm_returns_400():
    payload = {
        "plaintext": "Secret message",
        "password": "test_pass",
        "algorithm": "des-ede3-cbc"
    }
    enc_res = client.post("/api/crypto/encrypt", json=payload)
    assert enc_res.status_code == 400


def test_file_encrypt_decrypt():
    file_content = b"This is a binary file test content for encryption."
    files = {"file": ("sample.txt", file_content, "text/plain")}
    data = {"password": "file_password_123", "algorithm": "aes-256-gcm"}

    enc_res = client.post("/api/crypto/file/encrypt", files=files, data=data)
    assert enc_res.status_code == 200
    encrypted_bytes = enc_res.content

    salt = enc_res.headers["X-Crypto-Salt"]
    nonce = enc_res.headers["X-Crypto-Nonce"]
    tag = enc_res.headers["X-Crypto-Tag"]

    dec_files = {"file": ("sample.txt.enc", encrypted_bytes, "application/octet-stream")}
    dec_data = {
        "password": "file_password_123",
        "algorithm": "aes-256-gcm",
        "salt": salt,
        "nonce": nonce,
        "tag": tag
    }
    dec_res = client.post("/api/crypto/file/decrypt", files=dec_files, data=dec_data)
    assert dec_res.status_code == 200
    assert dec_res.content == file_content
