import React, { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Key, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Fingerprint, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const HowItWorks: React.FC = () => {
  const { setActiveTab } = useSecureBox();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeProtoTab, setActiveProtoTab] = useState<'aes' | 'chacha' | 'hybrid' | 'scrypt'>('aes');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apa perbedaan mendasar antara Enkripsi Biasa (Legacy) dan AEAD pada SecureBox?',
      a: 'Enkripsi lawas (seperti AES-CBC tanpa MAC) hanya menyembunyikan data (Kerahasiaan/Confidentiality) tanpa memverifikasi keasliannya. Jika peretas mengubah 1 byte di tengah jalan, data rusak atau rawan serangan Padding Oracle.\n\nSebaliknya, AEAD (Authenticated Encryption with Associated Data) menggabungkan enkripsi berkekuatan tinggi dengan 128-bit Authentication Tag (Integritas/Authenticity). Jika pesan atau parameter diubah sekecil 1 bit saja, sistem langsung menolak proses dekripsi untuk menjamin keamanan penuh.'
    },
    {
      q: 'Mengapa Salt, Nonce, dan Auth Tag wajib disimpan untuk proses dekripsi?',
      a: 'Ketiga parameter ini adalah kunci pelengkap verifikasi kriptografi:\n• Salt (16 Byte): Menjamin password Anda menghasilkan Kunci Enkripsi 256-bit yang unik melalui scrypt, sehingga kebal dari serangan kamus/Rainbow Table.\n• Nonce / IV (12 Byte): "Number used ONCE" memastikan jika Anda mengenkripsi pesan yang sama 10 kali, hasil ciphertext-nya selalu 100% berbeda dan acak.\n• Auth Tag (16 Byte): Segel digital matematis. Menjamin data belum pernah diubah, rusak, atau disusupi pihak ketiga.'
    },
    {
      q: 'Apakah password, file, atau kunci rahasia disimpan di server backend?',
      a: 'Sama sekali TIDAK. SecureBox beroperasi dengan prinsip Zero-Knowledge & Stateless Architecture. Backend hanya memproses data di dalam RAM (memori volatil) saat komputasi berlangsung, lalu langsung dihapus (wiped). Tidak ada database yang menyimpan password, kunci privat, atau file Anda.'
    },
    {
      q: 'Kapan sebaiknya memilih AES-256-GCM vs ChaCha20-Poly1305 vs Hybrid Encryption?',
      a: '• AES-256-GCM: Pilihan terbaik untuk PC/Laptop/Server berbasis prosesor Intel atau AMD, karena didukung instruksi perangkat keras langsung (AES-NI) dengan kecepatan transfer gigabit.\n• ChaCha20-Poly1305: Pilihan terbaik untuk smartphone, tablet, laptop arsitektur ARM (seperti Apple Silicon / Snapdragon), atau sistem tanpa instruksi AES khusus. Sangat aman dan kebal terhadap serangan waktu (timing attacks).\n• Hybrid RSA-OAEP + AES: Pilihan ideal untuk transmisi otomatis tanpa perlu membagikan password secara manual ke penerima, karena menggunakan pasangan Kunci Publik & Kunci Privat RSA 2048-bit.'
    },
    {
      q: 'Apa yang terjadi jika ada salah 1 karakter password atau ciphertext yang keliru?',
      a: 'Proses dekripsi akan langsung dibatalkan dengan pesan kesalahan "Authentication failed: invalid tag or corrupted payload". Sifat matematis AEAD menolak dekripsi sebelum data yang korup sempat dibuka, melindungi Anda dari serangan injeksi atau data palsu.'
    },
    {
      q: 'Berapa batas ukuran file dan mengapa dibatasi hingga 10 MB?',
      a: 'Batas 10 MB ditujukan untuk menjaga kecepatan komputasi in-memory secara instan di browser dan backend tanpa latensi I/O disk, menjamin privasi maksimal tanpa penyimpanan sementara.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Spesifikasi & Cara Kerja Protokol</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            PANDUAN LENGKAP ARSITEKTUR AEAD, SCRYPT KDF, SERTA MODEL KEAMANAN ZERO-KNOWLEDGE
          </p>
        </div>
      </div>

      {/* Overview Card: Konsep Utama AEAD */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-electric-indigo rounded-full animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-warm-filament uppercase tracking-wider">
              // ARSITEKTUR UTAMA: MODERN AEAD & ZERO-KNOWLEDGE
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-electric-indigo/20 text-periwinkle-veil border border-electric-indigo">
            STANDAR NIST & IETF
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-pure-signal font-sans">
          Bagaimana SecureBox Melindungi Data Anda?
        </h2>
        
        <p className="text-sm text-soft-mist leading-relaxed font-sans">
          SecureBox dirancang menggunakan standar keamanan militer <strong>Authenticated Encryption with Associated Data (AEAD)</strong>. Sistem ini tidak hanya menyandikan (mengacak) data agar tidak bisa dibaca, namun juga menyertakan <strong>segel integritas digital</strong> yang mendeteksi setiap upaya manipulasi atau kerusakan data secara instan.
        </p>

        {/* 3 Pilar Keamanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2.5">
            <div className="w-8 h-8 rounded-sm bg-electric-indigo/20 text-periwinkle-veil flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-pure-signal uppercase">1. scrypt KDF</h3>
              <span className="text-[10px] font-mono text-warm-filament">Key Derivation</span>
            </div>
            <p className="text-xs text-soft-mist/80 leading-relaxed font-sans">
              Mengubah password manusia menjadi <strong>kunci kriptografi 256-bit</strong> yang sangat kuat dengan komputasi <em>memory-hard</em> yang kebal terhadap serangan mesin pembobol GPU/ASIC.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2.5">
            <div className="w-8 h-8 rounded-sm bg-lime-beacon/20 text-lime-beacon flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-pure-signal uppercase">2. 256-Bit Ciphers</h3>
              <span className="text-[10px] font-mono text-lime-beacon">Kerahasiaan Mutlak</span>
            </div>
            <p className="text-xs text-soft-mist/80 leading-relaxed font-sans">
              Menyediakan pilihan <strong>AES-256-GCM</strong> (tercepat di prosesor PC) dan <strong>ChaCha20-Poly1305</strong> (tercepat & paling aman di ponsel/ARM).
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2.5">
            <div className="w-8 h-8 rounded-sm bg-orchid-whisper/20 text-orchid-whisper flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-pure-signal uppercase">3. 128-Bit Auth Tag</h3>
              <span className="text-[10px] font-mono text-orchid-whisper">Integritas Terverifikasi</span>
            </div>
            <p className="text-xs text-soft-mist/80 leading-relaxed font-sans">
              Segel kriptografis yang memastikan data asli <strong>tidak pernah disentuh, diedit, atau rusak</strong> saat dalam perjalanan maupun penyimpanan.
            </p>
          </div>
        </div>
      </div>

      {/* Alur Kerja Step-by-Step (Pipeline) */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-electric-indigo" />
          <span>// ALUR LENGKAP PROSES ENKRIPSI & DEKRIPSI</span>
        </div>

        <h3 className="text-base font-bold text-pure-signal font-sans">
          Tahapan Teknis Transformasi Data (End-to-End)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Langkah 1 */}
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">LANGKAH 01</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">INPUT</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Persiapan Data & Password</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Pengguna memasukkan teks/file rahasia dan password pengaman (atau memilih mode Hybrid RSA otomatis).
              </p>
            </div>
            <div className="p-2 bg-midnight-void rounded-sm text-[10px] font-mono text-soft-mist/60 border border-graphite-lift mt-2">
              Input: Plaintext + Password
            </div>
          </div>

          {/* Langkah 2 */}
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">LANGKAH 02</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">KDF</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Penurunan Kunci (scrypt)</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Sistem menghasilkan <strong>Salt acak 16 byte</strong> lalu menurunkan kunci biner 256-bit menggunakan fungsi scrypt.
              </p>
            </div>
            <div className="p-2 bg-midnight-void rounded-sm text-[10px] font-mono text-electric-indigo border border-graphite-lift mt-2">
              Key = scrypt(Password, Salt)
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">LANGKAH 03</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">AEAD CIPHER</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Penyandian & Otentikasi</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Dihasilkan <strong>Nonce acak 12 byte</strong>. Data dienkripsi secara simetris dan dihitung <strong>Auth Tag 16 byte</strong>.
              </p>
            </div>
            <div className="p-2 bg-midnight-void rounded-sm text-[10px] font-mono text-lime-beacon border border-graphite-lift mt-2">
              (Ciphertext, Tag) = AEAD(Key, Nonce)
            </div>
          </div>

          {/* Langkah 4 */}
          <div className="p-4 bg-graphite-lift border border-electric-indigo/50 rounded-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lime-beacon text-xs">LANGKAH 04</span>
                <span className="text-[10px] font-mono text-lime-beacon bg-lime-beacon/10 px-1.5 py-0.5 rounded-sm">SELESAI</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Paket Output & JSON</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Ciphertext beserta metadata (Salt, Nonce, Tag) siap diunduh dalam format Base64 JSON atau berkas terenkripsi.
              </p>
            </div>
            <div className="p-2 bg-midnight-void rounded-sm text-[10px] font-mono text-pure-signal border border-graphite-lift mt-2">
              Output: JSON Payload / .enc
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Interactive Protocol Deep Dive */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-electric-indigo" />
            <h2 className="text-base font-bold font-mono text-pure-signal uppercase">
              // BEDAH MENDALAM PROTOKOL & ALGORITMA
            </h2>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-midnight-void border border-graphite-lift rounded-sm">
            <button
              onClick={() => setActiveProtoTab('aes')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition cursor-pointer ${
                activeProtoTab === 'aes'
                  ? 'bg-electric-indigo text-pure-signal font-bold'
                  : 'text-soft-mist/70 hover:text-pure-signal'
              }`}
            >
              AES-256-GCM
            </button>
            <button
              onClick={() => setActiveProtoTab('chacha')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition cursor-pointer ${
                activeProtoTab === 'chacha'
                  ? 'bg-lime-beacon text-midnight-void font-bold'
                  : 'text-soft-mist/70 hover:text-pure-signal'
              }`}
            >
              ChaCha20-Poly1305
            </button>
            <button
              onClick={() => setActiveProtoTab('hybrid')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition cursor-pointer ${
                activeProtoTab === 'hybrid'
                  ? 'bg-orchid-whisper text-midnight-void font-bold'
                  : 'text-soft-mist/70 hover:text-pure-signal'
              }`}
            >
              Hybrid RSA+AES
            </button>
            <button
              onClick={() => setActiveProtoTab('scrypt')}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition cursor-pointer ${
                activeProtoTab === 'scrypt'
                  ? 'bg-warm-filament text-midnight-void font-bold'
                  : 'text-soft-mist/70 hover:text-pure-signal'
              }`}
            >
              scrypt KDF
            </button>
          </div>
        </div>

        {/* Content Tab 1: AES-256-GCM */}
        {activeProtoTab === 'aes' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-graphite-lift">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-pure-signal uppercase">AES-256-GCM (Galois/Counter Mode)</span>
              </div>
              <span className="text-[10px] font-mono bg-periwinkle-veil/20 text-periwinkle-veil px-2 py-0.5 rounded-sm border border-periwinkle-veil">
                STANDAR NIST SP 800-38D
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
              <strong>AES-256-GCM</strong> adalah standar emas enkripsi global yang digunakan oleh perbankan, militer, dan protokol web modern (TLS 1.3). Mengombinasikan enkripsi mode Counter (CTR) dengan komputasi Galois Field Multiplication untuk menghasilkan tag otentikasi 128-bit secara bersamaan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm space-y-1.5 font-mono text-xs">
                <div className="text-periwinkle-veil font-bold flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>KELEBIHAN UTAMA</span>
                </div>
                <p className="text-soft-mist/80 text-[11px] font-sans leading-relaxed">
                  Memanfaatkan instruksi perangkat keras khusus (<strong>Intel/AMD AES-NI</strong>) yang tertanam pada prosesor PC/Server, menghasilkan kecepatan enkripsi hingga beberapa Gigabyte per detik.
                </p>
              </div>

              <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm space-y-1.5 font-mono text-xs">
                <div className="text-warm-filament font-bold flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>SPESIFIKASI PARAMETER</span>
                </div>
                <div className="text-[11px] text-soft-mist/70 space-y-0.5">
                  <div>• Panjang Kunci: <span className="text-pure-signal">256 bit (32 byte)</span></div>
                  <div>• Panjang Nonce / IV: <span className="text-pure-signal">96 bit (12 byte)</span></div>
                  <div>• Panjang Auth Tag: <span className="text-pure-signal">128 bit (16 byte)</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 2: ChaCha20-Poly1305 */}
        {activeProtoTab === 'chacha' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-graphite-lift">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-pure-signal uppercase">ChaCha20-Poly1305 (RFC 8439)</span>
              </div>
              <span className="text-[10px] font-mono bg-lime-beacon/20 text-lime-beacon px-2 py-0.5 rounded-sm border border-lime-beacon">
                CONSTANT-TIME STREAM CIPHER
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
              Diciptakan oleh kriptografer ternama <strong>Daniel J. Bernstein</strong>. Algoritma ini memadukan <em>stream cipher</em> ChaCha 20-putaran dengan MAC Poly1305 berkecepatan tinggi. Digunakan secara luas oleh Google, Cloudflare, Apple iOS, dan protokol WireGuard VPN.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm space-y-1.5 font-mono text-xs">
                <div className="text-lime-beacon font-bold flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>KEBAL TIMING ATTACK</span>
                </div>
                <p className="text-soft-mist/80 text-[11px] font-sans leading-relaxed">
                  Menggunakan operasi dasar biner ARX (Add-Rotate-XOR) dengan waktu eksekusi konstan (<em>constant-time</em>), sehingga 100% kebal terhadap pencurian kunci via pola cache memori (<em>cache-timing attacks</em>).
                </p>
              </div>

              <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm space-y-1.5 font-mono text-xs">
                <div className="text-warm-filament font-bold flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>SPESIFIKASI PARAMETER</span>
                </div>
                <div className="text-[11px] text-soft-mist/70 space-y-0.5">
                  <div>• Panjang Kunci: <span className="text-pure-signal">256 bit (32 byte)</span></div>
                  <div>• Panjang Nonce: <span className="text-pure-signal">96 bit (12 byte)</span></div>
                  <div>• Tag Otentikasi: <span className="text-pure-signal">128 bit (Poly1305)</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 3: Hybrid Encryption */}
        {activeProtoTab === 'hybrid' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-graphite-lift">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-pure-signal uppercase">Hybrid Cryptography (RSA-OAEP 2048 + AES-256-GCM)</span>
              </div>
              <span className="text-[10px] font-mono bg-orchid-whisper/20 text-orchid-whisper px-2 py-0.5 rounded-sm border border-orchid-whisper">
                ASYMMETRIC + SYMMETRIC
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
              Enkripsi Asimetris (RSA) sangat aman untuk pertukaran kunci namun lambat untuk data besar. Sebaliknya, Enkripsi Simetris (AES) sangat cepat untuk data besar namun membutuhkan password bersama. <strong>Hybrid Encryption</strong> menggabungkan kekuatan keduanya secara sempurna.
            </p>

            <div className="bg-midnight-void border border-graphite-lift rounded-sm p-4 font-mono text-xs space-y-2">
              <div className="text-orchid-whisper font-bold">// CARA KERJA ENKRIPSI HYBRID SECUREBOX:</div>
              <ol className="list-decimal list-inside text-soft-mist/80 text-[11px] space-y-1 font-sans">
                <li>Sistem membuat <strong>Kunci Sesi Acak 256-bit (Session Key)</strong> secara otomatis setiap kali mengenkripsi.</li>
                <li>Pesan / File dienkripsi dengan cepat menggunakan <strong>AES-256-GCM</strong> menggunakan Kunci Sesi tersebut.</li>
                <li>Kunci Sesi kemudian dikunci rapat menggunakan <strong>Kunci Publik RSA 2048-bit (RSA-OAEP SHA-256)</strong>.</li>
                <li>Saat dekripsi, hanya pemilik <strong>Kunci Privat RSA</strong> yang dapat membuka Kunci Sesi untuk mendekripsi payload.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Content Tab 4: scrypt KDF */}
        {activeProtoTab === 'scrypt' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-graphite-lift">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-pure-signal uppercase">scrypt Key Derivation Function (RFC 7914)</span>
              </div>
              <span className="text-[10px] font-mono bg-electric-indigo/20 text-pure-signal px-2 py-0.5 rounded-sm border border-electric-indigo">
                MEMORY-HARD KDF
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
              Fungsi hash biasa (seperti MD5 / SHA-256) sangat cepat, sehingga peretas dapat mencoba miliaran tebakan per detik menggunakan GPU. <strong>scrypt</strong> dirancang khusus oleh Colin Percival untuk mewajibkan alokasi memori RAM yang besar, membuat serangan brute-force hardware secara paralel menjadi mustahil secara ekonomis dan fisik.
            </p>

            <div className="bg-midnight-void border border-graphite-lift rounded-sm p-3.5 font-mono text-xs text-pure-signal overflow-x-auto space-y-1.5">
              <code className="text-electric-indigo font-bold">scrypt(password, salt, key_len=32, n=16384, r=8, p=1)</code>
              <div className="text-soft-mist/70 text-[11px] space-y-0.5 pt-1 font-sans">
                <div>• <span className="font-mono text-pure-signal font-bold">n = 16,384 (2^14):</span> Parameter beban CPU & alokasi RAM (Memory Cost).</div>
                <div>• <span className="font-mono text-pure-signal font-bold">r = 8:</span> Ukuran blok komputasi internal (Block Size).</div>
                <div>• <span className="font-mono text-pure-signal font-bold">p = 1:</span> Faktor paralelisasi eksekusi (Parallelization).</div>
                <div>• <span className="font-mono text-pure-signal font-bold">output = 32 byte:</span> Kunci simetris 256-bit murni yang siap disuplai ke cipher.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kamus Istilah Kriptografi (Glossary) */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-mono text-pure-signal flex items-center space-x-2 uppercase">
            <FileText className="w-4 h-4 text-electric-indigo" />
            <span>// GLOSARIUM PARAMETER KRIPTOGRAFI</span>
          </h2>
          <span className="text-xs font-mono text-soft-mist/50">4 PARAMETER KUNCI</span>
        </div>

        <p className="text-xs text-soft-mist leading-relaxed font-sans">
          Setiap file atau teks yang dienkripsi menghasilkan paket metadata berikut. Seluruh parameter ini aman untuk dibagikan secara terbuka karena tidak mengandung password atau kunci privat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-pure-signal uppercase">SALT (16 BYTES / 128 BIT)</span>
              <span className="text-[10px] text-warm-filament">Pengacak Password</span>
            </div>
            <p className="text-soft-mist/80 leading-relaxed font-sans text-[12px]">
              Deretan angka acak unik yang digabungkan dengan password saat proses scrypt KDF. Menjamin bahwa dua pengguna dengan password yang sama tetap memiliki kunci enkripsi yang berbeda 100%, menggagalkan serangan <em>Rainbow Table</em>.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-pure-signal uppercase">NONCE / IV (12 BYTES / 96 BIT)</span>
              <span className="text-[10px] text-lime-beacon">Number Used Once</span>
            </div>
            <p className="text-soft-mist/80 leading-relaxed font-sans text-[12px]">
              Vektor inisialisasi unik pada setiap sesi enkripsi. Menjamin jika Anda mengenkripsi file yang sama berulang kali, hasil ciphertext-nya akan selalu berbeda total sehingga pola data asli tidak dapat dianalisis musuh.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-pure-signal uppercase">AUTH TAG (16 BYTES / 128 BIT)</span>
              <span className="text-[10px] text-orchid-whisper">Segel Integritas Data</span>
            </div>
            <p className="text-soft-mist/80 leading-relaxed font-sans text-[12px]">
              Tanda tangan digital matematis yang dihitung oleh algoritma AEAD. Membuktikan bahwa ciphertext asli dan belum pernah mengalami modifikasi bit, pemalsuan, atau kerusakan sebelum dibuka.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-pure-signal uppercase">CIPHERTEXT (BASE64)</span>
              <span className="text-[10px] text-periwinkle-veil">Data Tersandi</span>
            </div>
            <p className="text-soft-mist/80 leading-relaxed font-sans text-[12px]">
              Data rahasia yang telah diacak secara matematis dan dikodekan ke dalam karakter teks standar Base64 agar dapat disalin, disimpan, atau dikirimkan melalui internet dengan mudah dan aman.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-5">
        <h2 className="text-base font-bold font-mono text-pure-signal flex items-center space-x-2 uppercase">
          <HelpCircle className="w-4 h-4 text-electric-indigo" />
          <span>// PERTANYAAN UMUM (FAQ)</span>
        </h2>

        <div className="space-y-3 pt-1">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-graphite-lift rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 bg-graphite-lift hover:bg-steel-hover/50 flex items-center justify-between text-xs sm:text-sm font-semibold text-pure-signal transition cursor-pointer"
                >
                  <span className="font-sans">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-periwinkle-veil flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-soft-mist/60 flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-midnight-void text-xs sm:text-sm text-soft-mist whitespace-pre-line leading-relaxed border-t border-graphite-lift font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-pure-signal font-sans">
            Siap Menguji Protokol Kriptografi?
          </h3>
          <p className="text-xs text-soft-mist/70 mt-1 font-mono">
            COBA ENKRIPSI TEKS, FILE, ATAU JALANKAN UJI KECEPATAN (BENCHMARK) LANGSUNG.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('encrypt')}
            className="btn-primary"
          >
            <span>ENKRIPSI TEKS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className="btn-secondary"
          >
            <Cpu className="w-3.5 h-3.5 text-periwinkle-veil" />
            <span>UJI BENCHMARK</span>
          </button>
        </div>
      </div>
    </div>
  );
};

