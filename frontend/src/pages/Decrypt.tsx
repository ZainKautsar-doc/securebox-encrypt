import React from 'react';
import { DecryptForm } from '../components/DecryptForm';
import { Unlock, Layers, ShieldCheck } from 'lucide-react';

export const Decrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <Unlock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Dekripsi Teks (Decrypt Text)</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            VERIFIKASI INTEGRITAS AUTH TAG & REKONSTRUKSI PESAN ASLI DENGAN KUNCI TEPAT
          </p>
        </div>
      </div>

      {/* Tujuan & Maksud Fitur */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-lime-beacon" />
          <span className="font-mono text-xs font-bold text-warm-filament uppercase tracking-wider">
            // MAKSUD & TUJUAN FITUR
          </span>
        </div>
        <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
          Fitur ini bertujuan untuk <strong>mengembalikan teks tersandi (Ciphertext) menjadi pesan asli (Plaintext)</strong>. Sebelum data dibuka, mesin AEAD akan terlebih dahulu memvalidasi <strong>Auth Tag</strong>. Jika password salah atau pesan pernah diedit/rusak sekecil apapun, dekripsi akan langsung dibatalkan secara aman.
        </p>
      </div>

      {/* Step-by-Step Flow Indicator */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-lime-beacon" />
          <span>// ALUR PROSES DEKRIPSI TEKS (4 TAHAP)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">01. INPUT DATA</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">TAHAP 1</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Masukkan Data</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Tempel Ciphertext beserta parameter (Salt, Nonce, Tag) atau unggah langsung file JSON hasil enkripsi.
              </p>
            </div>
            <span className="text-[10px] font-mono text-warm-filament pt-1 block">Input Parameter</span>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">02. REKONSTRUKSI</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">TAHAP 2</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Rekonstruksi Kunci</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                scrypt menurunkan ulang Kunci 256-bit identik menggunakan password yang dimasukkan dan Salt terlampir.
              </p>
            </div>
            <span className="text-[10px] font-mono text-electric-indigo pt-1 block">Derived Key identik</span>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">03. VERIFIKASI</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">TAHAP 3</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Validasi Auth Tag</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Mesin AEAD mencocokkan segel Auth Tag 128-bit. Ditolak jika ada manipulasi karakter atau salah password.
              </p>
            </div>
            <span className="text-[10px] font-mono text-orchid-whisper pt-1 block">Validasi Integritas</span>
          </div>

          <div className="p-4 bg-graphite-lift border border-lime-beacon/50 rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lime-beacon text-xs">04. TERBUKA</span>
                <span className="text-[10px] font-mono text-lime-beacon bg-lime-beacon/10 px-1.5 py-0.5 rounded-sm">SUKSES</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Pesan Asli Tampil</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Pesan asli (Plaintext) berhasil direkonstruksi 100% utuh bit-demi-bit dan dapat disalin ke clipboard.
              </p>
            </div>
            <span className="text-[10px] font-mono text-lime-beacon pt-1 block">Plaintext Pulih</span>
          </div>
        </div>
      </div>

      <DecryptForm />
    </div>
  );
};
