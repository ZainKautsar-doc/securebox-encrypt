# SecureBox 🛡️

SecureBox adalah aplikasi web modern untuk enkripsi dan dekripsi teks serta berkas menggunakan algoritma kriptografi terotentikasi (*Authenticated Encryption with Associated Data / AEAD*): **AES-256-GCM** dan **ChaCha20-Poly1305**, dengan penurunan kunci aman berbasis **scrypt KDF**.

---

## 🚀 Fitur Utama

- **Enkripsi & Dekripsi Teks**: Enkripsi pesan teks dengan derivasi kunci passphrase (scrypt KDF) + AEAD.
- **Enkripsi & Dekripsi File (Hingga 10 MB)**: Unggah file apa saja, unduh ciphertext biner terenkripsi (`.enc`) dan metadata (Salt, Nonce, Tag).
- **Integritas & Autentikasi**: Memvalidasi tag otentikasi 128-bit untuk mencegah modifikasi (tampering).
- **Benchmark Interaktif**: Membandingkan throughput dan waktu eksekusi AES-256-GCM vs ChaCha20-Poly1305 pada ukuran file 1KB, 1MB, dan 10MB.
- **Persistent State & Navigation**: Status form dan halaman aktif tersimpan otomatis di browser (`localStorage` + URL Hash) sehingga tidak hilang saat berpindah tab atau refresh.
- **Activity History (Riwayat Operasi)**: Menyimpan riwayat enkripsi/dekripsi lengkap dengan fitur "Decrypt This", "Copy Metadata", filter kategori, dan export JSON.
- **Modern Clean UI**: Dibuat dengan React 18, TypeScript, Tailwind CSS, dan Lucide Icons.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, Cryptography library
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Crypto Engine**:
  - Key Derivation: `scrypt` ($N=16384, r=8, p=1, \text{len}=32$)
  - Ciphers: `AES-256-GCM`, `ChaCha20-Poly1305`

---

## 📁 Struktur Direktori

```
securebox/
├── backend/
│   ├── app/
│   │   ├── crypto/
│   │   │   ├── aes_gcm.py
│   │   │   ├── chacha20.py
│   │   │   └── kdf.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── routes/
│   │   │   ├── crypto.py
│   │   └── file.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_crypto.py
│   │   └── test_api.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DecryptForm.tsx
│   │   │   ├── EncryptForm.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ResultDisplay.tsx
│   │   ├── context/
│   │   │   └── SecureBoxContext.tsx
│   │   ├── pages/
│   │   │   ├── Compare.tsx
│   │   │   ├── Decrypt.tsx
│   │   │   ├── Encrypt.tsx
│   │   │   ├── FileDecrypt.tsx
│   │   │   ├── FileEncrypt.tsx
│   │   │   └── History.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── history.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Panduan Menjalankan

### 1. Backend (FastAPI)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Jalankan server FastAPI
python -m uvicorn app.main:app --reload --port 8000
```

- API Base: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

#### Menjalankan Backend Tests:
```bash
cd backend
python -m pytest tests
```

---

### 2. Frontend (React + Vite)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan server Vite development
npm run dev
```

- Web UI: `http://localhost:5173`
