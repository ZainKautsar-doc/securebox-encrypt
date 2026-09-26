import React from 'react';
import { DecryptForm } from '../components/DecryptForm';
import { Unlock, Layers } from 'lucide-react';

export const Decrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <Unlock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Decrypt Text</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            AEAD TAG VERIFICATION & CIPHERTEXT RECOVERY WITH RECONSTRUCTED KEY
          </p>
        </div>
      </div>

      {/* Step-by-Step Flow Indicator */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-lime-beacon" />
          <span>// DECRYPTION & AUTHENTICATION PIPELINE (4 STEPS)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">01. LOAD DATA</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 1</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Paste ciphertext & metadata (Salt, Nonce, Tag) or load JSON file.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">02. KEY RECON</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 2</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              scrypt re-derives the identical 256-bit key from passphrase + Salt.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">03. TAG CHECK</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 3</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              AEAD engine verifies 128-bit MAC tag. Rejects if tampered.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-lime-beacon/50 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lime-beacon text-sm">04. PLAINTEXT</span>
              <span className="text-[10px] font-mono text-lime-beacon">VERIFIED</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Original message recovered bit-for-bit with cryptographic integrity.
            </p>
          </div>
        </div>
      </div>

      <DecryptForm />
    </div>
  );
};
