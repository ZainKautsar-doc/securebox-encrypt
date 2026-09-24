import pytest
import os
from app.crypto.kdf import derive_key
from app.crypto.aes_gcm import encrypt_aes_gcm, decrypt_aes_gcm
from app.crypto.chacha20 import encrypt_chacha20, decrypt_chacha20


def test_scrypt_key_derivation():
    password = "SuperSecretPassword123"
    key1, salt1 = derive_key(password)
    assert len(key1) == 32
    assert len(salt1) == 16

    # Same password and salt produces exact same key
    key2, salt2 = derive_key(password, salt=salt1)
    assert key1 == key2
    assert salt1 == salt2


def test_aes_gcm_encrypt_decrypt():
    password = "TestPassword_AES"
    plaintext = b"Hello, this is a top secret message for AES-256-GCM testing!"
    
    ciphertext, nonce, tag, salt = encrypt_aes_gcm(plaintext, password)
    assert len(nonce) == 12
    assert len(tag) == 16
    assert len(salt) == 16
    assert ciphertext != plaintext

    decrypted = decrypt_aes_gcm(ciphertext, nonce, tag, password, salt)
    assert decrypted == plaintext


def test_chacha20_encrypt_decrypt():
    password = "TestPassword_ChaCha20"
    plaintext = b"Hello, this is a secret message for ChaCha20-Poly1305 testing!"

    ciphertext, nonce, tag, salt = encrypt_chacha20(plaintext, password)
    assert len(nonce) == 12
    assert len(tag) == 16
    assert len(salt) == 16
    assert ciphertext != plaintext

    decrypted = decrypt_chacha20(ciphertext, nonce, tag, password, salt)
    assert decrypted == plaintext


def test_wrong_password_fails():
    password = "CorrectPassword"
    wrong_password = "WrongPassword"
    plaintext = b"Confidential data"

    # Test AES
    ciphertext, nonce, tag, salt = encrypt_aes_gcm(plaintext, password)
    with pytest.raises(Exception):
        decrypt_aes_gcm(ciphertext, nonce, tag, wrong_password, salt)

    # Test ChaCha20
    ciphertext, nonce, tag, salt = encrypt_chacha20(plaintext, password)
    with pytest.raises(Exception):
        decrypt_chacha20(ciphertext, nonce, tag, wrong_password, salt)


def test_tampered_ciphertext_fails():
    password = "CorrectPassword"
    plaintext = b"Confidential data to be tampered"

    ciphertext, nonce, tag, salt = encrypt_aes_gcm(plaintext, password)
    # Tamper 1 byte
    tampered_ciphertext = bytearray(ciphertext)
    tampered_ciphertext[0] ^= 0xFF
    
    with pytest.raises(Exception):
        decrypt_aes_gcm(bytes(tampered_ciphertext), nonce, tag, password, salt)
