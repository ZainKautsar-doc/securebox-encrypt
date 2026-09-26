import React, { useState } from 'react';
import { api } from '../services/api';
import { Unlock, Loader2, KeyRound, UploadCloud, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { ResultDisplay } from './ResultDisplay';
import { useSecureBox } from '../context/SecureBoxContext';

export const DecryptForm: React.FC = () => {
  const { decryptTextState, setDecryptTextState, addHistoryItem } = useSecureBox();
  const { ciphertext, password, algorithm, salt, encrypted_session_key, nonce, tag, plaintext } = decryptTextState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const setCiphertext = (val: string) => setDecryptTextState((prev) => ({ ...prev, ciphertext: val }));
  const setPassword = (val: string) => setDecryptTextState((prev) => ({ ...prev, password: val }));
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid') => setDecryptTextState((prev) => ({ ...prev, algorithm: val }));
  const setSalt = (val: string) => setDecryptTextState((prev) => ({ ...prev, salt: val }));
  const setEncryptedSessionKey = (val: string) => setDecryptTextState((prev) => ({ ...prev, encrypted_session_key: val }));
  const setNonce = (val: string) => setDecryptTextState((prev) => ({ ...prev, nonce: val }));
  const setTag = (val: string) => setDecryptTextState((prev) => ({ ...prev, tag: val }));
  const setPlaintext = (val: string | null) => setDecryptTextState((prev) => ({ ...prev, plaintext: val }));

  const handleReset = () => {
    setDecryptTextState({
      ciphertext: '',
      password: '',
      algorithm: 'aes-256-gcm',
      salt: '',
      encrypted_session_key: '',
      nonce: '',
      tag: '',
      plaintext: null,
    });
    setError(null);
  };

  // Auto-parse JSON if pasted or loaded
  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.ciphertext) setCiphertext(json.ciphertext);
        if (json.salt) setSalt(json.salt);
        if (json.encrypted_session_key) setEncryptedSessionKey(json.encrypted_session_key);
        if (json.nonce) setNonce(json.nonce);
        if (json.tag) setTag(json.tag);
        if (json.auth_tag) setTag(json.auth_tag);
        if (json.key_algorithm === 'rsa-oaep-sha256' || json.encrypted_session_key) {
          setAlgorithm('hybrid');
        } else if (json.algorithm) {
          setAlgorithm(json.algorithm);
        }
        setError(null);
      } catch {
        setError('Invalid JSON payload file.');
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
    if (algorithm !== 'hybrid' && !password) {
      setError('Password is required.');
      return;
    }
    if (algorithm === 'hybrid') {
      if (!encrypted_session_key.trim() || !nonce.trim() || !tag.trim()) {
        setError('Encrypted Session Key, Nonce, and Auth Tag are required for Hybrid Decryption.');
        return;
      }
    } else if (!salt.trim() || !nonce.trim() || !tag.trim()) {
      setError('Salt, Nonce, and Auth Tag metadata are required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (algorithm === 'hybrid') {
        const res = await api.decryptHybridText({
          encrypted_session_key: encrypted_session_key.trim(),
          nonce: nonce.trim(),
          auth_tag: tag.trim(),
          ciphertext: ciphertext.trim(),
        });
        setPlaintext(res.plaintext);

        addHistoryItem({
          type: 'text-decrypt',
          algorithm: 'hybrid',
          title: `Decrypted message (${res.plaintext.length} chars)`,
          details: {
            plaintext: res.plaintext,
            ciphertext: ciphertext.trim(),
            nonce: nonce.trim(),
            tag: tag.trim(),
            success: true,
          },
        });
      } else {
        const res = await api.decryptText({
          ciphertext: ciphertext.trim(),
          password,
          algorithm,
          salt: salt.trim(),
          nonce: nonce.trim(),
          tag: tag.trim(),
        });
        setPlaintext(res.plaintext);

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
      }
    } catch (err: any) {
      setError(err.message || 'Decryption failed. Please check parameters or RSA private key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Ciphertext (Base64)
          </label>
          <div className="flex items-center space-x-3">
            {(ciphertext || password || salt || encrypted_session_key || plaintext) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Form</span>
              </button>
            )}
            <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Load Metadata JSON</span>
              <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
            </label>
          </div>
        </div>

        <textarea
          rows={3}
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          placeholder="Paste Base64 encoded ciphertext here..."
          className="w-full text-sm font-mono border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Passphrase {algorithm === 'hybrid' && <span className="text-slate-400 font-normal">(Auto RSA Private Key)</span>}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={algorithm === 'hybrid'}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={algorithm === 'hybrid' ? 'Decrypted using backend RSA Private Key' : 'Enter decryption password'}
                className="w-full pl-9 pr-10 text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
              {algorithm !== 'hybrid' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Encryption Mode
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aes-256-gcm">AES-256-GCM</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
              <option value="hybrid">Hybrid: AES-256-GCM + RSA-OAEP</option>
            </select>
          </div>
        </div>

        {algorithm === 'hybrid' ? (
          <div className="space-y-3">
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-lg text-xs space-y-1">
              <div className="font-bold text-indigo-900 tracking-wide">Mode: HYBRID</div>
              <div className="text-indigo-800"><span className="font-semibold">Data Cipher:</span> AES-256-GCM</div>
              <div className="text-indigo-800"><span className="font-semibold">Key Protection:</span> RSA-OAEP</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">Encrypted Session Key (Base64)</label>
                <input
                  type="text"
                  value={encrypted_session_key}
                  onChange={(e) => setEncryptedSessionKey(e.target.value)}
                  placeholder="Paste RSA-encrypted AES session key..."
                  className="w-full text-xs font-mono border border-slate-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nonce (Base64)</label>
                <input
                  type="text"
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  placeholder="e.g. 7kLm...=="
                  className="w-full text-xs font-mono border border-slate-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Auth Tag (Base64)</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Qx9z...=="
                  className="w-full text-xs font-mono border border-slate-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Salt (Base64)</label>
              <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="e.g. jH4s...=="
                className="w-full text-xs font-mono border border-slate-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nonce (Base64)</label>
              <input
                type="text"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                placeholder="e.g. 7kLm...=="
                className="w-full text-xs font-mono border border-slate-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Auth Tag (Base64)</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Qx9z...=="
                className="w-full text-xs font-mono border border-slate-300 rounded-md p-2"
              />
            </div>
          </div>
        )}

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
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
          <span>{loading ? 'Authenticating & Decrypting...' : 'Decrypt Text'}</span>
        </button>
      </form>

      {plaintext !== null && <ResultDisplay title="Decryption Output" result={null} plaintext={plaintext} />}
    </div>
  );
};
