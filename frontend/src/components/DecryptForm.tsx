import React, { useState } from 'react';
import { api } from '../services/api';
import { Unlock, Loader2, KeyRound, UploadCloud, RotateCcw, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { ResultDisplay } from './ResultDisplay';
import { useSecureBox } from '../context/SecureBoxContext';

export const DecryptForm: React.FC = () => {
  const { decryptTextState, setDecryptTextState, addHistoryItem } = useSecureBox();
  const { ciphertext, password, algorithm, salt, nonce, tag, plaintext } = decryptTextState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const setCiphertext = (val: string) => setDecryptTextState((prev) => ({ ...prev, ciphertext: val }));
  const setPassword = (val: string) => setDecryptTextState((prev) => ({ ...prev, password: val }));
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305') => setDecryptTextState((prev) => ({ ...prev, algorithm: val }));
  const setSalt = (val: string) => setDecryptTextState((prev) => ({ ...prev, salt: val }));
  const setNonce = (val: string) => setDecryptTextState((prev) => ({ ...prev, nonce: val }));
  const setTag = (val: string) => setDecryptTextState((prev) => ({ ...prev, tag: val }));
  const setPlaintext = (val: string | null) => setDecryptTextState((prev) => ({ ...prev, plaintext: val }));

  const handleReset = () => {
    setDecryptTextState({
      ciphertext: '',
      password: '',
      algorithm: 'aes-256-gcm',
      salt: '',
      nonce: '',
      tag: '',
      plaintext: null,
    });
    setError(null);
  };

  // Auto-parse JSON if uploaded
  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.ciphertext) setCiphertext(json.ciphertext);
        if (json.salt) setSalt(json.salt);
        if (json.nonce) setNonce(json.nonce);
        if (json.tag) setTag(json.tag);
        if (json.algorithm) setAlgorithm(json.algorithm);
        setError(null);
      } catch {
        setError('Invalid JSON payload structure. Required: ciphertext, salt, nonce, tag.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciphertext.trim()) {
      setError('Ciphertext is required.');
      return;
    }
    if (!password) {
      setError('Passphrase is required.');
      return;
    }
    if (!salt.trim() || !nonce.trim() || !tag.trim()) {
      setError('Salt, Nonce, and Auth Tag cryptographic parameters are required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.decryptText({
        ciphertext: ciphertext.trim(),
        password,
        algorithm,
        salt: salt.trim(),
        nonce: nonce.trim(),
        tag: tag.trim(),
      });
      setPlaintext(res.plaintext);

      // Log to persistent History
      addHistoryItem({
        type: 'text-decrypt',
        algorithm,
        title: `Decrypted message (${res.plaintext.length} chars)`,
        details: {
          plaintext: res.plaintext,
          ciphertext: ciphertext.trim(),
          salt: salt.trim(),
          nonce: nonce.trim(),
          tag: tag.trim(),
          success: true,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Incorrect password or modified ciphertext.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
            // CIPHERTEXT (BASE64)
          </label>
          <div className="flex items-center space-x-3">
            {(ciphertext || password || salt || plaintext) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-soft-mist/60 hover:text-orchid-whisper flex items-center space-x-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            )}
            <label className="btn-secondary !py-1.5 !px-3 cursor-pointer">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>LOAD JSON PAYLOAD</span>
              <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
            </label>
          </div>
        </div>

        <textarea
          rows={3}
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder="Paste Base64 encoded ciphertext string here..."
          className="input-protocol font-mono text-xs"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider mb-2">
              // PASSPHRASE
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-soft-mist/50 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter original decryption passphrase"
                className="input-protocol pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-soft-mist/50 hover:text-pure-signal transition cursor-pointer"
                title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider mb-2">
              // CIPHER ALGORITHM
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="input-protocol bg-carbon-panel text-pure-signal cursor-pointer"
            >
              <option value="aes-256-gcm">AES-256-GCM</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono text-soft-mist/70 mb-1.5 uppercase">// SALT (BASE64)</label>
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              placeholder="e.g. jH4s...=="
              className="input-protocol-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-soft-mist/70 mb-1.5 uppercase">// NONCE (BASE64)</label>
            <input
              type="text"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="e.g. 7kLm...=="
              className="input-protocol-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-soft-mist/70 mb-1.5 uppercase">// AUTH TAG (BASE64)</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Qx9z...=="
              className="input-protocol-mono"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-orchid-whisper/10 border border-orchid-whisper text-orchid-whisper rounded-sm text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            <span>{loading ? 'AUTHENTICATING & DECRYPTING...' : 'DECRYPT MESSAGE'}</span>
          </button>
        </div>
      </form>

      {plaintext !== null && <ResultDisplay title="Decryption Output" result={null} plaintext={plaintext} />}
    </div>
  );
};
