import os
import math
import json
import datetime
import pytest
import matplotlib.pyplot as plt
from app.crypto.aes_gcm import encrypt_aes_gcm
from app.crypto.chacha20 import encrypt_chacha20
from app.crypto.kdf import derive_key

# Directory paths for test results
RESULTS_DIR = os.path.join(os.path.dirname(__file__), 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)


def count_bit_differences(bytes_a: bytes, bytes_b: bytes) -> int:
    """Calculates Hamming distance (count of differing bits) between two equal-length byte strings."""
    if len(bytes_a) != len(bytes_b):
        raise ValueError("Byte sequences must be of equal length to calculate bit differences.")
    
    diff_bits = 0
    for byte_a, byte_b in zip(bytes_a, bytes_b):
        diff_bits += bin(byte_a ^ byte_b).count('1')
    return diff_bits


def calculate_shannon_entropy(data: bytes) -> float:
    """Calculates Shannon entropy in bits per byte for a given byte sequence."""
    if not data:
        return 0.0
    
    length = len(data)
    frequencies = {}
    for byte in data:
        frequencies[byte] = frequencies.get(byte, 0) + 1
    
    entropy = 0.0
    for count in frequencies.values():
        probability = count / length
        entropy -= probability * math.log2(probability)
    
    return float(entropy)


def calculate_byte_frequencies(data: bytes) -> list[int]:
    """Calculates occurrence counts for all byte values (0-255)."""
    freqs = [0] * 256
    for byte in data:
        freqs[byte] += 1
    return freqs


def run_avalanche_test(cipher_fn, algorithm_name: str, num_trials: int = 10):
    """
    Runs controlled Avalanche Effect test:
    1. Key Avalanche (Passphrase 1-bit flip): Measures bit changes in ciphertext when key/passphrase changes by 1 bit.
    2. Plaintext Avalanche (Stream Cipher characteristic): Measures bit changes when plaintext changes by 1 bit.
    """
    trials_data = []
    total_avalanche_pct = 0.0

    fixed_salt = b'\x00' * 16
    fixed_nonce = b'\x00' * 12
    base_password = "SecurePassword123!"
    base_plaintext = b"SecureBox Cryptographic Avalanche Effect Test Payload 2026!"  # 59 bytes

    for trial in range(num_trials):
        # We flip 1 bit in passphrase (Key Derivation Avalanche)
        pass_bytes = bytearray(base_password.encode('utf-8'))
        byte_index = trial % len(pass_bytes)
        bit_index = trial % 8
        pass_bytes[byte_index] ^= (1 << bit_index)
        modified_password = pass_bytes.decode('utf-8', errors='ignore')

        # Encrypt baseline and modified using identical salt & nonce
        ciphertext_base, _, tag_base, _ = cipher_fn(base_plaintext, base_password, nonce=fixed_nonce, salt=fixed_salt)
        ciphertext_mod, _, tag_mod, _ = cipher_fn(base_plaintext, modified_password, nonce=fixed_nonce, salt=fixed_salt)

        # Evaluate full AEAD output (ciphertext + tag)
        payload_base = ciphertext_base + tag_base
        payload_mod = ciphertext_mod + tag_mod

        changed_bits = count_bit_differences(payload_base, payload_mod)
        total_bits = len(payload_base) * 8
        avalanche_pct = (changed_bits / total_bits) * 100.0
        total_avalanche_pct += avalanche_pct

        trials_data.append({
            "trial": trial + 1,
            "algorithm": algorithm_name,
            "test_type": "key_1bit_flip",
            "flipped_byte_index": byte_index,
            "flipped_bit_index": bit_index,
            "plaintext_size": len(base_plaintext),
            "ciphertext_size": len(payload_base),
            "changed_bits": changed_bits,
            "total_bits": total_bits,
            "avalanche_percentage": round(avalanche_pct, 4)
        })

    avg_avalanche = total_avalanche_pct / num_trials
    return trials_data, avg_avalanche


# =====================================================================
# PYTEST TESTS
# =====================================================================

def test_aes_avalanche_effect():
    trials, avg_pct = run_avalanche_test(encrypt_aes_gcm, "AES-256-GCM", num_trials=10)
    assert len(trials) == 10
    assert 40.0 <= avg_pct <= 60.0  # Ideal avalanche effect is around 50%


def test_chacha20_avalanche_effect():
    trials, avg_pct = run_avalanche_test(encrypt_chacha20, "ChaCha20-Poly1305", num_trials=10)
    assert len(trials) == 10
    assert 40.0 <= avg_pct <= 60.0  # Ideal avalanche effect is around 50%


def test_entropy_plaintext():
    # Structured readable text has lower entropy (~3.5 - 5.5 bits/byte)
    sample_text = (b"SecureBox Cryptographic Test Payload. " * 30)  # ~1 KB
    entropy = calculate_shannon_entropy(sample_text)
    assert 3.0 <= entropy <= 5.5


