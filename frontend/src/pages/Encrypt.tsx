import React from 'react';
import { EncryptForm } from '../components/EncryptForm';
import { Lock } from 'lucide-react';

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

      <EncryptForm />
    </div>
  );
};
