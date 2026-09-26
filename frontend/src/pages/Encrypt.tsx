import React from 'react';
import { EncryptForm } from '../components/EncryptForm';
import { Lock, Layers } from 'lucide-react';

export const Encrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Encrypt Text</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            SCRYPT KEY DERIVATION + AEAD CIPHERTEXT GENERATION (AES-256-GCM / CHACHA20-POLY1305)
          </p>
        </div>
      </div>

      {/* Step-by-Step Flow Indicator (Carbon Panel, 2px radius, Electric Indigo signals) */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-electric-indigo" />
          <span>// ENCRYPTION PROTOCOL PIPELINE (4 STEPS)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">01. INPUT</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 1</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Supply plaintext payload & human passphrase. Choose AEAD cipher.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">02. SCRYPT KDF</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 2</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              16B random salt generated. scrypt derives 256-bit symmetric key in memory.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">03. AEAD CIPHER</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 3</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              12B nonce generated. Ciphertext + 16B authentication tag created.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-electric-indigo/50 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lime-beacon text-sm">04. OUTPUT</span>
              <span className="text-[10px] font-mono text-lime-beacon">READY</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Ciphertext, Salt, Nonce, and Auth Tag exported as Base64 JSON.
            </p>
          </div>
        </div>
      </div>

      <EncryptForm />
    </div>
  );
};
