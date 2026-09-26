# 🧠 PROJECT CONTEXT

> **Catatan untuk AI**: Dokumen ini berisi seluruh spesifikasi, arsitektur, alur data, konvensi, dan teknis implementasi dari repositori **SecureBox**. Gunakan dokumen ini sebagai konteks lengkap tanpa perlu mengakses codebase langsung.

---

## 1. Informasi Umum

- **Nama Project**: SecureBox (Enterprise Authenticated Encryption Suite)
- **Deskripsi Project**: SecureBox adalah aplikasi web *stateless* dan *zero-knowledge* yang dirancang untuk mengamankan data rahasia berupa pesan teks dan berkas biner (file hingga 10 MB) menggunakan algoritma kriptografi terotentikasi modern (AEAD - *Authenticated Encryption with Associated Data*).
- **Tujuan Utama (Problem Statement)**:
  1. Mengatasi kerentanan enkripsi konvensional (seperti AES-CBC tanpa otentikasi) yang rentan terhadap serangan manipulasi ciphertext (*bit-flipping*) dan *padding oracle attacks*.
  2. Mencegah serangan tebak kata kunci (*brute-force / rainbow table*) pada password manusia dengan menggunakan *Memory-Hard Key Derivation Function* (`scrypt`).
  3. Menyediakan antarmuka web yang intuitif, aman, dan tanpa jejak penyimpanan data (*zero-knowledge*), di mana server tidak menyimpan database plaintext, ciphertext, maupun password pengguna.
- **Target User**: Pengguna individu, pengembang software, praktisi keamanan informasi, atau entitas yang membutuhkan enkripsi pesan/file secara instan dan transparan tanpa mempercayai pihak ketiga untuk menyimpan data.
- **Fitur Utama**:
  1. **Enkripsi & Dekripsi Teks**: Pengguna dapat mengenkripsi pesan teks menjadi Base64 ciphertext menggunakan passphrase dengan pilihan algoritma AES-256-GCM atau ChaCha20-Poly1305.
  2. **Enkripsi & Dekripsi Berkas (Hingga 10 MB)**: Mengenkripsi berkas biner apa saja, mengunduh hasil biner terenkripsi (`.enc`), serta mengunduh/mengunggah file metadata JSON (`-metadata.json`) berisi Salt, Nonce, dan Auth Tag.
  3. **Integritas & Autentikasi Data (AEAD)**: Memverifikasi Auth Tag 128-bit saat dekripsi. Jika password salah atau data diubah 1 bit saja, sistem secara tegas membatalkan proses dengan error otentikasi.
  4. **Modul Step-by-Step Flow**: Setiap halaman enkripsi dan dekripsi memiliki visualisasi alur kerja (Langkah 1 s.d. 4) yang menjelaskan proses matematika kriptografi di balik layar.
  5. **Benchmark Performa Interaktif**: Mengukur dan membandingkan kecepatan serta *throughput* antara AES-256-GCM (hardware acceleration AES-NI) dan ChaCha20-Poly1305 pada payload 1 KB, 1 MB, dan 10 MB.
  6. **Persistent State & Activity History**: Keadaan form dan riwayat operasi tersimpan secara lokal di browser (`localStorage`), lengkap dengan fitur filter tipe, copy metadata, "Decrypt This", serta ekspor/impor JSON.

---

## 2. Teknologi yang Digunakan

### Backend
- **Bahasa Pemrograman**: Python 3.10+
- **Framework Utama**: FastAPI (Web framework berbasis Asynchronous Server Gateway Interface / ASGI yang cepat dan memiliki dokumentasi Swagger otomatis).
- **Library Kriptografi**: `cryptography` (Library standar industri Python untuk penanganan AES-GCM, ChaCha20-Poly1305, dan scrypt KDF di tingkat C native).
- **Server ASGI**: Uvicorn (Server HTTP ASGI berkinerja tinggi).
- **Validasi Data**: Pydantic v2 (Untuk validasi skema input/output API secara presisi).
- **Testing**: Pytest & HTTPX (Unit testing fungsi kriptografi dan integrasi API route).

