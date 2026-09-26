# 📊 Pengujian & Analisis Kriptografi SecureBox

Dokumen ini berisi penjelasan metodologi, rumus matematis, prosedur eksekusi, serta analisis objektif hasil pengujian kriptografi pada engine **SecureBox** yang meliputi:
1. **Avalanche Effect** (Pengaruh Perubahan 1-bit Kunci/Passphrase terhadap Ciphertext).
2. **Shannon Entropy** (Acaknya Distribusi Byte Ciphertext).
3. **Byte Frequency Histogram** (Keseragaman Distribusi Nilai Byte 0 - 255).

---

## 🎯 1. Tujuan Pengujian

Pengujian ini bertujuan untuk mengukur secara kuantitatif sifat-sifat matematis dari algoritma **AES-256-GCM** dan **ChaCha20-Poly1305** yang diimplementasikan pada backend FastAPI SecureBox. Pengujian memverifikasi dua prinsip penting kriptografi simetris terotentikasi (AEAD):
- **Confusion & Diffusion**: Bahwa perubahan terkecil pada kunci/passphrase menghasilkan perubahan acak mendekati 50% pada bit ciphertext (*Avalanche Effect*).
- **Indistinguishability from Random Noise**: Bahwa ciphertext yang dihasilkan tidak memiliki pola yang dapat diprediksi (*Shannon Entropy* tinggi ~8.0 bits/byte dan *Byte Distribution* yang seragam/uniform).

---

## 📐 2. Rumus & Metodologi Matematis

### A. Avalanche Effect (%)
Avalanche Effect mengukur persentase bit ciphertext yang berubah ketika 1 bit kunci/passphrase diubah.

$$\text{Avalanche Effect (\%)} = \left( \frac{\text{Jumlah Bit Berbeda antara Ciphertext A dan B}}{\text{Total Bit Ciphertext}} \right) \times 100$$

- **Jarak Hamming ($\text{Hamming Distance}$)**:
  $$\text{Diff Bits} = \sum_{i} \text{popcount}(\text{Byte}_A[i] \oplus \text{Byte}_B[i])$$
- **Metodologi**:
  1. Plaintext, Salt, dan Nonce dikontrol agar identik (*fixed nonce & salt*).
  2. Passphrase dasar diubah tepat 1 bit pada 10 percobaan acak berbeda.
  3. Hasil ciphertext + auth tag dari kedua kondisi dibandingkan bit demi bit.
  4. Ideal Avalanche Effect untuk cipher simetris yang kuat adalah **~50%**.

---

### B. Shannon Entropy ($H(X)$)
Shannon Entropy mengukur tingkat ketidakpastian atau acaknya informasi dalam deretan byte (skala 0.0 sampai 8.0 bits per byte).

$$H(X) = -\sum_{i=0}^{255} p(x_i) \log_2 p(x_i)$$

di mana:
- $p(x_i)$ adalah probabilitas kemunculan nilai byte $x_i \in [0, 255]$ dalam data.
- Nilai $H(X)$ maksimal untuk ciphertext biner acak sempurna adalah **8.0 bits/byte**.
- Structured Plaintext (seperti teks bahasa manusia) biasanya memiliki entropi **3.5 – 5.5 bits/byte**.

---

### C. Byte Frequency Histogram
Menghitung frekuensi kemunculan setiap nilai byte dari $0$ hingga $255$ pada data.
- **Plaintext**: Memiliki puncak-puncak frekuensi tinggi pada karakter ASCII tertentu (seperti spasi, huruf vokal, dll).
- **Ciphertext**: Memiliki grafik yang rata/uniform mendekati rata-rata $\frac{N}{256}$, menandakan tidak adanya kebocoran statistik frekuensi byte.

---

## 🚀 3. Perintah Eksekusi Testing

Seluruh pengujian berada pada file `backend/tests/test_crypto_analysis.py` dan dapat dijalankan dengan Pytest:

