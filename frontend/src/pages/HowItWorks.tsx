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
      q: 'Apakah password atau teks asli disimpan di server backend?',
      a: 'Sama sekali tidak. SecureBox mengusung filosofi Zero-Knowledge & Stateless. Backend tidak pernah menyimpan plaintext, password, atau master key ke penyimpanan permanen. Password hanya diproses di memori volatil untuk scrypt KDF lalu langsung di-wipe.'
    },
    {
      q: 'Mengapa Salt, Nonce, dan Auth Tag mutlak diperlukan untuk dekripsi?',
      a: 'Dalam skema Authenticated Encryption (AEAD):\n• Salt (16B) diperlukan agar scrypt menurunkan derived key yang identik dari password.\n• Nonce (12B) menentukan initial state pada stream cipher.\n• Auth Tag (16B) memverifikasi bahwa ciphertext tidak mengalami tampering/manipulasi bit.\nTanpa parameter ini, verifikasi otentikasi akan menolak proses rekonstruksi data.'
    },
    {
      q: 'Apa yang terjadi jika ciphertext dimodifikasi atau password salah?',
      a: 'AEAD (Galois MAC pada AES-GCM atau Poly1305 pada ChaCha20) secara matematis memvalidasi integritas pesan. Modifikasi sekecil 1-bit atau perbedaan password akan menyebabkan kegagalan pencocokan Auth Tag dan backend langsung membatalkan dekripsi dengan status "Authentication Failed".'
    },
    {
      q: 'Kapan sebaiknya memilih AES-256-GCM vs ChaCha20-Poly1305?',
      a: '• AES-256-GCM: Sangat optimal pada mesin desktop, laptop, dan server x86_64 dengan instruksi perangkat keras Intel/AMD AES-NI.\n• ChaCha20-Poly1305: Pilihan ideal untuk arsitektur ARM, perangkat seluler, tablet, dan platform tanpa akselerasi hardware AES karena dieksekusi secara konstan tanpa risiko side-channel timing attacks.'
    },
    {
      q: 'Mengapa payload file dibatasi hingga 10 MB?',
      a: 'Batas 10 MB ditujukan untuk menjaga kecepatan komputasi in-memory real-time tanpa latensi streaming I/O pada antarmuka web.'
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
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Protocol Specification</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            AEAD ARCHITECTURE, SCRYPT MEMORY-HARD PARAMETERS & ZERO-KNOWLEDGE SECURITY MODEL
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-electric-indigo rounded-full"></span>
          <span className="font-mono text-xs font-bold text-warm-filament uppercase tracking-wider">
            // ZERO-KNOWLEDGE AEAD MODEL
          </span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-pure-signal">
          Modern Authenticated Encryption & Key Derivation
        </h2>
        <p className="text-sm text-soft-mist leading-relaxed">
          SecureBox menerapkan skema <strong>Authenticated Encryption with Associated Data (AEAD)</strong>. Berbeda dengan metode cipher lawas (seperti AES-CBC tanpa MAC) yang rentan terhadap manipulasi bit dan serangan <em>padding oracle</em>, SecureBox memberikan dua lapis perlindungan mutlak sekaligus: <strong>Kerahasiaan (Confidentiality)</strong> dan <strong>Integritas Data (Authenticity)</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2">
            <div className="w-7 h-7 rounded-sm bg-electric-indigo/20 text-electric-indigo flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-pure-signal uppercase">1. scrypt KDF</h3>
            <p className="text-xs text-soft-mist/70 leading-relaxed">
              Menghasilkan kunci simetris 256-bit dengan algoritma memory-hard yang kebal terhadap serangan brute-force hardware GPU/ASIC.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2">
            <div className="w-7 h-7 rounded-sm bg-lime-beacon/20 text-lime-beacon flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-pure-signal uppercase">2. 256-Bit Ciphers</h3>
            <p className="text-xs text-soft-mist/70 leading-relaxed">
              Dukungan ganda untuk AES-256-GCM (standar industri terakselerasi) dan ChaCha20-Poly1305 (stream cipher modern konstan).
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-2">
            <div className="w-7 h-7 rounded-sm bg-orchid-whisper/20 text-orchid-whisper flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-bold text-pure-signal uppercase">3. 128-Bit Auth Tag</h3>
            <p className="text-xs text-soft-mist/70 leading-relaxed">
              Setiap ciphertext diproteksi dengan tag otentikasi kriptografis untuk mencegah modifikasi dan serangan bit-flipping.
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Deep-Dive */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-electric-indigo" />
          <h2 className="text-base font-bold font-mono text-pure-signal uppercase">
            // ALGORITHM SPECIFICATIONS & ANATOMY
          </h2>
        </div>

        <div className="space-y-6 divide-y divide-graphite-lift">
          {/* scrypt */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-pure-signal uppercase">1. scrypt Key Derivation (RFC 7914)</h3>
              <span className="text-[10px] font-mono bg-electric-indigo/20 text-pure-signal px-2 py-0.5 rounded-sm border border-electric-indigo">
                MEMORY-HARD
              </span>
            </div>
            <p className="text-xs text-soft-mist leading-relaxed">
              Fungsi hash tradisional (seperti MD5 / SHA-256) dieksekusi terlalu cepat sehingga rentan terhadap jutaan tebakan per detik menggunakan GPU cluster. <strong>scrypt</strong> dirancang oleh Colin Percival dengan struktur memori intensif sehingga komputasi paralel hardware menjadi sangat mahal.
            </p>
            <div className="bg-midnight-void border border-graphite-lift rounded-sm p-3.5 font-mono text-xs text-pure-signal overflow-x-auto space-y-1">
              <code className="text-electric-indigo font-bold">scrypt(password, salt, key_len=32, n=16384, r=8, p=1)</code>
              <div className="text-soft-mist/60 text-[11px] space-y-0.5 pt-1">
                <div>• <span className="text-pure-signal">n = 16384 (2^14):</span> CPU & RAM memory cost parameter</div>
                <div>• <span className="text-pure-signal">r = 8:</span> Internal block size parameter</div>
                <div>• <span className="text-pure-signal">p = 1:</span> Parallelization factor</div>
                <div>• <span className="text-pure-signal">output = 32 bytes:</span> 256-bit derived key</div>
              </div>
            </div>
          </div>

          {/* AES-256-GCM */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-pure-signal uppercase">2. AES-256-GCM (NIST SP 800-38D)</h3>
              <span className="text-[10px] font-mono bg-periwinkle-veil/20 text-periwinkle-veil px-2 py-0.5 rounded-sm border border-periwinkle-veil">
                HARDWARE AES-NI
              </span>
            </div>
            <p className="text-xs text-soft-mist leading-relaxed">
              Standar enkripsi simetris global dengan mode Galois/Counter Mode. Menggabungkan enkripsi CTR dengan Galois Field Multiplication untuk menghasilkan 128-bit MAC tag. Memanfaatkan instruksi langsung pada CPU modern untuk throughput data masif.
            </p>
          </div>

          {/* ChaCha20-Poly1305 */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-pure-signal uppercase">3. ChaCha20-Poly1305 (RFC 8439)</h3>
              <span className="text-[10px] font-mono bg-lime-beacon/20 text-lime-beacon px-2 py-0.5 rounded-sm border border-lime-beacon">
                CONSTANT-TIME ARX
              </span>
            </div>
            <p className="text-xs text-soft-mist leading-relaxed">
              Diciptakan oleh Daniel J. Bernstein dengan stream cipher 20-round dan one-time authenticator Poly1305. Menggunakan operasi dasar ADD-ROTATE-XOR (ARX) dalam waktu konstan yang kebal terhadap <em>side-channel timing attacks</em>. Digunakan luas pada TLS 1.3 dan WireGuard VPN.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold font-mono text-pure-signal flex items-center space-x-2 uppercase">
          <FileText className="w-4 h-4 text-electric-indigo" />
          <span>// CRYPTOGRAPHIC PARAMETERS GLOSSARY</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <span className="font-bold text-pure-signal uppercase">SALT (16 BYTES)</span>
            <p className="text-soft-mist/70 leading-relaxed font-sans text-[12px]">
              Deretan angka acak unik untuk key derivation. Mencegah pre-computed rainbow table attacks saat dua pengguna menggunakan password yang sama.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <span className="font-bold text-pure-signal uppercase">NONCE / IV (12 BYTES)</span>
            <p className="text-soft-mist/70 leading-relaxed font-sans text-[12px]">
              "Number used ONCE". Vektor inisialisasi unik pada setiap sesi enkripsi agar plaintext yang sama menghasilkan ciphertext berbeda.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <span className="font-bold text-pure-signal uppercase">AUTH TAG (16 BYTES)</span>
            <p className="text-soft-mist/70 leading-relaxed font-sans text-[12px]">
              Kode otentikasi matematis 128-bit untuk membuktikan keaslian dan integritas ciphertext secara kriptografis.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <span className="font-bold text-pure-signal uppercase">CIPHERTEXT (BASE64)</span>
            <p className="text-soft-mist/70 leading-relaxed font-sans text-[12px]">
              Keluaran data terenkripsi yang disandikan ke format Base64 standar untuk kemudahan transmisi dan pertukaran aman.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold font-mono text-pure-signal flex items-center space-x-2 uppercase">
          <HelpCircle className="w-4 h-4 text-electric-indigo" />
          <span>// FREQUENTLY ASKED QUESTIONS</span>
        </h2>

        <div className="space-y-3 pt-2">
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
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-soft-mist flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-soft-mist flex-shrink-0 ml-2" />
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
            Ready to Initialize Encryption Protocol?
          </h3>
          <p className="text-xs text-soft-mist/70 mt-1 font-mono">
            SELECT TEXT OR FILE ENCRYPTION WITH AUTHENTICATED AEAD CIPHERS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('encrypt')}
            className="btn-primary"
          >
            <span>ENCRYPT TEXT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className="btn-secondary"
          >
            <Cpu className="w-3.5 h-3.5 text-periwinkle-veil" />
            <span>RUN BENCHMARK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
