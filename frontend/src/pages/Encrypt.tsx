import React from "react";
import { EncryptForm } from "../components/EncryptForm";
import { Lock, Layers, Shield } from "lucide-react";

export const Encrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">
            Enkripsi Teks (Encrypt Text)
          </h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            PENYANDIAN PESAN RAHASIA DENGAN DERIVASI KUNCI SCRYPT + CIPHER
            OTENTIKASI AEAD
          </p>
        </div>
      </div>

      {/* Tujuan & Maksud Fitur */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-electric-indigo" />
          <span className="font-mono text-xs font-bold text-warm-filament uppercase tracking-wider">
            // MAKSUD & TUJUAN FITUR
          </span>
        </div>
        <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
          Fitur ini bertujuan untuk{" "}
          <strong>
            mengubah teks rahasia (Plaintext) menjadi teks tersandi acak
            (Ciphertext)
          </strong>{" "}
          yang mustahil dibaca tanpa password. Berbeda dengan enkripsi biasa,
          SecureBox juga membuat <strong>Auth Tag (segel integritas)</strong>{" "}
          sehingga pesan dijamin tidak dapat dipalsukan atau diubah di tengah
          jalan oleh peretas.
        </p>
      </div>

      {/* Step-by-Step Flow Indicator (Carbon Panel, 2px radius, Electric Indigo signals) */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-electric-indigo" />
          <span>// ALUR PROSES ENKRIPSI TEKS (4 TAHAP)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">
                  01. INPUT
                </span>
                <span className="text-[10px] font-mono text-soft-mist/40 bg-midnight-void px-1.5 py-0.5 rounded-sm">
                  TAHAP 1
                </span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">
                Teks & Password
              </h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Masukkan pesan rahasia dan password pengaman, lalu pilih
                algoritma (AES-GCM / ChaCha20 / Hybrid RSA).
              </p>
            </div>
            <span className="text-[10px] font-mono text-warm-filament pt-1 block">
              Input Pesan
            </span>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">
                  02. SCRYPT KDF
                </span>
                <span className="text-[10px] font-mono text-soft-mist/40 bg-midnight-void px-1.5 py-0.5 rounded-sm">
                  TAHAP 2
                </span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">
                Penurunan Kunci
              </h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Sistem membuat <strong>Salt acak 16-byte</strong> dan scrypt
                menghasilkan kunci biner 256-bit di RAM.
              </p>
            </div>
            <span className="text-[10px] font-mono text-electric-indigo pt-1 block">
              Key = 256 bit
            </span>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">
                  03. AEAD CIPHER
                </span>
                <span className="text-[10px] font-mono text-soft-mist/40 bg-midnight-void px-1.5 py-0.5 rounded-sm">
                  TAHAP 3
                </span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">
                Penyandian & Tag
              </h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Dihasilkan <strong>Nonce acak 12-byte</strong>. Teks disandikan
                dan segel otentikasi (16-byte Auth Tag) dihitung.
              </p>
            </div>
            <span className="text-[10px] font-mono text-lime-beacon pt-1 block">
              Tag = 128 bit
            </span>
          </div>

          <div className="p-4 bg-graphite-lift border border-electric-indigo/50 rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lime-beacon text-xs">
                  04. OUTPUT
                </span>
                <span className="text-[10px] font-mono text-lime-beacon bg-lime-beacon/10 px-1.5 py-0.5 rounded-sm">
                  SIAP
                </span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">
                Paket Base64 JSON
              </h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Hasil Ciphertext beserta Salt, Nonce, dan Tag siap disalin atau
                diunduh sebagai file JSON.
              </p>
            </div>
            <span className="text-[10px] font-mono text-pure-signal pt-1 block">
              Ekspor Base64
            </span>
          </div>
        </div>
      </div>

      <EncryptForm />
    </div>
  );
};