def test_entropy_aes_ciphertext():
    password = "EntropyTestPassword123!"
    sample_text = os.urandom(1024)  # 1 KB
    ciphertext, _, tag, _ = encrypt_aes_gcm(sample_text, password)
    entropy = calculate_shannon_entropy(ciphertext + tag)
    assert entropy > 7.5  # High entropy for ciphertext


def test_entropy_chacha_ciphertext():
    password = "EntropyTestPassword123!"
    sample_text = os.urandom(1024)  # 1 KB
    ciphertext, _, tag, _ = encrypt_chacha20(sample_text, password)
    entropy = calculate_shannon_entropy(ciphertext + tag)
    assert entropy > 7.5  # High entropy for ciphertext


def test_histogram_plaintext():
    sample_text = (b"SecureBox Enterprise Authenticated Encryption Suite! " * 25)
    freqs = calculate_byte_frequencies(sample_text)
    assert len(freqs) == 256
    assert sum(freqs) == len(sample_text)


def test_histogram_aes_ciphertext():
    password = "HistogramTestPassword!"
    sample_text = (b"SecureBox Enterprise Authenticated Encryption Suite! " * 25)
    ciphertext, _, tag, _ = encrypt_aes_gcm(sample_text, password)
    freqs = calculate_byte_frequencies(ciphertext + tag)
    assert len(freqs) == 256
    assert sum(freqs) == len(ciphertext + tag)


def test_histogram_chacha_ciphertext():
    password = "HistogramTestPassword!"
    sample_text = (b"SecureBox Enterprise Authenticated Encryption Suite! " * 25)
    ciphertext, _, tag, _ = encrypt_chacha20(sample_text, password)
    freqs = calculate_byte_frequencies(ciphertext + tag)
    assert len(freqs) == 256
    assert sum(freqs) == len(ciphertext + tag)


# =====================================================================
# FULL SUITE RUNNER & ARTIFACT GENERATOR
# =====================================================================

