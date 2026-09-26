import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileCheck, Unlock, Loader2, Download, UploadCloud, RotateCcw, Layers, KeyRound, Eye, EyeOff, AlertTriangle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal">
        <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
          <FileCheck className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-snow">Decrypt File</h1>
          <p className="text-xs font-mono text-smoke mt-0.5">
            Restore original file binary from .enc using authenticated ciphertext
          </p>
        </div>
      </div>

      {/* 4-Step Pipeline Indicator */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 space-y-4 transition-all duration-150 hover:border-graphite">
        <div className="flex items-center space-x-2 text-smoke font-mono text-xs uppercase tracking-terminal">
          <Layers className="w-4 h-4 text-phosphor" />
          <span>// File Decryption & Verification Pipeline (4 Steps)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">01. Load .enc</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 1</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Upload <code>.enc</code> file & supply Salt, Nonce, Tag (or JSON).
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">02. Key Recon</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 2</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              scrypt reconstructs identical 256-bit symmetric key with Salt.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">03. Tag Check</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 3</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              AEAD verifies 128-bit MAC tag. Aborts if file was altered.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-forest rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">04. Recovery</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px] !border-forest text-phosphor">Verified</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Original file binary restored with complete integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleDecrypt} className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-normal text-silver uppercase tracking-terminal">
              Upload Encrypted Binary (.enc)
            </label>
            {(file || password || salt || downloadInfo) && (
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
          <FileUpload onFileSelect={setFile} selectedFile={file} maxSizeMB={10} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-charcoal">
          <span className="text-xs font-normal text-silver uppercase tracking-terminal">
            Cryptographic Parameters
          </span>
          <label className="btn-pill-ghost !py-1 !px-3 !text-xs cursor-pointer">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Load JSON</span>
            <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
          </label>
        </div>

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
            disabled={loading || !file}
            className="btn-pill-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : 'Decrypt & Restore File'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {downloadInfo && (
        <div className="bg-ash border border-charcoal rounded-base p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up transition-all duration-150 hover:border-graphite">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-phosphor animate-pulse-phosphor" />
            <div>
              <h3 className="text-lg font-medium text-snow tracking-tight">Decryption Successful</h3>
              <p className="text-xs font-mono text-smoke mt-0.5">Auth tag verified. Payload fully restored.</p>
            </div>
          </div>
          <a
            href={downloadInfo.url}
            download={downloadInfo.filename}
            className="btn-pill-primary self-start sm:self-auto !text-xs !py-1.5 !px-3"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {downloadInfo.filename}</span>
          </a>
        </div>
      )}
    </div>
  );
};
