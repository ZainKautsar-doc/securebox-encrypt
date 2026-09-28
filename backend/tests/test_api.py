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


def test_decrypt_with_corrupted_ciphertext_detected():
    payload = {
        "plaintext": "Confidential research data",
        "password": "strong_password_999",
        "algorithm": "aes-256-gcm"
    }
    enc_data = client.post("/api/crypto/encrypt", json=payload).json()
    checksum = enc_data["checksum_sha256"]

    # Tamper with the ciphertext (flip characters)
    tampered_ciphertext = enc_data["ciphertext"][:-4] + "AAAA"

    dec_payload = {
        "ciphertext": tampered_ciphertext,
        "password": "strong_password_999",
        "algorithm": "aes-256-gcm",
        "salt": enc_data["salt"],
        "nonce": enc_data["nonce"],
        "tag": enc_data["tag"],
        "checksum_sha256": checksum
    }
    dec_res = client.post("/api/crypto/decrypt", json=dec_payload)
    assert dec_res.status_code == 400
    assert "korup" in dec_res.json()["message"].lower() or "checksum" in dec_res.json()["message"].lower()


def test_decrypt_with_wrong_password_identified_accurately():
    payload = {
        "plaintext": "Confidential research data",
        "password": "correct_password_123",
        "algorithm": "aes-256-gcm"
    }
    enc_data = client.post("/api/crypto/encrypt", json=payload).json()

    # Untampered ciphertext with checksum, but wrong password
    dec_payload = {
        "ciphertext": enc_data["ciphertext"],
        "password": "definitely_wrong_password",
        "algorithm": "aes-256-gcm",
        "salt": enc_data["salt"],
        "nonce": enc_data["nonce"],
        "tag": enc_data["tag"],
        "checksum_sha256": enc_data["checksum_sha256"]
    }
    dec_res = client.post("/api/crypto/decrypt", json=dec_payload)
    assert dec_res.status_code == 400
    assert "password salah" in dec_res.json()["message"].lower()


def test_file_decrypt_with_corrupted_file_detected():
    file_content = b"Top secret document contents."
    files = {"file": ("report.pdf", file_content, "application/pdf")}
    data = {"password": "pdf_secret_pass", "algorithm": "aes-256-gcm"}

    enc_res = client.post("/api/crypto/file/encrypt", files=files, data=data)
    assert enc_res.status_code == 200
    encrypted_bytes = enc_res.content
    checksum = enc_res.headers["X-Crypto-Checksum-Sha256"]

    # Tamper with 1 byte in the encrypted file
    tampered_bytes = bytearray(encrypted_bytes)
    tampered_bytes[10] ^= 0xFF

    dec_files = {"file": ("report.pdf.enc", bytes(tampered_bytes), "application/octet-stream")}
    dec_data = {
        "password": "pdf_secret_pass",
        "algorithm": "aes-256-gcm",
        "salt": enc_res.headers["X-Crypto-Salt"],
        "nonce": enc_res.headers["X-Crypto-Nonce"],
        "tag": enc_res.headers["X-Crypto-Tag"],
        "checksum": checksum
    }
    dec_res = client.post("/api/crypto/file/decrypt", files=dec_files, data=dec_data)
    assert dec_res.status_code == 400
    assert "rusak atau korup" in dec_res.json()["message"].lower()


def test_file_decrypt_with_wrong_password_identified_accurately():
    file_content = b"Top secret document contents."
    files = {"file": ("report.pdf", file_content, "application/pdf")}
    data = {"password": "correct_file_pass", "algorithm": "aes-256-gcm"}

    enc_res = client.post("/api/crypto/file/encrypt", files=files, data=data)
    assert enc_res.status_code == 200
    checksum = enc_res.headers["X-Crypto-Checksum-Sha256"]

    # File is intact, but password is wrong
    dec_files = {"file": ("report.pdf.enc", enc_res.content, "application/octet-stream")}
    dec_data = {
        "password": "wrong_file_pass",
        "algorithm": "aes-256-gcm",
        "salt": enc_res.headers["X-Crypto-Salt"],
        "nonce": enc_res.headers["X-Crypto-Nonce"],
        "tag": enc_res.headers["X-Crypto-Tag"],
        "checksum": checksum
    }
    dec_res = client.post("/api/crypto/file/decrypt", files=dec_files, data=dec_data)
    assert dec_res.status_code == 400
    assert "password salah" in dec_res.json()["message"].lower()

