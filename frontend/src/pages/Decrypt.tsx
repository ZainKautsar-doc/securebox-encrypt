import React from 'react';
import { DecryptForm } from '../components/DecryptForm';
import { Unlock, Layers } from 'lucide-react';

export const Decrypt: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal">
        <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
          <Unlock className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-snow">Decrypt Text</h1>
          <p className="text-xs font-mono text-smoke mt-0.5">
            AEAD tag verification & ciphertext recovery with reconstructed key
          </p>
        </div>
      </div>

      {/* Step-by-Step Flow Indicator */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 space-y-4 transition-all duration-150 hover:border-graphite">
        <div className="flex items-center space-x-2 text-smoke font-mono text-xs uppercase tracking-terminal">
          <Layers className="w-4 h-4 text-phosphor" />
          <span>// Decryption & Verification Pipeline (4 Steps)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">01. Load Data</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 1</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Paste ciphertext & metadata (Salt, Nonce, Tag) or load JSON file.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">02. Key Recon</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 2</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              scrypt re-derives the identical 256-bit key from passphrase + Salt.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">03. Tag Check</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 3</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              AEAD engine verifies 128-bit MAC tag. Rejects if tampered.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-forest rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">04. Plaintext</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px] !border-forest text-phosphor">Verified</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Original message recovered bit-for-bit with cryptographic integrity.
            </p>
          </div>
        </div>
      </div>

      <DecryptForm />
    </div>
  );
};
