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
    <div className="space-y-6">
      {/* Form Container (Carbon Panel, 20px mobile / 24px tablet / 32px desktop padding, 2px radius, 1px border) */}
      <form onSubmit={handleSubmit} className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // PLAINTEXT SECRET MESSAGE
            </label>
            {(plaintext || password || result) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-soft-mist/60 hover:text-orchid-whisper flex items-center space-x-1 cursor-pointer transition min-h-[36px] px-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            )}
          </div>
          <textarea
            rows={4}
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Type or paste plaintext message to encrypt..."
            className="input-protocol font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // PASSPHRASE (SCRYPT KDF)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-soft-mist/50 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret passphrase"
                className="input-protocol pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="min-h-[44px] min-w-[44px] absolute right-1 top-0 text-soft-mist/50 hover:text-pure-signal transition cursor-pointer flex items-center justify-center"
                title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // AEAD CIPHER
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="input-protocol bg-carbon-panel text-pure-signal cursor-pointer"
            >
              <option value="aes-256-gcm">AES-256-GCM (Hardware Accelerated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Modern Stream Cipher)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-orchid-whisper/10 border border-orchid-whisper text-orchid-whisper rounded-sm text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'EXECUTING SCRYPT...' : 'ENCRYPT MESSAGE'}</span>
          </button>
        </div>
      </form>

      {result && <ResultDisplay title="Encryption Output" result={result} />}
    </div>
  );
};
