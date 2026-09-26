import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, Loader2, KeyRound, RotateCcw, Eye, EyeOff, AlertTriangle } from 'lucide-react';
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
      setError('Plaintext content is required to generate ciphertext.');
      return;
    }
    if (!password) {
      setError('Passphrase is required for scrypt key derivation.');
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
      setError(err.message || 'Encryption protocol failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Form Container (Obsidian bg, Charcoal border, 16px radius, 32px padding) */}
      <form onSubmit={handleSubmit} className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-normal text-silver uppercase tracking-terminal">
              Plaintext Secret Message
            </label>
            {(plaintext || password || result) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-smoke hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
          <textarea
            rows={4}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Type or paste plaintext message to encrypt..."
            className="input-supabase font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-normal text-silver uppercase tracking-terminal mb-2">
              Passphrase (scrypt KDF)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-smoke absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret passphrase"
                className="input-supabase pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-smoke hover:text-snow transition cursor-pointer"
                title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-normal text-silver uppercase tracking-terminal mb-2">
              AEAD Cipher
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="input-supabase bg-obsidian text-snow cursor-pointer"
            >
              <option value="aes-256-gcm">AES-256-GCM (Hardware Accelerated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Modern Stream Cipher)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-smoke/[0.08] border border-smoke/30 text-smoke rounded-sm text-xs font-mono flex items-center space-x-2 animate-fade-in-down">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-pill-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'Deriving Key...' : 'Encrypt Data'}</span>
          </button>
        </div>
      </form>

      {result && <ResultDisplay title="Encryption Result" result={result} />}
    </div>
  );
};