### Frontend
- **Bahasa Pemrograman**: TypeScript (Static typing untuk menjamin keamanan tipe pada payload API dan state manajemen).
- **Framework Utama**: React 18 (Client-Side Rendering dengan hooks modern).
- **Build Tool / Bundler**: Vite (Bundler frontend ultra-cepat).
- **Styling & Design System**: Tailwind CSS (Utility-first CSS framework) dengan komponen khusus bergaya modern (glassmorphism, clean card, dark/light contrast).
- **Icon Library**: `lucide-react` (Ikon vektor modern untuk visualisasi aksi dan status UI).
- **HTTP Client**: Axios (Menangani REST API request/response dan penanganan biner Blob).

---

## 3. Arsitektur & Alur Sistem

### Arsitektur Utama
Aplikasi ini mengadopsi **Stateless RESTful Architecture** berprinsip **Zero-Knowledge**:
- **Backend (Stateless Engine)**: Backend bertindak murni sebagai mesin komputasi kriptografi *in-memory*. Backend **TIDAK MEMILIKI DATABASE** dan tidak mencatat pesan atau password pengguna ke disk.
- **Frontend (Client-Side State)**: Seluruh manajemen status tampilan, form state, riwayat operasi, dan navigasi ditangani secara lokal oleh browser pengguna menggunakan React Context API dan `localStorage`.

### Alur Data End-to-End (Data Flow)

#### A. Alur Proses Enkripsi Teks / Berkas
1. **User Action**: Pengguna memasukkan data (teks/file), memilih algoritma (`aes-256-gcm` atau `chacha20-poly1305`), dan mengetik passphrase pada Frontend.
2. **API Request**: Frontend mengirimkan payload HTTP POST ke backend (`/api/encrypt/text` atau `/api/encrypt/file`).
3. **Key Derivation (KDF)**:
   - Backend memicu `os.urandom(16)` untuk membuat **Salt** acak 16-byte.
   - Algoritma `scrypt` ($N=16384, r=8, p=1$) menurunkan passphrase pengguna + Salt menjadi **Symmetric Key 256-bit (32 bytes)** di RAM.
4. **AEAD Encryption**:
   - Backend memicu `os.urandom(12)` untuk membuat **Nonce (IV)** acak 12-byte.
   - Cipher mengenkripsi data dan menghasilkan **Ciphertext** + **Auth Tag 16-byte (128-bit)**.
5. **Memory Cleanup & Response**: Kunci simetris dan passphrase langsung dihapus dari memori server. Response dikirimkan ke Frontend berisi Ciphertext dan metadata (Salt, Nonce, Auth Tag).
6. **Client Storage & History**: Frontend menampilkan hasil, menyimpan catatan ke `localStorage` (History), dan memungkinkan unduh file biner (`.enc`) serta metadata JSON.

#### B. Alur Proses Dekripsi Teks / Berkas
1. **User Action**: Pengguna memasukkan Ciphertext/file `.enc`, Passphrase, Algoritma, serta metadata (Salt, Nonce, Auth Tag) atau mengunggah berkas metadata JSON.
2. **API Request**: Frontend mengirimkan data ke endpoint dekripsi (`/api/decrypt/text` atau `/api/decrypt/file`).
3. **Key Reconstruction**: Backend merekonstruksi **Symmetric Key 256-bit** dengan mengumpankan Passphrase input dan Salt dari metadata ke fungsi `scrypt`.
4. **AEAD Authentication & Decryption**:
   - Cipher memverifikasi **Auth Tag 128-bit** terhadap Ciphertext dan Nonce.
   - **Jika Valid**: Ciphertext didekripsi menjadi Plaintext asli / file biner asli.
   - **Jika Invalid (Password salah / Data dimanipulasi)**: Engine melempar error `InvalidTag` atau `Authentication Failed` (HTTP 400 Bad Request).
5. **Response**: Backend mengembalikan Plaintext / stream file biner ke Frontend.

---

## 4. Struktur Folder & Penjelasan Detail

Berikut adalah struktur hirarki folder repositori `securebox-encrypt`:

