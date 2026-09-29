# 🧠 PROJECT CONTEXT

## 1. Informasi Umum
- **Nama project**: SecureBox
- **Deskripsi project**: Aplikasi web untuk enkripsi dan dekripsi teks serta berkas yang diimplementasikan menggunakan algoritma kriptografi modern. Proyek ini merupakan tugas akademik untuk Keamanan Informasi Topik A.
- **Tujuan utama**: Mengamankan data (teks maupun file) dengan mencegah pihak yang tidak berwenang membacanya, serta menjamin integritas data yang dikirimkan.
- **Target user**: Pengguna umum maupun akademisi yang ingin mengenkripsi pesan/file dan melakukan pengujian/benchmark performa kriptografi.
- **Fitur utama**:
  - Enkripsi dan dekripsi teks dan file (maksimal 10 MB).
  - Algoritma utama yang didukung: AES-256-GCM dan ChaCha20-Poly1305.
  - Hybrid Encryption: Menggabungkan AES-256-GCM untuk data utama dan RSA-OAEP SHA-256 untuk mengenkripsi *session key*.
  - Key derivation dari passphrase pengguna menggunakan fungsi *scrypt*.
  - Penyertaan *salt* 16 byte dan *nonce* 12 byte secara acak untuk keamanan tambahan.
  - Authentication tag 128-bit untuk memverifikasi integritas dan mendeteksi perubahan data.
  - Fitur benchmark untuk membandingkan kecepatan AES-256-GCM dan ChaCha20-Poly1305 pada berbagai ukuran data.
  - Analisis kriptografi secara teknis: Avalanche Effect, Shannon entropy, dan Histogram byte untuk memvalidasi kualitas enkripsi.
  - Menyimpan history operasi pada sesi frontend.

## 2. Teknologi yang Digunakan
- **Bahasa Pemrograman**: 
  - Backend: Python 3.10+
  - Frontend: TypeScript / JavaScript
- **Framework Utama**:
  - **FastAPI** (Backend): Mengelola REST API endpoints dengan kinerja tinggi dan dukungan asynchronous native.
  - **React 18** (Frontend): Library JavaScript untuk membangun *User Interface* interaktif berbasis SPA (Single Page Application).
- **Library / Packages Penting**:
  - `cryptography` (Python): Menyediakan implementasi standar industri untuk primitif kriptografi (AES-GCM, ChaCha20-Poly1305, RSA, scrypt).
  - `Uvicorn` (Python): ASGI server yang ringan dan cepat untuk menjalankan aplikasi FastAPI.
  - `Pydantic` (Python): Digunakan untuk mendefinisikan dan memvalidasi skema data request/response secara ketat.
  - `pytest` (Python): Framework testing untuk menjalankan unit test dan integration test pada fungsi-fungsi backend.
  - `Vite` (Frontend): Build tool dan local development server modern yang sangat cepat.
- **Design System / UI Framework**:
  - **Tailwind CSS**: Utility-first CSS framework untuk menyusun *styling* secara efisien dan konsisten tanpa berpindah file.
  - **Lucide React**: Koleksi icon SVG yang ringan untuk memperkaya tampilan UI.
- **Tools Tambahan**:
  - `python-multipart`: Untuk menangani parsing pengiriman *form-data* (seperti *file upload*) pada FastAPI.
  - `python-dotenv`: Untuk memuat variabel *environment* dari file `.env`.

