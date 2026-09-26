import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, Loader2, KeyRound, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { ResultDisplay } from './ResultDisplay';
import { useSecureBox } from '../context/SecureBoxContext';

export const EncryptForm: React.FC = () => {
  const { encryptTextState, setEncryptTextState, addHistoryItem } = useSecureBox();
  const { plaintext, password, algorithm, result } = encryptTextState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const setPlaintext = (val: string) => setEncryptTextState((prev) => ({ ...prev, plaintext: val }));
  const setPassword = (val: string) => setEncryptTextState((prev) => ({ ...prev, password: val }));
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305') => setEncryptTextState((prev) => ({ ...prev, algorithm: val }));
  const setResult = (res: any) => setEncryptTextState((prev) => ({ ...prev, result: res }));

  const handleReset = () => {
    setEncryptTextState({
      plaintext: '',
      password: '',
      algorithm: 'aes-256-gcm',
      result: null,
    });
    setError(null);
  };

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

    try {
      const res = await api.encryptText({
        plaintext,
        password,
        algorithm,
      });
      setResult(res);

      // Log to persistent History
      addHistoryItem({
        type: 'text-encrypt',
        algorithm: res.algorithm,
        title: `Encrypted "${plaintext.length > 25 ? plaintext.slice(0, 25) + '...' : plaintext}"`,
        details: {
          plaintext,
          ciphertext: res.ciphertext,
          salt: res.salt,
          nonce: res.nonce,
          tag: res.tag,
          kdf: res.kdf,
        },
      });
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Plaintext Content
            </label>
            {(plaintext || password || result) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Form</span>
              </button>
            )}
          </div>
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong encryption password"
                className="w-full pl-9 pr-10 text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
