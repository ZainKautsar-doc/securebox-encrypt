import React from 'react';
import { DecryptForm } from '../components/DecryptForm';
import { Unlock } from 'lucide-react';

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

      <DecryptForm />
    </div>
  );
};
