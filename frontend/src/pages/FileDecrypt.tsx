import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileCheck, Unlock, Loader2, Download, UploadCloud, RotateCcw, Layers, KeyRound, Eye, EyeOff, AlertTriangle, Check } from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const FileDecrypt: React.FC = () => {
  const { fileDecryptState, setFileDecryptState, addHistoryItem } = useSecureBox();
  const { password, algorithm, salt, nonce, tag } = fileDecryptState;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const setPassword = (val: string) => setFileDecryptState((prev) => ({ ...prev, password: val }));
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305') => setFileDecryptState((prev) => ({ ...prev, algorithm: val }));
  const setSalt = (val: string) => setFileDecryptState((prev) => ({ ...prev, salt: val }));
  const setNonce = (val: string) => setFileDecryptState((prev) => ({ ...prev, nonce: val }));
  const setTag = (val: string) => setFileDecryptState((prev) => ({ ...prev, tag: val }));

  const handleReset = () => {
    setFile(null);
    setFileDecryptState({
      password: '',
      algorithm: 'aes-256-gcm',
      salt: '',
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
        if (json.nonce) setNonce(json.nonce);
        if (json.tag) setTag(json.tag);
        if (json.algorithm) setAlgorithm(json.algorithm);
        setError(null);
      } catch {
        setError('Invalid metadata JSON payload.');
      }
    };
    reader.readAsText(jsonFile);
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an encrypted binary (.enc) file.');
      return;
    }
    if (!password) {
      setError('Passphrase is required.');
      return;
    }
    if (!salt.trim() || !nonce.trim() || !tag.trim()) {
      setError('Salt, Nonce, and Auth Tag parameters are required.');
      return;
    }

    setError(null);
    setLoading(true);
    setDownloadInfo(null);

    try {
      const res = await api.decryptFile(file, password, algorithm, salt.trim(), nonce.trim(), tag.trim());
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
      setError(err.message || 'Decryption rejected. Authentication tag mismatch or incorrect passphrase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Decrypt File</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            RESTORE ORIGINAL FILE BINARY FROM .ENC USING CIPHERTEXT AUTHENTICATION
          </p>
        </div>
      </div>

      {/* 4-Step Pipeline Indicator */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-lime-beacon" />
          <span>// FILE DECRYPTION & INTEGRITY VERIFICATION (4 STEPS)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">01. LOAD .ENC</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 1</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Upload <code>.enc</code> file & supply Salt, Nonce, Tag (or JSON).
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">02. KEY RECON</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 2</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              scrypt reconstructs identical 256-bit symmetric key with Salt.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">03. TAG CHECK</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 3</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              AEAD verifies 128-bit MAC tag. Aborts if file was altered.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-lime-beacon/50 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lime-beacon text-sm">04. RECOVERY</span>
              <span className="text-[10px] font-mono text-lime-beacon">VERIFIED</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Original file binary restored with complete integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleDecrypt} className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // UPLOAD ENCRYPTED BINARY (.ENC)
            </label>
            {(file || password || salt || downloadInfo) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-soft-mist/60 hover:text-orchid-whisper flex items-center space-x-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            )}
          </div>
          <FileUpload onFileSelect={setFile} selectedFile={file} maxSizeMB={10} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-graphite-lift">
          <span className="text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
            // CRYPTOGRAPHIC PARAMETERS
          </span>
          <label className="btn-secondary !py-1.5 !px-3 cursor-pointer">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>LOAD METADATA JSON</span>
            <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
          </label>
        </div>

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
            disabled={loading || !file}
            className="btn-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            <span>{loading ? 'AUTHENTICATING & DECRYPTING...' : 'DECRYPT & RESTORE FILE'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {downloadInfo && (
        <div className="bg-carbon-panel border border-lime-beacon/40 rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-beacon/20 text-lime-beacon rounded-sm flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pure-signal tracking-tight">Decryption Successful</h3>
              <p className="text-xs font-mono text-soft-mist/60 mt-0.5">AUTH TAG MATCHED. PAYLOAD FULLY RESTORED.</p>
            </div>
          </div>
          <a
            href={downloadInfo.url}
            download={downloadInfo.filename}
            className="btn-primary self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD {downloadInfo.filename}</span>
          </a>
        </div>
      )}
    </div>
  );
};
