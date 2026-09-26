import React from 'react';
import { EncryptForm } from '../components/EncryptForm';
import { Lock, Layers } from 'lucide-react';

export const Encrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Encrypt Text</h1>
          <p className="text-xs text-slate-500">
            Encrypt plaintext using scrypt Key Derivation (KDF) with AES-256-GCM or ChaCha20-Poly1305.
          </p>
        </div>
      </div>

      {/* Step-by-Step Encryption Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Alur Kerja Proses Enkripsi (Encryption Flow)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-600 block">Langkah 1: Input</span>
            <p className="text-slate-600">
              Pengguna memasukkan plaintext dan passphrase rahasia serta memilih algoritma.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-600 block">Langkah 2: Salt & KDF</span>
            <p className="text-slate-600">
              Backend menghasilkan 16-byte random salt. Algoritma <strong>scrypt</strong> menurunkan kunci simetris 256-bit.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-600 block">Langkah 3: Nonce & AEAD</span>
            <p className="text-slate-600">
              12-byte random nonce dibuat. Cipher mengenkripsi plaintext & menghasilkan 16-byte Auth Tag.
            </p>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-700 block">Langkah 4: Output</span>
            <p className="text-slate-700">
              Ciphertext dikirim bersama metadata (Salt, Nonce, Tag) dalam format Base64 / JSON.
            </p>
          </div>
        </div>
      </div>

      <EncryptForm />
    </div>
  );
};
