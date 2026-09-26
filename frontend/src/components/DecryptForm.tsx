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
      setError(err.message || 'Authentication failed. Incorrect passphrase or modified ciphertext.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-normal text-silver uppercase tracking-terminal">
            Ciphertext (Base64)
          </label>
          <div className="flex items-center space-x-3">
            {(ciphertext || password || salt || plaintext) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-smoke hover:text-snow flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <label className="btn-pill-ghost !py-1 !px-3 !text-xs cursor-pointer">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Load JSON</span>
              <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
            </label>
          </div>
        </div>

        <textarea
          rows={3}
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder="Paste Base64 encoded ciphertext string here..."
          className="input-supabase font-mono text-xs"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-normal text-silver uppercase tracking-terminal mb-2">
              Passphrase
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-smoke absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter original decryption passphrase"
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
              Cipher Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="input-supabase bg-obsidian text-snow cursor-pointer"
            >
              <option value="aes-256-gcm">AES-256-GCM</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono text-smoke mb-1.5 uppercase tracking-terminal">Salt (Base64)</label>
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              placeholder="e.g. jH4s...=="
              className="input-supabase-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-smoke mb-1.5 uppercase tracking-terminal">Nonce (Base64)</label>
            <input
              type="text"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
              placeholder="e.g. 7kLm...=="
              className="input-supabase-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-smoke mb-1.5 uppercase tracking-terminal">Auth Tag (Base64)</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Qx9z...=="
              className="input-supabase-mono"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-smoke/[0.08] border border-smoke/30 text-smoke rounded-sm text-xs font-mono flex items-center space-x-2 animate-fade-in-down">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-pill-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : 'Decrypt Data'}</span>
          </button>
        </div>
      </form>

      {plaintext !== null && <ResultDisplay title="Decryption Result" result={null} plaintext={plaintext} />}
    </div>
  );
};