## 3. Arsitektur & Alur Sistem
- **Arsitektur**: Menggunakan pola Client-Server terpisah, di mana aplikasi React berkomunikasi dengan REST API FastAPI. Sistem ini dibangun murni secara **Stateless**, artinya tidak menggunakan database persisten; seluruh proses kriptografi berlangsung langsung di dalam memori saat *request* terjadi.
- **Alur Data End-to-End (Contoh Enkripsi Teks)**:
  1. Pengguna (User) memasukkan teks rahasia dan *passphrase* pada UI React di browser (Frontend).
  2. Frontend mengirimkan HTTP `POST` request dengan format JSON (berisi `plaintext`, `passphrase`, algoritma) ke *endpoint* API (misalnya: `/api/crypto/encrypt`).
  3. Router FastAPI menerima *request* tersebut dan memvalidasi tipe datanya menggunakan Pydantic.
  4. Router (layer *Controller*) memanggil fungsi di service layer (`crypto/`) seperti `kdf.py` untuk membangkitkan kunci dan `aes_gcm.py` untuk mengenkripsi.
  5. Sistem kriptografi backend menghasilkan *ciphertext*, bersama dengan parameter publik seperti *salt* dan *nonce*, yang kemudian di-encode (misal ke Base64).
  6. Backend merespons *request* dengan mengembalikan paket JSON berisi hasil enkripsi tersebut.
  7. Frontend merender data hasil dan menambahkannya ke log histori lokal pengguna.
- **Authentication & State Management**:
  - Tidak terdapat sistem autentikasi / manajemen akun (login/register). 
  - *State management* (seperti tema, history, dan input aktif) ditangani di layer React menggunakan *Hooks* (seperti `useState`, `useContext`).

## 4. Struktur Folder & Penjelasan Detail
```text
securebox/
├── backend/                  # Layer REST API
│   ├── app/                  # Direktori utama logika aplikasi
│   │   ├── crypto/           # Core modul kriptografi
│   │   │   ├── aes_gcm.py    # Logika enkripsi/dekripsi dengan AES-256-GCM
│   │   │   ├── chacha20.py   # Logika enkripsi/dekripsi dengan ChaCha20-Poly1305
│   │   │   ├── hybrid_service.py # Implementasi mode Hybrid (AES + RSA)
│   │   │   ├── kdf.py        # Logika Key Derivation Function menggunakan scrypt
│   │   │   └── rsa_service.py # Helper untuk manipulasi dan enkripsi RSA key
│   │   ├── models/           # Definisi struktur data
│   │   │   └── schemas.py    # Pydantic model untuk validasi request & response
│   │   ├── routes/           # Penanganan endpoint API (API Router)
│   │   │   ├── crypto.py     # Endpoint untuk teks dasar (encrypt/decrypt)
│   │   │   ├── file.py       # Endpoint khusus manipulasi file
│   │   │   └── hybrid.py     # Endpoint khusus mode Hybrid Encryption
│   │   ├── database.py       # (Asumsi) File kosong atau simulasi state sementara (jika ada)
│   │   └── main.py           # Entry point backend, integrasi router, pengaturan CORS dan error handling
│   ├── keys/                 # Direktori untuk menampung pasangan RSA key lokal (bukan untuk produksi)
│   ├── tests/                # Automated testing environment
│   │   └── results/          # Laporan grafis/teks dari hasil test kriptografi
│   └── requirements.txt      # Daftar dependensi package Python
├── frontend/                 # Layer User Interface SPA
│   ├── src/                  
│   │   ├── components/       # UI komponen mandiri (Form, Modal, Notifikasi, Card)
│   │   ├── context/          # React Context API providers
│   │   ├── data/             # Static placeholder data
│   │   ├── pages/            # Komponen root untuk halaman-halaman (misal: halaman Tim)
│   │   ├── services/         # Integrasi API (fungsi-fungsi wrapper untuk fetch/axios)
│   │   ├── types/            # TypeScript interfaces/types deklarasi
│   │   ├── App.tsx           # Layout dasar dan deklarasi rute halaman frontend
│   │   ├── main.tsx          # Bootstrapper React yang diikat ke index.html
│   │   └── index.css         # Styling global (injeksi Tailwind)
│   ├── package.json          # Metadata Node.js & dependencies frontend
│   └── tailwind.config.js    # Pengaturan framework Tailwind CSS
└── package.json              # Script bantu di level root project
```

## 5. Konvensi & Gaya Coding
- **Gaya Coding**: 
  - Backend mengadopsi prinsip arsitektur modular yang memisahkan *Routing* (`routes/`), validasi data (`models/`), dan *Business/Crypto Logic* (`crypto/`).
  - Frontend menggunakan pola pemrograman fungsional, dan sepenuhnya berbasis *Functional Components* dengan bantuan React Hooks.
