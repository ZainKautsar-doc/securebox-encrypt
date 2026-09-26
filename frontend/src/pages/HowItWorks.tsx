import React, { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Key, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Fingerprint,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const HowItWorks: React.FC = () => {
  const { setActiveTab } = useSecureBox();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apakah password atau teks asli saya disimpan di server?',
      a: 'Sama sekali tidak. SecureBox dirancang dengan prinsip Zero-Knowledge / Stateless. Backend tidak menggunakan database untuk menyimpan pesan, plaintext, maupun password Anda. Password hanya digunakan seketika di memori untuk menurunkan kunci (scrypt KDF) lalu langsung dibuang.'
    },
    {
      q: 'Mengapa saya wajib menyimpan Salt, Nonce, dan Auth Tag untuk mendekripsi?',
      a: 'Dalam kriptografi modern terotentikasi (AEAD):\n• Salt diperlukan agar scrypt KDF dapat menurunkan kunci rahasia yang sama persis dari password Anda.\n• Nonce (Number used Once) menentukan stream cipher awal.\n• Auth Tag (16 bytes) memverifikasi integritas data bahwa ciphertext tidak pernah dimodifikasi.\nTanpa ketiga komponen tersebut, proses dekripsi tidak dapat dilakukan.'
    },
    {
      q: 'Apa yang terjadi jika saya salah password atau ada data yang diubah (tampered)?',
      a: 'Berkat mekanisme AEAD (Galois MAC pada AES-GCM dan Poly1305 pada ChaCha20), jika password salah atau bahkan hanya 1 bit ciphertext dimanipulasi di perjalanan, algoritma akan mendeteksi ketidakcocokan Auth Tag dan menolak dekripsi dengan error "Authentication Failed". Hal ini melindungi Anda dari serangan tampering dan bit-flipping.'
    },
    {
      q: 'Kapan sebaiknya memilih AES-256-GCM vs ChaCha20-Poly1305?',
      a: '• AES-256-GCM: Pilihan utama pada komputer desktop, laptop, dan server yang memiliki instruksi prosesor AES-NI (hardware acceleration).\n• ChaCha20-Poly1305: Pilihan terbaik untuk perangkat mobile, tablet, arsitektur ARM, atau komputer tanpa instruksi khusus AES-NI karena berjalan murni di software secara konstan tanpa rentan terhadap cache-timing attacks.'
    },
    {
      q: 'Mengapa batas upload file dibatasi 10 MB?',
      a: 'Batas 10 MB ditetapkan untuk memastikan performa responsif instan di browser dan server tanpa membebani memori I/O. Kriptografi in-memory untuk 10 MB dapat diselesaikan dalam hitungan milidetik.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bagaimana SecureBox Bekerja</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Panduan arsitektur, alur kerja kriptografi terotentikasi (AEAD), dan spesifikasi algoritma modern.
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Prinsip Keamanan & Zero-Knowledge</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Enkripsi Modern Berbasis AEAD & Memory-Hard KDF
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          SecureBox menggunakan skema <strong>Authenticated Encryption with Associated Data (AEAD)</strong>.
          Tidak seperti enkripsi lawas (seperti AES-CBC tanpa otentikasi) yang rentan terhadap serangan <em>padding oracle</em> dan manipulasi ciphertext,
          SecureBox menjamin dua aspek fundamental sekaligus: <strong>Kerahasiaan (Confidentiality)</strong> dan <strong>Integritas Data (Authenticity)</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <Fingerprint className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">1. scrypt KDF</h3>
            <p className="text-xs text-slate-500 mt-1">
              Menurunkan kunci 256-bit dari password manusia dengan algoritma memory-hard tahan brute-force ASIC/GPU.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">2. Ciphers 256-bit</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilihan antara AES-256-GCM (standar industri tercepat) atau ChaCha20-Poly1305 (modern stream cipher).
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">3. Auth Tag 128-bit</h3>
            <p className="text-xs text-slate-500 mt-1">
              Otentikasi data otomatis. Setiap manipulasi bit pada file atau teks terenkripsi akan langsung terdeteksi.
            </p>
          </div>
        </div>
      </div>



      {/* Deep-dive Algorithms */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Bedah Anatomi Algoritma</h2>
        </div>

        <div className="space-y-6 divide-y divide-slate-100">
          {/* scrypt */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">1. scrypt Key Derivation Function (KDF)</h3>
              <span className="text-xs font-mono bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded border border-amber-200">
                RFC 7914
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fungsi hash biasa seperti MD5 atau SHA-256 dirancang sangat cepat untuk hashing file, namun menjadikannya <em>sangat rentan</em> terhadap serangan tebak password massal (jutaan tebakan per detik menggunakan GPU atau ASIC miner).
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>scrypt</strong> dirancang khusus oleh Colin Percival sebagai <em>memory-hard function</em>. Algoritma ini sengaja menghabiskan memori RAM dan komputasi CPU dalam jumlah terukur sehingga penyerang perangkat keras tidak dapat melakukan paralelisasi murah.
            </p>
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <code>scrypt(password, salt, key_len=32, n=16384, r=8, p=1)</code>
              <div className="mt-2 text-slate-400 space-y-0.5 text-[11px]">
                <div>• <span className="text-amber-400">n = 16384 (2^14):</span> Faktor biaya CPU & memori RAM</div>
                <div>• <span className="text-amber-400">r = 8:</span> Ukuran blok memori internal</div>
                <div>• <span className="text-amber-400">p = 1:</span> Faktor paralelisasi thread</div>
                <div>• <span className="text-amber-400">output = 32 bytes:</span> Kunci simetris 256-bit presisi</div>
              </div>
            </div>
          </div>

          {/* AES-256-GCM */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">2. AES-256-GCM (Galois/Counter Mode)</h3>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                NIST SP 800-38D
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AES (Advanced Encryption Standard) adalah standar global enkripsi simetris yang diadopsi oleh pemerintah Amerika Serikat dan standar industri perbankan internasional.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mode <strong>GCM (Galois/Counter Mode)</strong> menggabungkan enkripsi CTR mode dengan Galois Field Multiplication untuk membuat tag otentikasi. Keunggulan terbesarnya adalah dukungan langsung di tingkat prosesor Intel/AMD modern melalui instruksi <strong>AES-NI</strong>, menghasilkan kecepatan throughput mencapai beberapa gigabyte per detik.
            </p>
          </div>

          {/* ChaCha20-Poly1305 */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">3. ChaCha20-Poly1305</h3>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200">
                RFC 8439 / IETF
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Diciptakan oleh kriptografer ternama <strong>Daniel J. Bernstein</strong> sebagai suksesor Salsa20. Menggunakan stream cipher 20-round dengan otentikator Poly1305.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Algoritma ini menggunakan operasi dasar ADD-ROTATE-XOR (ARX) yang dieksekusi dalam waktu konstan (<em>constant-time execution</em>). Hal ini membuat ChaCha20 kebal terhadap serangan <em>side-channel timing attacks</em> dan menjadikannya algoritma default pada protokol modern seperti WireGuard, TLS 1.3, dan Android.
            </p>
          </div>
        </div>
      </div>

      {/* Parameter Glossary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Glosarium Istilah Kriptografi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 text-sm">Salt (16 Bytes)</span>
            <p className="text-slate-600 leading-relaxed">
              Deretan angka acak yang digabungkan dengan password saat proses key derivation. Memastikan dua pengguna dengan password yang sama tetap memiliki derived key yang berbeda.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 text-sm">Nonce / IV (12 Bytes)</span>
            <p className="text-slate-600 leading-relaxed">
              "Number used ONCE". Vektor inisialisasi unik untuk setiap kali enkripsi dijalankan. Mencegah pola yang sama terlihat meski mengenkripsi dokumen yang sama berulang kali.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 text-sm">Auth Tag / MAC (16 Bytes)</span>
            <p className="text-slate-600 leading-relaxed">
              Kode otentikasi kriptografis 128-bit yang dihasilkan di akhir proses enkripsi. Menjadi bukti matematis bahwa ciphertext tidak pernah dirusak atau diubah.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 text-sm">Ciphertext (Teks Terenkripsi)</span>
            <p className="text-slate-600 leading-relaxed">
              Data terenkripsi yang tampak seperti karakter acak tak terbaca. Disandikan ke format <strong>Base64</strong> untuk kemudahan transmisi pada web.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
        </h2>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold">Siap Mengamankan Pesan & Berkas Anda?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Coba enkripsi teks atau file Anda sekarang dengan salah satu cipher terkuat di dunia.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('encrypt')}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <span>Mulai Enkripsi Teks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lihat Benchmark</span>
          </button>
        </div>
      </div>
    </div>
  );
};