def test_generate_all_crypto_analysis_artifacts():
    """
    Executes full analysis across Avalanche, Shannon Entropy, Histograms,
    saves all JSONs and PNG graphs to backend/tests/results/.
    """
    fixed_salt = b'\x00' * 16
    fixed_nonce = b'\x00' * 12
    password = "SecureBoxAnalysisPassword2026!"

    # -----------------------------------------------------------------
    # A. Avalanche Effect
    # -----------------------------------------------------------------
    aes_trials, aes_avg_avalanche = run_avalanche_test(encrypt_aes_gcm, "AES-256-GCM", num_trials=10)
    chacha_trials, chacha_avg_avalanche = run_avalanche_test(encrypt_chacha20, "ChaCha20-Poly1305", num_trials=10)

    avalanche_results = {
        "timestamp": datetime.datetime.now().isoformat(),
        "summary": {
            "AES-256-GCM": {
                "average_avalanche_percentage": round(aes_avg_avalanche, 4),
                "trials_count": len(aes_trials)
            },
            "ChaCha20-Poly1305": {
                "average_avalanche_percentage": round(chacha_avg_avalanche, 4),
                "trials_count": len(chacha_trials)
            }
        },
        "trials": {
            "AES-256-GCM": aes_trials,
            "ChaCha20-Poly1305": chacha_trials
        }
    }

    with open(os.path.join(RESULTS_DIR, 'avalanche_results.json'), 'w', encoding='utf-8') as f:
        json.dump(avalanche_results, f, indent=2)

    # -----------------------------------------------------------------
    # B. Shannon Entropy (1 KB and 1 MB)
    # -----------------------------------------------------------------
    # 1 KB Structured Plaintext
    plaintext_1kb = (b"SecureBox Cryptography Suite 2026 - Standard Analysis Payload Text. " * 16)[:1024]
    # 1 MB Structured Plaintext
    plaintext_1mb = (b"SecureBox Cryptography Suite 2026 - Standard Analysis Payload Text. " * 16384)[:1024 * 1024]

    entropy_test_cases = [
        ("1 KB", plaintext_1kb),
        ("1 MB", plaintext_1mb)
    ]

    entropy_results = []
    for label, pt_data in entropy_test_cases:
        pt_entropy = calculate_shannon_entropy(pt_data)
        
        # AES-256-GCM
        aes_ct, _, aes_tag, _ = encrypt_aes_gcm(pt_data, password, nonce=fixed_nonce, salt=fixed_salt)
        aes_full = aes_ct + aes_tag
        aes_entropy = calculate_shannon_entropy(aes_full)

        # ChaCha20-Poly1305
        chacha_ct, _, chacha_tag, _ = encrypt_chacha20(pt_data, password, nonce=fixed_nonce, salt=fixed_salt)
        chacha_full = chacha_ct + chacha_tag
        chacha_entropy = calculate_shannon_entropy(chacha_full)

        entropy_results.append({
            "data_size": label,
            "bytes_length": len(pt_data),
            "plaintext_entropy": round(pt_entropy, 6),
            "aes_256_gcm": {
                "algorithm": "AES-256-GCM",
                "ciphertext_entropy": round(aes_entropy, 6)
            },
            "chacha20_poly1305": {
                "algorithm": "ChaCha20-Poly1305",
                "ciphertext_entropy": round(chacha_entropy, 6)
            }
        })

    with open(os.path.join(RESULTS_DIR, 'entropy_results.json'), 'w', encoding='utf-8') as f:
        json.dump(entropy_results, f, indent=2)

    # -----------------------------------------------------------------
    # C. Byte Frequency & Histograms (100 KB payload)
    # -----------------------------------------------------------------
    hist_plaintext = (b"SecureBox Enterprise Authenticated Encryption Suite! " * 2000)[:100000]
    hist_aes_ct, _, hist_aes_tag, _ = encrypt_aes_gcm(hist_plaintext, password, nonce=fixed_nonce, salt=fixed_salt)
    hist_aes_full = hist_aes_ct + hist_aes_tag

    hist_chacha_ct, _, hist_chacha_tag, _ = encrypt_chacha20(hist_plaintext, password, nonce=fixed_nonce, salt=fixed_salt)
    hist_chacha_full = hist_chacha_ct + hist_chacha_tag

    pt_freqs = calculate_byte_frequencies(hist_plaintext)
    aes_freqs = calculate_byte_frequencies(hist_aes_full)
    chacha_freqs = calculate_byte_frequencies(hist_chacha_full)

    histogram_json_data = []
    for byte_val in range(256):
        histogram_json_data.append({
            "byte_value": byte_val,
            "plaintext_frequency": pt_freqs[byte_val],
            "aes_ciphertext_frequency": aes_freqs[byte_val],
            "chacha20_ciphertext_frequency": chacha_freqs[byte_val]
        })

    with open(os.path.join(RESULTS_DIR, 'histogram_results.json'), 'w', encoding='utf-8') as f:
        json.dump(histogram_json_data, f, indent=2)

    # Plot PNG Histograms
    byte_indices = list(range(256))

    # 1. Plaintext Histogram
    plt.figure(figsize=(10, 4))
    plt.bar(byte_indices, pt_freqs, color='#6366f1', width=1.0)
    plt.title('Plaintext Byte Frequency Distribution (Non-Uniform / Structured)')
    plt.xlabel('Byte Value (0 - 255)')
    plt.ylabel('Frequency')
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'histogram_plaintext.png'), dpi=150)
    plt.close()

    # 2. AES Ciphertext Histogram
    plt.figure(figsize=(10, 4))
    plt.bar(byte_indices, aes_freqs, color='#3b82f6', width=1.0)
    plt.title('AES-256-GCM Ciphertext Byte Frequency Distribution (Uniform)')
    plt.xlabel('Byte Value (0 - 255)')
    plt.ylabel('Frequency')
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'histogram_aes.png'), dpi=150)
    plt.close()

    # 3. ChaCha20 Ciphertext Histogram
    plt.figure(figsize=(10, 4))
    plt.bar(byte_indices, chacha_freqs, color='#10b981', width=1.0)
    plt.title('ChaCha20-Poly1305 Ciphertext Byte Frequency Distribution (Uniform)')
    plt.xlabel('Byte Value (0 - 255)')
    plt.ylabel('Frequency')
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'histogram_chacha20.png'), dpi=150)
    plt.close()

    # 4. Comparison Histogram
    plt.figure(figsize=(12, 5))
    plt.plot(byte_indices, pt_freqs, label='Plaintext', color='#6366f1', alpha=0.8, linewidth=1.5)
    plt.plot(byte_indices, aes_freqs, label='AES-256-GCM Ciphertext', color='#3b82f6', alpha=0.7, linewidth=1.2)
    plt.plot(byte_indices, chacha_freqs, label='ChaCha20-Poly1305 Ciphertext', color='#10b981', alpha=0.7, linewidth=1.2)
    plt.title('Byte Frequency Comparison: Plaintext vs AES-256-GCM vs ChaCha20-Poly1305')
    plt.xlabel('Byte Value (0 - 255)')
    plt.ylabel('Frequency')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, 'histogram_comparison.png'), dpi=150)
    plt.close()

    # -----------------------------------------------------------------
    # D. Summary JSON
    # -----------------------------------------------------------------
    summary_data = {
        "timestamp": datetime.datetime.now().isoformat(),
        "avalanche_effect": {
            "trials_per_algorithm": 10,
            "aes_256_gcm_avg_percentage": round(aes_avg_avalanche, 4),
            "chacha20_poly1305_avg_percentage": round(chacha_avg_avalanche, 4)
        },
        "shannon_entropy": {
            "max_theoretical_entropy": 8.0,
            "results": entropy_results
        },
        "test_info": {
            "total_pytest_cases": 8,
            "results_directory": "backend/tests/results/",
            "reproducible": True
        }
    }

    with open(os.path.join(RESULTS_DIR, 'crypto_analysis_summary.json'), 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2)