```
securebox-encrypt/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # Entry point FastAPI, CORS setup, & router mount
│   │   ├── crypto/
│   │   │   ├── __init__.py
│   │   │   ├── kdf.py            # Implementasi scrypt KDF
│   │   │   ├── aes_gcm.py        # Implementasi enkripsi/dekripsi AES-256-GCM
│   │   │   └── chacha20.py       # Implementasi enkripsi/dekripsi ChaCha20-Poly1305
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py        # Pydantic Request/Response validation schemas
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── crypto.py         # REST API endpoints enkripsi/dekripsi TEKS & benchmark
│   │       └── file.py           # REST API endpoints enkripsi/dekripsi FILE
│   ├── tests/
│   │   ├── test_crypto.py        # Unit tests logika matematis kriptografi
│   │   └── test_api.py           # Integration tests API routes FastAPI
│   ├── requirements.txt          # Dependensi Python (FastAPI, cryptography, uvicorn, dll)
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── assets/               # Asset statis (logo, ilustrasi)
│   │   ├── components/
│   │   │   ├── EncryptForm.tsx   # Form input & kontrol enkripsi teks
│   │   │   ├── DecryptForm.tsx   # Form input & kontrol dekripsi teks
│   │   │   ├── FileUpload.tsx    # Komponen drag-and-drop unggah berkas
│   │   │   ├── Navigation.tsx    # Header & Navigasi tab responsive
│   │   │   └── ResultDisplay.tsx # Komponen tampilan output ciphertext & metadata
│   │   ├── context/
│   │   │   └── SecureBoxContext.tsx # Centralized State Management (Form State & History)
│   │   ├── pages/
│   │   │   ├── Encrypt.tsx       # Halaman Enkripsi Teks (+ Flow Step-by-Step)
│   │   │   ├── Decrypt.tsx       # Halaman Dekripsi Teks (+ Flow Step-by-Step)
│   │   │   ├── FileEncrypt.tsx   # Halaman Enkripsi File (+ Flow Step-by-Step)
│   │   │   ├── FileDecrypt.tsx   # Halaman Dekripsi File (+ Flow Step-by-Step)
│   │   │   ├── Compare.tsx       # Halaman Benchmark & Penjelasan Metodologi
│   │   │   ├── History.tsx       # Halaman Riwayat Aktivitas & Manajemen Log
│   │   │   └── HowItWorks.tsx    # Halaman Edukasi Arsitektur, Algoritma, & FAQ
│   │   ├── services/
│   │   │   └── api.ts            # Client Service Axios pemanggil Backend REST API
│   │   ├── types/
│   │   │   └── history.ts        # Interface & tipe data TypeScript untuk History & API
│   │   ├── App.tsx               # Main layout wrapper & router tab aktif
│   │   ├── main.tsx              # Entry point React DOM
│   │   └── index.css             # Tailwind CSS directives & global styling
│   ├── package.json
│   ├── tsconfig.json             # Konfigurasi TypeScript compiler
│   ├── tailwind.config.js        # Konfigurasi Tailwind CSS
│   └── vite.config.ts            # Konfigurasi Vite dev server & build
├── package.json                  # Root npm workspace script (opsional)
└── README.md                     # Dokumentasi utama repositori
```

---

## 5. Konvensi & Gaya Coding

- **Clean Code & Modular Separation**: Logika matematika kriptografi dipisahkan total dari API routes pada backend (`app/crypto/` terpisah dari `app/routes/`). Pada frontend, tampilan UI terpisah dari API client service (`services/api.ts`).
- **Naming Conventions**:
  - **Python Backend**: `snake_case` untuk nama variabel, fungsi, file (`aes_gcm.py`, `derive_key`), dan `PascalCase` untuk kelas Pydantic (`TextEncryptRequest`).
  - **TypeScript Frontend**: `camelCase` untuk fungsi/variabel (`handleEncrypt`), `PascalCase` untuk nama komponen & tipe (`EncryptForm.tsx`, `HistoryItem`), dan `kebab-case` untuk nilai konstanta unik (`file-encrypt`, `aes-256-gcm`).
- **Error Handling**:
  - **Backend**: Menggunakan blok `try-except` spesifik (misal: `InvalidTag` dari library `cryptography`) dan mengembalikan `HTTPException(status_code=400, detail="Authentication failed or corrupted ciphertext")` agar tidak membocorkan detail internal traceback server.
  - **Frontend**: Menggunakan penanganan `try-catch` pada Axios service. Error ditampilkan secara ramah kepada pengguna melalui banner alert berwarna merah (`bg-rose-50`).
- **State Persistence Pattern**: Seluruh state form (text, password, algorithm, file info) di-bind ke React Context (`SecureBoxContext`) yang di-persist secara *real-time* ke `localStorage` browser. Ini memastikan pengisian form tidak hilang jika pengguna tidak sengaja berpindah tab atau me-refresh browser.

