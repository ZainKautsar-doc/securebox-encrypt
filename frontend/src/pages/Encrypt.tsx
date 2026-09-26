import React from 'react';
import { EncryptForm } from '../components/EncryptForm';
import { Lock, Layers } from 'lucide-react';

export const Encrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal">
        <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
          <Lock className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-snow">Encrypt Text</h1>
          <p className="text-xs font-mono text-smoke mt-0.5">
            scrypt key derivation + AEAD ciphertext output (AES-256-GCM / ChaCha20-Poly1305)
          </p>
        </div>
      </div>

      {/* Step-by-Step Flow Indicator (Supabase 16px radius, Charcoal border, Phosphor active) */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 space-y-4 transition-all duration-150 hover:border-graphite">
        <div className="flex items-center space-x-2 text-smoke font-mono text-xs uppercase tracking-terminal">
          <Layers className="w-4 h-4 text-phosphor" />
          <span>// Encryption Pipeline (4 Steps)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">01. Input</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 1</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Supply plaintext payload & human passphrase. Choose AEAD cipher.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">02. scrypt KDF</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 2</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              16B random salt generated. scrypt derives 256-bit symmetric key.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">03. AEAD Cipher</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 3</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              12B nonce generated. Ciphertext + 16B authentication tag created.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-forest rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">04. Output</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px] !border-forest text-phosphor">Ready</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Ciphertext, Salt, Nonce, and Auth Tag exported as Base64 JSON.
            </p>
          </div>
        </div>
      </div>

      <EncryptForm />
    </div>
  );
};
