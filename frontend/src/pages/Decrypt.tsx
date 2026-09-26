import React from 'react';
import { DecryptForm } from '../components/DecryptForm';
import { Unlock, Layers } from 'lucide-react';

export const Decrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Unlock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Decrypt Text</h1>
          <p className="text-xs text-slate-500">
            Verify authentication tag and decrypt ciphertext using your passphrase and parameters.
          </p>
        </div>
      </div>

      {/* Step-by-Step Decryption Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Alur Kerja Proses Dekripsi (Decryption Flow)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-600 block">Langkah 1: Muat Data</span>
            <p className="text-slate-600">
              Input ciphertext bersama metadata (Salt, Nonce, Tag) atau unggah berkas metadata .json.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-600 block">Langkah 2: Rekonstruksi Kunci</span>
            <p className="text-slate-600">
              Password dimasukkan. scrypt dijalankan ulang bersama Salt yang sama untuk merekonstruksi kunci 256-bit.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-600 block">Langkah 3: Verifikasi Tag</span>
            <p className="text-slate-600">
              Mesin AEAD memverifikasi Auth Tag 128-bit. Jika tag tidak cocok (password salah/data dirusak), proses ditolak.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-700 block">Langkah 4: Hasil Asli</span>
            <p className="text-slate-700">
              Plaintext berhasil dipulihkan secara utuh tanpa risiko modifikasi bit dari pihak ketiga.
            </p>
          </div>
        </div>
      </div>

      <DecryptForm />
    </div>
  );
};