```bash
# Navigasi ke folder backend
cd backend

# Jalankan seluruh test suite analisis kriptografi
python -m pytest tests/test_crypto_analysis.py -v

# Atau jalankan seluruh unit & integration test project
python -m pytest
```

---

## 📁 4. Lokasi Output & Artifact Hasil

Seluruh hasil aktual disimpan otomatis ke dalam direktori `backend/tests/results/`:

| Nama File | Deskripsi File |
| :--- | :--- |
| [`results/crypto_analysis_summary.json`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/crypto_analysis_summary.json) | Ringkasan hasil rata-rata Avalanche, Entropi 1KB/1MB, dan timestamp. |
| [`results/avalanche_results.json`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/avalanche_results.json) | Rincian 10 percobaan *bit-flip* per algoritma (changed bits & percentage). |
| [`results/entropy_results.json`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/entropy_results.json) | Nilai entropi kuantitatif untuk Plaintext vs AES-256-GCM vs ChaCha20-Poly1305. |
| [`results/histogram_results.json`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/histogram_results.json) | Frekuensi 256 nilai byte (0-255) dalam format JSON. |
| [`results/histogram_plaintext.png`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/histogram_plaintext.png) | Visualisasi grafik batang distribusi byte Plaintext. |
| [`results/histogram_aes.png`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/histogram_aes.png) | Visualisasi grafik batang distribusi byte Ciphertext AES-256-GCM. |
| [`results/histogram_chacha20.png`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/histogram_chacha20.png) | Visualisasi grafik batang distribusi byte Ciphertext ChaCha20-Poly1305. |
| [`results/histogram_comparison.png`](file:///d:/Tugas%20Kuliah/Semester%205/Keamanan%20Informasi/UTS/securebox-encrypt/backend/tests/results/histogram_comparison.png) | Grafik perbandingan gabungan Plaintext vs AES-256-GCM vs ChaCha20-Poly1305. |

---

## 📈 5. Hasil Aktual Pengujian & Cara Membaca

Berdasarkan eksekusi pengujian aktual pada backend SecureBox:

### A. Hasil Avalanche Effect (10 Trials Rata-Rata)
- **AES-256-GCM**: **49.7333%**
- **ChaCha20-Poly1305**: **50.0833%**

*Cara membaca*: Kedua algoritma menunjukkan persentase perubahan bit yang sangat mendekati angka ideal **50%**. Hal ini membuktikan sifat *diffusion* yang sangat kuat, di mana penyerang tidak dapat menebak passphrase atau pola ciphertext berdasarkan kesamaan karakter password.

### B. Hasil Shannon Entropy
| Payload Size | Plaintext Entropy | AES-256-GCM Ciphertext | ChaCha20-Poly1305 Ciphertext |
| :--- | :--- | :--- | :--- |
| **1 KB** | 4.525716 bits/byte | **7.831391 bits/byte** | **7.789816 bits/byte** |
| **1 MB** | 4.524174 bits/byte | **7.999839 bits/byte** | **7.999793 bits/byte** |

*Cara membaca*: Entropi plaintext terstruktur berada di angka ~4.52 bits/byte (karena keteraturan bahasa manusia). Setelah dienkripsi, entropi ciphertext meningkat drastis mendekati batas teoritis maksimal **8.0 bits/byte** (~7.9998 bits/byte pada 1 MB). Ini menunjukkan ciphertext tidak dapat dibedakan dari *random noise*.

### C. Hasil Histogram Byte
- **Plaintext**: Menunjukkan pola terpusat pada nilai byte ASCII karakter teks (spasi 32, huruf kecil 97-122).
- **AES-256-GCM & ChaCha20-Poly1305**: Menunjukkan kurva mendatar/seragam (*flat uniform distribution*) di mana seluruh nilai byte dari 0 hingga 255 muncul dengan frekuensi yang seimbang.
