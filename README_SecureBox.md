# SecureBox

SecureBox adalah aplikasi web untuk enkripsi dan dekripsi teks serta berkas menggunakan algoritma kriptografi modern. Project ini dibuat untuk memenuhi proyek Keamanan Informasi Topik A: Aplikasi Enkripsi Algoritma Modern.

## Fitur

- Enkripsi dan dekripsi teks dengan AES-256-GCM.
- Enkripsi dan dekripsi teks dengan ChaCha20-Poly1305.
- Key derivation dari passphrase menggunakan scrypt.
- Salt acak 16 byte.
- Nonce acak 12 byte untuk proses enkripsi.
- Authentication tag 128-bit untuk verifikasi integritas.
- Enkripsi dan dekripsi berkas hingga 10 MB.
- Benchmark AES-256-GCM dan ChaCha20-Poly1305 untuk ukuran 1 KB, 1 MB, dan 10 MB.
- History operasi pada frontend.
- Analisis avalanche effect.
- Analisis Shannon entropy.
- Analisis histogram byte plaintext dan ciphertext.
- Hybrid encryption menggunakan AES-256-GCM dan RSA-OAEP dengan SHA-256.
- Unit test dan integration test menggunakan pytest.

## Teknologi

### Backend

- Python 3.10+
- FastAPI
- Uvicorn
- cryptography
- Pydantic
- python-multipart
- python-dotenv
- pytest
- matplotlib

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Algoritma

### AES-256-GCM

AES-256-GCM digunakan untuk enkripsi data utama. Key AES memiliki panjang 256 bit. Setiap proses enkripsi menggunakan nonce 12 byte dan menghasilkan authentication tag 128 bit.

### ChaCha20-Poly1305

ChaCha20-Poly1305 digunakan sebagai algoritma AEAD alternatif untuk membandingkan performa dan hasil analisis dengan AES-256-GCM.

### scrypt

scrypt digunakan untuk menghasilkan key 256 bit dari passphrase pengguna.

Parameter yang digunakan:

```text
N = 16384
r = 8
p = 1
key length = 32 byte
salt length = 16 byte
```

### Hybrid Encryption

Mode hybrid menggunakan dua lapisan:

```text
Data
  ↓
AES-256-GCM
  ↓
Ciphertext

AES Session Key
  ↓
RSA-OAEP SHA-256
  ↓
Encrypted Session Key
```

RSA menggunakan key pair 2048 bit. Session key AES dibuat secara acak untuk setiap proses hybrid encryption.

## Struktur Project

```text
securebox/
├── backend/
│   ├── app/
│   │   ├── crypto/
│   │   │   ├── aes_gcm.py
│   │   │   ├── chacha20.py
│   │   │   ├── hybrid_service.py
│   │   │   ├── kdf.py
│   │   │   └── rsa_service.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── crypto.py
│   │   │   ├── file.py
│   │   │   └── hybrid.py
│   │   ├── database.py
│   │   └── main.py
│   ├── keys/
│   │   ├── private_key.pem
│   │   └── public_key.pem
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_crypto.py
│   │   ├── test_crypto_analysis.py
│   │   ├── test_hybrid.py
│   │   └── results/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json
├── PROJECT_CONTEXT.md
└── DESIGN.md
```

## Menjalankan Project

### Backend

Masuk ke folder backend:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan virtual environment.

Windows:

```bash
venv\\Scripts\\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependency:

```bash
python -m pip install -r requirements.txt
```

Jalankan FastAPI:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Backend berjalan di:

```text
http://localhost:8000
```

Dokumentasi API:

```text
http://localhost:8000/docs
```

Endpoint utama:

```text
POST /api/crypto/encrypt
POST /api/crypto/decrypt
POST /api/file/encrypt
POST /api/file/decrypt
POST /api/crypto/compare

POST /api/hybrid/encrypt/text
POST /api/hybrid/decrypt/text
POST /api/hybrid/encrypt/file
POST /api/hybrid/decrypt/file
```

### Frontend

Buka terminal baru:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

### Menjalankan dengan script root

Project juga menyediakan script pada root:

```bash
npm run frontend:dev
npm run frontend:build
npm run backend:dev
npm run backend:test
```

## Pengujian

Masuk ke folder backend:

```bash
cd backend
```

Jalankan seluruh test:

```bash
python -m pytest tests -v
```

Pengujian mencakup:

- AES-256-GCM encrypt/decrypt.
- ChaCha20-Poly1305 encrypt/decrypt.
- scrypt key derivation.
- Password salah.
- Ciphertext yang diubah.
- Authentication tag yang diubah.
- Enkripsi dan dekripsi file.
- RSA key management.
- RSA-OAEP untuk hybrid encryption.
- Hybrid text encryption/decryption.
- Hybrid file encryption/decryption.
- Avalanche effect.
- Shannon entropy.
- Histogram byte plaintext dan ciphertext.

## Hasil Analisis

Hasil analisis pengujian tersimpan di:

```text
backend/tests/results/
```

File utama:

```text
avalanche_results.json
crypto_analysis_summary.json
entropy_results.json
histogram_results.json
```

Visualisasi histogram:

```text
histogram_plaintext.png
histogram_aes.png
histogram_chacha20.png
histogram_comparison.png
```

## Keamanan

Mode standar menggunakan scrypt untuk menurunkan key dari passphrase. Setiap proses enkripsi menggunakan salt dan nonce acak.

AES-256-GCM dan ChaCha20-Poly1305 menggunakan authentication tag untuk mendeteksi data yang berubah.

Mode hybrid menggunakan RSA-OAEP SHA-256 untuk membungkus AES session key.

Private key RSA harus dijaga dan tidak boleh dibagikan.

Untuk repository publik, jangan commit private key produksi. Gunakan key pair baru untuk setiap environment yang sesuai.

## Batasan

- Ukuran file maksimal 10 MB.
- Mode hybrid menggunakan AES-256-GCM sebagai cipher data.
- RSA-OAEP digunakan untuk mengenkripsi session key, bukan untuk mengenkripsi seluruh file.
- Operasi enkripsi dan dekripsi berlangsung secara stateless dan tidak membutuhkan database untuk proses kriptografi.

## Tim

1. Zain Kautsar Ridha - 247006111153
2. Fito Anugrah Nurzaman - 247006111156
3. Muhammad Nazril Putra Rosida - 247006111162

## Repository

GitHub:

https://github.com/ZainKautsar-doc/securebox-encrypt
