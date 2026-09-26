import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileCheck, Unlock, Loader2, Download, UploadCloud, RotateCcw, Layers, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const FileDecrypt: React.FC = () => {
  const { fileDecryptState, setFileDecryptState, addHistoryItem } = useSecureBox();
  const { password, algorithm, salt, encrypted_session_key, nonce, tag } = fileDecryptState;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const setPassword = (val: string) => setFileDecryptState((prev) => ({ ...prev, password: val }));
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid') => setFileDecryptState((prev) => ({ ...prev, algorithm: val }));
  const setSalt = (val: string) => setFileDecryptState((prev) => ({ ...prev, salt: val }));
  const setEncryptedSessionKey = (val: string) => setFileDecryptState((prev) => ({ ...prev, encrypted_session_key: val }));
  const setNonce = (val: string) => setFileDecryptState((prev) => ({ ...prev, nonce: val }));
  const setTag = (val: string) => setFileDecryptState((prev) => ({ ...prev, tag: val }));

  const handleReset = () => {
    setFile(null);
    setFileDecryptState({
      password: '',
      algorithm: 'aes-256-gcm',
      salt: '',
      encrypted_session_key: '',
      nonce: '',
      tag: '',
    });
    setDownloadInfo(null);
    setError(null);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const jsonFile = e.target.files?.[0];
    if (!jsonFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
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
        setError('Invalid metadata JSON file.');
      }
    };
    reader.readAsText(jsonFile);
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an encrypted file to decrypt.');
      return;
    }
    if (algorithm !== 'hybrid' && !password) {
      setError('Password is required.');
      return;
    }
    if (algorithm === 'hybrid') {
      if (!encrypted_session_key.trim() || !nonce.trim() || !tag.trim()) {
        setError('Encrypted Session Key, Nonce, and Auth Tag metadata are required to decrypt.');
        return;
      }
    } else if (!salt.trim() || !nonce.trim() || !tag.trim()) {
      setError('Salt, Nonce, and Auth Tag metadata are required to decrypt.');
      return;
    }

    setError(null);
    setLoading(true);
    setDownloadInfo(null);

    try {
      const res = await api.decryptFile(
        file,
        password,
        algorithm,
        salt.trim(),
        nonce.trim(),
        tag.trim(),
        encrypted_session_key.trim()
      );
      const url = window.URL.createObjectURL(res.blob);
      setDownloadInfo({
        url,
        filename: res.filename,
      });

      // Log to persistent History
      addHistoryItem({
        type: 'file-decrypt',
        algorithm,
        title: `Decrypted file "${res.filename}"`,
        details: {
          filename: res.filename,
          salt: salt.trim(),
          nonce: nonce.trim(),
          tag: tag.trim(),
          success: true,
        },
      });
    } catch (err: any) {
      setError(err.message || 'File decryption failed. Authentication or key mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Decrypt File</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            AUTHENTICATED BINARY DECRYPTION (.ENC) WITH RECONSTRUCTED KEY & METADATA CHECK
          </p>
        </div>
      </div>

      {/* Step-by-Step Decryption Flow */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-electric-indigo" />
          <span>// FILE DECRYPTION PIPELINE (4 STEPS)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">01. LOAD FILE</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 1</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Upload <code>.enc</code> payload & load metadata JSON or enter params.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">02. KEY RECON</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 2</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              scrypt or RSA-OAEP derives 256-bit symmetric session key.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">03. TAG CHECK</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 3</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              AEAD verifies 128-bit MAC tag. Rejects if tampered/wrong password.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-lime-beacon/50 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lime-beacon text-sm">04. RECOVER</span>
              <span className="text-[10px] font-mono text-lime-beacon">VERIFIED</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Original file binary recovered bit-for-bit and ready to download.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleDecrypt} className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-8 space-y-5 max-w-[600px] mx-auto shadow-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // ENCRYPTED FILE PAYLOAD (.ENC)
            </label>
            {(file || password || salt || encrypted_session_key || downloadInfo) && (
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
          <FileUpload onFileSelect={setFile} selectedFile={file} maxSizeMB={10} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-graphite-lift">
          <span className="text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
            // DECRYPTION PARAMETERS
          </span>
          <label className="btn-secondary !py-1.5 !px-3 cursor-pointer min-h-[36px]">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>LOAD METADATA JSON</span>
            <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
          </label>
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
                placeholder={algorithm === 'hybrid' ? 'Decrypted using backend RSA Private Key' : 'Enter original password'}
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
              <option value="aes-256-gcm">AES-256-GCM</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
              <option value="hybrid">Hybrid: AES-256-GCM + RSA-OAEP</option>
            </select>
          </div>
        </div>

        {algorithm === 'hybrid' ? (
          <div className="space-y-3">
            <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm text-xs font-mono space-y-1">
              <div className="font-bold text-pure-signal tracking-wide">// MODE: HYBRID DECRYPTION</div>
              <div className="text-soft-mist/80"><span className="text-warm-filament">Data Cipher:</span> AES-256-GCM</div>
              <div className="text-soft-mist/80"><span className="text-warm-filament">Key Protection:</span> RSA-OAEP 2048-bit</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="block text-xs font-mono text-soft-mist/70 mb-1 uppercase">// ENCRYPTED SESSION KEY (BASE64)</label>
                <input
                  type="text"
                  value={encrypted_session_key}
                  onChange={(e) => setEncryptedSessionKey(e.target.value)}
                  placeholder="Paste RSA-encrypted AES session key..."
                  className="input-protocol-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-soft-mist/70 mb-1 uppercase">// NONCE (BASE64)</label>
                <input
                  type="text"
                  value={nonce}
                  onChange={(e) => setNonce(e.target.value)}
                  placeholder="e.g. 7kLm...=="
                  className="input-protocol-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-soft-mist/70 mb-1 uppercase">// AUTH TAG (BASE64)</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Qx9z...=="
                  className="input-protocol-mono"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-soft-mist/70 mb-1 uppercase">// SALT (BASE64)</label>
              <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="e.g. jH4s...=="
                className="input-protocol-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-soft-mist/70 mb-1 uppercase">// NONCE (BASE64)</label>
              <input
                type="text"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                placeholder="e.g. 7kLm...=="
                className="input-protocol-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-soft-mist/70 mb-1 uppercase">// AUTH TAG (BASE64)</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Qx9z...=="
                className="input-protocol-mono"
              />
            </div>
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
            disabled={loading || !file}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            <span>{loading ? 'AUTHENTICATING & DECRYPTING...' : 'DECRYPT FILE'}</span>
          </button>
        </div>
      </form>

      {downloadInfo && (
        <div className="bg-carbon-panel border border-lime-beacon/40 rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-[600px] mx-auto">
          <div>
            <h3 className="text-base font-bold text-pure-signal tracking-tight font-sans">
              Decryption Successful!
            </h3>
            <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
              INTEGRITY CHECK PASSED // AUTH TAG MATCHED (128-BIT)
            </p>
          </div>
          <a
            href={downloadInfo.url}
            download={downloadInfo.filename}
            className="btn-primary text-xs self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD {downloadInfo.filename}</span>
          </a>
        </div>
      )}
    </div>
  );
};