- **Naming Convention**:
  - Python: `snake_case` untuk nama variabel, fungsi, dan nama file. `PascalCase` untuk nama class atau skema Pydantic.
  - TypeScript/React: `PascalCase` untuk penamaan komponen UI dan filenya (seperti `EncryptForm.tsx`). `camelCase` untuk fungsi dan variabel biasa.
- **Cara Handle Error**:
  - Backend memusatkan error handling di file `main.py` menggunakan `@app.exception_handler`. Semua HTTPException maupun error validasi (`RequestValidationError`) dicegat dan dikembalikan dalam struktur JSON standar yang dapat diprediksi: `{"success": False, "message": "..."}`.
- **Reusable Code**:
  - Form UI, tombol, kotak input, dan penampil hasil enkripsi diekstrak menjadi file terpisah di `frontend/src/components/` agar bisa digunakan di banyak halaman tanpa duplikasi.

## 6. Cara Menjalankan Project
**Prasyarat**: Harus sudah terinstall Python (disarankan 3.10+) dan Node.js/npm.

**Cara Tercepat (Menggunakan Root Script npm):**
Pada terminal root `securebox`:
- Menjalankan Frontend: `npm run frontend:dev` (Dapat diakses di `http://localhost:5173`)
- Menjalankan Backend: `npm run backend:dev` (Dapat diakses di `http://localhost:8000`)
- Menjalankan Test Backend: `npm run backend:test`

**Menjalankan Backend secara Manual:**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Swagger UI untuk dokumentasi API otomatis tersedia di: `http://localhost:8000/docs`

**Menjalankan Frontend secara Manual:**
```bash
cd frontend
npm install
npm run dev
```

## 7. Insight Teknis Tambahan
- **Keputusan Teknis**: 
  - Penggunaan **AES-256-GCM** merupakan langkah ideal karena GCM adalah mode *Authenticated Encryption with Associated Data* (AEAD). Artinya, selain enkripsi kerahasiaan, sistem bisa otomatis mendeteksi modifikasi atau manipulasi data di tengah jalan via tag autentikasi.
  - Metode **Hybrid** dipilih karena RSA sangat lambat dan tidak didesain mengenkripsi data panjang; sehingga RSA cukup dimanfaatkan mengenkripsi kunci AES-nya saja (*Session Key*).
- **Known Limitations & Potensi Improvement**:
  - **Batas Ukuran File**: Dibatasi maksimal 10 MB karena proses kriptografi mengandalkan manipulasi I/O sepenuhnya di dalam RAM memori (*stateless buffer*). Untuk produksi dengan file raksasa, metode *stream cipher* (chunking) harus diimplementasi.
  - **Key Management Security**: Key RSA disimpan lokal dalam folder `keys/`. Ini merupakan batasan bagi proyek akademik, sementara sistem profesional harus mendepositokan kredensial ini pada AWS KMS, HashiCorp Vault, dsb.

## 8. Ringkasan untuk AI
- **Apa ini?**: SecureBox adalah aplikasi web akademik untuk mengamankan teks dan file (<10MB) menggunakan enkripsi cipher modern.
- **Stack Utama**: Backend API berbasis Python FastAPI dengan *library* `cryptography`. Frontend UI berbasis React + TypeScript + Tailwind CSS.
- **Struktur Utama**: Logika dipisah rapi; `backend/app/crypto` khusus perhitungan matematik kripto, `backend/app/routes` hanya untuk mengatur jalan API, dan `frontend/src/components` berisikan antarmuka modular.
- **Hal Penting untuk AI**: Proyek ini **sama sekali tidak menggunakan database persisten**. Setiap *request* berdiri sendiri (*stateless*). Format respons error API selalu baku dalam object `{"success": False, "message": "..."}` yang dikelola sentral pada `main.py`. Bila berkontribusi di backend, harap patuhi *Pydantic Models* di modul `schemas`.
