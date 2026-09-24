import React, { useState } from 'react';
import { api, EncryptResponse } from '../services/api';
import { Lock, Loader2, KeyRound } from 'lucide-react';
import { ResultDisplay } from './ResultDisplay';

export const EncryptForm: React.FC = () => {
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<'aes-256-gcm' | 'chacha20-poly1305'>('aes-256-gcm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EncryptResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plaintext.trim()) {
      setError('Please enter plaintext to encrypt.');
      return;
    }
    if (!password) {
      setError('Please enter a passphrase.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await api.encryptText({
        plaintext,
        password,
        algorithm,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to encrypt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Plaintext Content
          </label>
          <textarea
            rows={4}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Type or paste the secret message here..."
            className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Passphrase (Key Derivation via scrypt)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong encryption password"
                className="w-full pl-9 text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Cipher Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aes-256-gcm">AES-256-GCM (Hardware Accelerated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Modern Stream Cipher)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>{loading ? 'Encrypting with scrypt...' : 'Encrypt Text'}</span>
        </button>
      </form>

      {result && <ResultDisplay title="Encryption Output" result={result} />}
    </div>
  );
};
