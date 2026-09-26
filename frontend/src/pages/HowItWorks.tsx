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
      a: 'Dalam skema Authenticated Encryption (AEAD):\n• Salt (16B) diperlukan agar scrypt menurunkan derived key yang identik dari password.\n• Nonce (12B) menentukan initial state pada stream cipher.\n• Auth Tag (16B) memverifikasi bahwa ciphertext tidak mengalami manipulasi bit.\nTanpa parameter ini, verifikasi otentikasi akan menolak proses rekonstruksi data.'
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
      <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal">
        <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
          <BookOpen className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-snow">Protocol Specification</h1>
          <p className="text-xs font-mono text-smoke mt-0.5">
            AEAD architecture, scrypt memory-hard parameters & zero-knowledge model
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-5 transition-all duration-150 hover:border-graphite">
        <div className="inline-flex items-center space-x-2 pill-status">
          <span className="w-2 h-2 bg-phosphor rounded-full" />
          <span className="text-xs font-mono text-silver tracking-terminal uppercase">
            Security & Zero-Knowledge Core
          </span>
        </div>
        <h2 className="text-xl font-normal tracking-tight text-snow">
          Modern Authenticated Encryption & Memory-Hard Key Derivation
        </h2>
        <p className="text-sm text-silver leading-relaxed font-normal">
          SecureBox menerapkan skema <strong>Authenticated Encryption with Associated Data (AEAD)</strong>. Berbeda dengan metode cipher lawas (seperti AES-CBC tanpa MAC) yang rentan terhadap manipulasi bit dan serangan <em>padding oracle</em>, SecureBox memberikan dua lapis perlindungan mutlak sekaligus: <strong>Kerahasiaan (Confidentiality)</strong> dan <strong>Integritas Data (Authenticity)</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 bg-ash border border-charcoal rounded-base space-y-2">
            <div className="w-8 h-8 rounded-sm bg-charcoal text-phosphor flex items-center justify-center">
              <Fingerprint className="w-4 h-4 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-medium text-snow">1. scrypt KDF</h3>
            <p className="text-xs text-smoke leading-relaxed font-normal">
              Menghasilkan kunci simetris 256-bit dengan struktur memory-hard tahan brute-force GPU/ASIC cluster.
            </p>
          </div>

          <div className="p-5 bg-ash border border-charcoal rounded-base space-y-2">
            <div className="w-8 h-8 rounded-sm bg-charcoal text-phosphor flex items-center justify-center">
              <Shield className="w-4 h-4 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-medium text-snow">2. 256-Bit Ciphers</h3>
            <p className="text-xs text-smoke leading-relaxed font-normal">
              Dukungan ganda untuk AES-256-GCM (terakselerasi hardware) dan ChaCha20-Poly1305 (stream cipher konstan).
            </p>
          </div>

          <div className="p-5 bg-ash border border-charcoal rounded-base space-y-2">
            <div className="w-8 h-8 rounded-sm bg-charcoal text-phosphor flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-medium text-snow">3. 128-Bit Auth Tag</h3>
            <p className="text-xs text-smoke leading-relaxed font-normal">
              Setiap payload diproteksi dengan tag otentikasi kriptografis untuk mencegah modifikasi bit terselubung.
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Deep-Dive */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-phosphor" />
          <h2 className="text-lg font-medium text-snow">
            Algorithm Architecture & Specifications
          </h2>
        </div>

        <div className="space-y-6 divide-y divide-charcoal">
          {/* scrypt */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-snow">1. scrypt Key Derivation (RFC 7914)</h3>
              <span className="pill-status !py-0.5 !px-2 !text-xs !border-forest text-phosphor">
                Memory-Hard
              </span>
            </div>
            <p className="text-xs text-silver leading-relaxed font-normal">
              Fungsi hash biasa dieksekusi terlalu cepat sehingga rentan terhadap jutaan tebakan per detik menggunakan GPU miner. <strong>scrypt</strong> dirancang oleh Colin Percival dengan struktur memori RAM intensif sehingga paralelisasi hardware menjadi tidak ekonomis.
            </p>
            <div className="bg-ash border border-charcoal rounded-sm p-4 font-mono text-xs text-snow overflow-x-auto space-y-1">
              <code className="text-phosphor">scrypt(password, salt, key_len=32, n=16384, r=8, p=1)</code>
              <div className="text-smoke text-[11px] space-y-0.5 pt-2 font-sans">
                <div>• <span className="text-snow font-mono">n = 16384 (2^14):</span> CPU & RAM memory cost parameter</div>
                <div>• <span className="text-snow font-mono">r = 8:</span> Internal block size parameter</div>
                <div>• <span className="text-snow font-mono">p = 1:</span> Parallelization factor</div>
                <div>• <span className="text-snow font-mono">output = 32 bytes:</span> 256-bit derived key</div>
              </div>
            </div>
          </div>

          {/* AES-256-GCM */}
          <div className="pt-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-snow">2. AES-256-GCM (NIST SP 800-38D)</h3>
              <span className="pill-status !py-0.5 !px-2 !text-xs">
                Hardware AES-NI
              </span>
            </div>
            <p className="text-xs text-silver leading-relaxed font-normal">
              Standar enkripsi simetris global dengan mode Galois/Counter Mode. Menggabungkan enkripsi CTR dengan Galois Field Multiplication untuk menghasilkan 128-bit MAC tag secara terintegrasi dengan akselerasi CPU silicon.
            </p>
          </div>

          {/* ChaCha20-Poly1305 */}
          <div className="pt-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-snow">3. ChaCha20-Poly1305 (RFC 8439)</h3>
              <span className="pill-status !py-0.5 !px-2 !text-xs !border-forest text-phosphor">
                Constant-Time ARX
              </span>
            </div>
            <p className="text-xs text-silver leading-relaxed font-normal">
              Diciptakan oleh Daniel J. Bernstein dengan stream cipher 20-round dan authenticator Poly1305. Menggunakan operasi dasar ADD-ROTATE-XOR (ARX) dalam waktu konstan yang kebal terhadap <em>side-channel timing attacks</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-5 transition-all duration-150 hover:border-graphite">
        <h2 className="text-lg font-medium text-snow flex items-center space-x-2">
          <FileText className="w-4 h-4 text-phosphor" />
          <span>Cryptographic Parameters Glossary</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-ash border border-charcoal rounded-base space-y-1.5">
            <span className="font-medium text-snow">Salt (16 Bytes)</span>
            <p className="text-smoke leading-relaxed font-normal">
              Deretan angka acak unik untuk key derivation. Mencegah pre-computed rainbow table attacks saat dua pengguna memiliki password yang sama.
            </p>
          </div>

          <div className="p-4 bg-ash border border-charcoal rounded-base space-y-1.5">
            <span className="font-medium text-snow">Nonce / IV (12 Bytes)</span>
            <p className="text-smoke leading-relaxed font-normal">
              "Number used ONCE". Vektor inisialisasi unik pada setiap sesi enkripsi agar plaintext yang sama menghasilkan ciphertext berbeda.
            </p>
          </div>

          <div className="p-4 bg-ash border border-charcoal rounded-base space-y-1.5">
            <span className="font-medium text-snow">Auth Tag (16 Bytes)</span>
            <p className="text-smoke leading-relaxed font-normal">
              Kode otentikasi 128-bit untuk memvalidasi keaslian dan integritas ciphertext secara kriptografis.
            </p>
          </div>

          <div className="p-4 bg-ash border border-charcoal rounded-base space-y-1.5">
            <span className="font-medium text-snow">Ciphertext (Base64)</span>
            <p className="text-smoke leading-relaxed font-normal">
              Data terenkripsi yang disandikan ke format Base64 standar untuk kemudahan transmisi dan pertukaran data aman.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-5 transition-all duration-150 hover:border-graphite">
        <h2 className="text-lg font-medium text-snow flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-phosphor" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3 pt-1">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-charcoal rounded-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 bg-ash hover:bg-ash/70 flex items-center justify-between text-xs sm:text-sm font-medium text-snow transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-smoke flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-smoke flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-obsidian text-xs sm:text-sm text-silver whitespace-pre-line leading-relaxed border-t border-charcoal font-normal animate-fade-in-down">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-150 hover:border-graphite">
        <div>
          <h3 className="text-lg font-medium text-snow">
            Ready to Encrypt Your Messages & Files?
          </h3>
          <p className="text-xs text-smoke mt-1 font-normal">
            Choose AES-256-GCM or ChaCha20-Poly1305 with zero plaintext persisted.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('encrypt')}
            className="btn-pill-primary"
          >
            <span>Start Encryption</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className="btn-pill-ghost"
          >
            <Cpu className="w-3.5 h-3.5 text-silver" />
            <span>Benchmark</span>
          </button>
        </div>
      </div>
    </div>
  );
};
