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
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid') => setEncryptTextState((prev) => ({ ...prev, algorithm: val }));
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
    if (algorithm !== 'hybrid' && !password) {
      setError('Please enter a passphrase.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (algorithm === 'hybrid') {
        const res = await api.encryptHybridText(plaintext);
        setResult(res);

        addHistoryItem({
          type: 'text-encrypt',
          algorithm: 'hybrid',
          title: `Encrypted (Hybrid) "${plaintext.length > 25 ? plaintext.slice(0, 25) + '...' : plaintext}"`,
          details: {
            plaintext,
            ciphertext: res.ciphertext,
            nonce: res.nonce,
            tag: res.tag,
          },
        });
      } else {
        const res = await api.encryptText({
          plaintext,
          password,
          algorithm,
        });
        setResult(res);

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
      }
    } catch (err: any) {
      setError(err.message || 'Failed to encrypt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Container (Carbon Panel #161616, border 1px Graphite Lift #252525, 2px radius, max-width 600px centered) */}
      <form onSubmit={handleSubmit} className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-8 space-y-5 w-full shadow-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // PLAINTEXT CONTENT
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
            placeholder="Type or paste the secret plaintext message here..."
            className="input-protocol font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider mb-2">
              // PASSPHRASE {algorithm === 'hybrid' && <span className="text-smoke font-normal">(AUTO RSA)</span>}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-smoke absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={algorithm === 'hybrid'}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={algorithm === 'hybrid' ? 'Not required for Hybrid RSA' : 'Enter encryption password'}
                className="input-protocol pl-9 pr-10 disabled:bg-midnight-void disabled:text-smoke disabled:border-graphite"
              />
              {algorithm !== 'hybrid' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="min-h-[44px] min-w-[44px] absolute right-1 top-0 text-smoke hover:text-pure-signal transition cursor-pointer flex items-center justify-center"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider mb-2">
              // ENCRYPTION MODE
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="input-protocol bg-carbon-panel text-pure-signal cursor-pointer"
            >
              <option value="aes-256-gcm">AES-256-GCM (Hardware Accelerated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Modern Stream)</option>
              <option value="hybrid">Hybrid: AES-256-GCM + RSA-OAEP</option>
            </select>
          </div>
        </div>

        {algorithm === 'hybrid' && (
          <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm text-xs font-mono space-y-1">
            <div className="font-bold text-pure-signal tracking-wide">// MODE: HYBRID ENCRYPTION</div>
            <div className="text-soft-mist/80"><span className="text-warm-filament">Data Cipher:</span> AES-256-GCM (Session Key)</div>
            <div className="text-soft-mist/80"><span className="text-warm-filament">Key Protection:</span> RSA-OAEP 2048-bit (SHA-256)</div>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-orchid-whisper/10 border border-orchid-whisper text-orchid-whisper rounded-sm text-xs font-mono flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'EXECUTING ENCRYPTION...' : 'ENCRYPT MESSAGE'}</span>
          </button>
        </div>
      </form>

      {result && <ResultDisplay title="Encryption Output" result={result} />}
    </div>
  );
};