---

## 6. Cara Menjalankan Project

### Prerequisites
- Python 3.10 atau versi yang lebih baru.
- Node.js v18+ dan npm.

### Langkah 1: Jalankan Backend (FastAPI)
```bash
# 1. Navigasi ke direktori backend
cd backend

# 2. (Opsional) Buat dan aktifkan virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install dependensi Python
pip install -r requirements.txt

# 4. Jalankan server backend Uvicorn
python -m uvicorn app.main:app --reload --port 8000
```
*Backend akan berjalan di `http://localhost:8000`. Akses dokumentasi interaktif Swagger di `http://localhost:8000/docs`.*

### Langkah 2: Jalankan Frontend (React + Vite)
```bash
# 1. Navigasi ke direktori frontend (buka terminal baru)
cd frontend

# 2. Install dependensi Node.js
npm install

# 3. Jalankan server Vite development
npm run dev
```
*Frontend akan berjalan di `http://localhost:5173`.*

---

## 7. Insight Teknis Tambahan

### Keputusan Teknis Penting
1. **Mengapa memilih AEAD (GCM & Poly1305) dibanding Cipher biasa (CBC)?**
   Cipher tanpa otentikasi (seperti AES-CBC) hanya menjamin kerahasiaan (*confidentiality*), namun tidak dapat mendeteksi apakah ciphertext telah diubah oleh pihak ketiga di perjalanan (*tampering*). AEAD menambahkan Auth Tag 128-bit yang memberikan jaminan integritas data secara matematis.
2. **Mengapa memilih `scrypt` sebagai KDF dibanding SHA-256 biasa?**
   Password buatan manusia cenderung pendek dan mudah ditebak. `scrypt` adalah fungsi *memory-hard* yang secara sengaja membutuhkan alokasi memori RAM dan komputasi CPU tertentu ($N=16384, r=8, p=1$), sehingga memblokir serangan paralelisasi masif menggunakan hardware GPU/ASIC.
3. **Mengapa membatasi ukuran file 10 MB?**
   Proses enkripsi/dekripsi biner di backend dan frontend dilakukan secara *in-memory* tanpa penyimpanan file temporary di disk demi menjaga prinsip *zero-knowledge*. Batas 10 MB dipilih agar RAM server tidak kewalahan saat memproses banyak request concurrent.

### Known Limitations / Technical Debt
- **Besaran Berkas**: Saat ini dibatasi maksimal 10 MB per berkas. Untuk mendukung berkas > 100 MB di masa depan, arsitektur perlu ditingkatkan menggunakan *chunk-based streaming cryptography*.

---

## 8. Ringkasan untuk AI

Jika Anda adalah model AI yang membantu pengembang mengedit atau mengembangkan repositori ini, berikut adalah 5 poin kunci yang **WAJIB** dipahami:

1. **Aplikasi Zero-Knowledge & Stateless**: Jangan pernah menambahkan fitur yang mencoba menyimpan password, plaintext, atau ciphertext ke dalam database backend. Backend murni bertindak sebagai mesin kalkulasi kriptografi *in-memory*.
2. **Kombinasi AEAD + scrypt**: Semua proses enkripsi wajib melewati derivasi kunci `scrypt` KDF (menghasilkan key 256-bit dari password + 16-byte Salt) dan dienkripsi dengan cipher terotentikasi (AES-256-GCM atau ChaCha20-Poly1305) yang memproduksi 12-byte Nonce dan 16-byte Auth Tag.
3. **Pemisahan Modul UI Flow**: Setiap halaman fitur enkripsi/dekripsi (`Encrypt.tsx`, `Decrypt.tsx`, `FileEncrypt.tsx`, `FileDecrypt.tsx`) memiliki komponen petunjuk *Step-by-Step Flow* yang terintegrasi secara visual di bagian atas form.
4. **State Persistence**: Frontend menggunakan `SecureBoxContext` + `localStorage` untuk mempertahankan status form dan riwayat operasi (`history`). Perubahan pada form atau history harus selalu memutakhirkan state ini secara sinkron.
5. **Stack Sederhana & Clean**: Backend menggunakan FastAPI (`app/main.py`, `app/crypto/`, `app/routes/`), sedangkan Frontend menggunakan React 18 + Vite + Tailwind CSS (`src/pages/`, `src/components/`, `src/context/`).
