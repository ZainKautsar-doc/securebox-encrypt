import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileText, Lock, Loader2, Download, Copy, Check, KeyRound, RotateCcw, FileJson, Layers, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const FileEncrypt: React.FC = () => {
  const { fileEncryptState, setFileEncryptState, addHistoryItem } = useSecureBox();
  const { password, algorithm, downloadInfo } = fileEncryptState;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const setPassword = (val: string) => setFileEncryptState((prev) => ({ ...prev, password: val }));
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305') => setFileEncryptState((prev) => ({ ...prev, algorithm: val }));
  const setDownloadInfo = (info: any) => setFileEncryptState((prev) => ({ ...prev, downloadInfo: info }));

  const handleReset = () => {
    setFile(null);
    setFileEncryptState({
      password: '',
      algorithm: 'aes-256-gcm',
      downloadInfo: null,
    });
    setError(null);
  };

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a target file to encrypt.');
      return;
    }
    if (!password) {
      setError('Passphrase is required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.encryptFile(file, password, algorithm);
      const url = window.URL.createObjectURL(res.blob);
      const info = {
        url,
        filename: res.filename,
        metadata: res.metadata,
      };
      setDownloadInfo(info);

      // Log to persistent History
      addHistoryItem({
        type: 'file-encrypt',
        algorithm: res.metadata.algorithm,
        title: `Encrypted file "${res.metadata.filename}"`,
        details: {
          filename: res.metadata.filename,
          fileSize: res.metadata.file_size,
          salt: res.metadata.salt,
          nonce: res.metadata.nonce,
          tag: res.metadata.tag,
          kdf: res.metadata.kdf,
        },
      });
    } catch (err: any) {
      setError(err.message || 'File encryption pipeline failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyMetadataJson = () => {
    if (!downloadInfo) return;
    navigator.clipboard.writeText(JSON.stringify(downloadInfo.metadata, null, 2));
    setCopiedKey('meta');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadMetadataJsonFile = () => {
    if (!downloadInfo) return;
    const metadataStr = JSON.stringify(downloadInfo.metadata, null, 2);
    const blob = new Blob([metadataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${downloadInfo.metadata.filename || 'file'}-metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-charcoal">
        <div className="w-10 h-10 bg-ash border border-charcoal text-phosphor rounded-base flex items-center justify-center">
          <FileText className="w-5 h-5 stroke-[1.75]" />
        </div>
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-snow">Encrypt File</h1>
          <p className="text-xs font-mono text-smoke mt-0.5">
            Authenticated binary encryption (up to 10 MB payload) with metadata packaging
          </p>
        </div>
      </div>

      {/* 4-Step Pipeline Indicator */}
      <div className="bg-obsidian border border-charcoal rounded-base p-6 space-y-4 transition-all duration-150 hover:border-graphite">
        <div className="flex items-center space-x-2 text-smoke font-mono text-xs uppercase tracking-terminal">
          <Layers className="w-4 h-4 text-phosphor" />
          <span>// File Encryption Pipeline (4 Steps)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">01. Select File</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 1</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Upload file (&lt;10 MB), enter passphrase & pick AEAD cipher.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">02. scrypt KDF</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 2</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              16B random salt generated. 256-bit key derived in memory.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-charcoal rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">03. AEAD Stream</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px]">Step 3</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              12B nonce generated. File encrypted + 16B Auth Tag produced.
            </p>
          </div>

          <div className="p-4 bg-ash/50 border border-forest rounded-base space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-phosphor text-sm">04. Download</span>
              <span className="pill-status !py-0 !px-1.5 !text-[10px] !border-forest text-phosphor">Ready</span>
            </div>
            <p className="text-silver text-xs leading-relaxed font-normal">
              Download encrypted <code>.enc</code> file & metadata JSON.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleEncrypt} className="bg-obsidian border border-charcoal rounded-base p-6 sm:p-8 space-y-6 transition-all duration-150 hover:border-graphite">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-normal text-silver uppercase tracking-terminal">
              Target File Payload (Max 10 MB)
            </label>
            {(file || password || downloadInfo) && (
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
                placeholder="Enter file encryption passphrase"
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
              <option value="aes-256-gcm">AES-256-GCM (Authenticated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Authenticated)</option>
            </select>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'Encrypting Payload...' : 'Encrypt & Generate .enc'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {downloadInfo && (
        <div className="bg-ash border border-charcoal rounded-base p-6 space-y-6 animate-fade-in-up transition-all duration-150 hover:border-graphite">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-phosphor animate-pulse-phosphor" />
              <div>
                <h3 className="text-lg font-medium text-snow tracking-tight">
                  File Encrypted Successfully
                </h3>
                <p className="text-xs font-mono text-smoke mt-0.5">
                  AUTHENTICATED CIPHERTEXT BINARY & METADATA READY
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {downloadInfo.url && (
                <a
                  href={downloadInfo.url}
                  download={downloadInfo.filename}
                  className="btn-pill-primary !text-xs !py-1.5 !px-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {downloadInfo.filename}</span>
                </a>
              )}
              <button
                onClick={downloadMetadataJsonFile}
                className="btn-pill-ghost !text-xs !py-1.5 !px-3"
                title="Download metadata as a .json file for easy decryption"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>Download Metadata JSON</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-silver uppercase tracking-terminal">
                Cryptographic Metadata (Required for Decryption)
              </span>
              <button
                onClick={copyMetadataJson}
                className="btn-pill-ghost !py-1 !px-2.5 !text-xs"
              >
                {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5 text-phosphor" /> : <Copy className="w-3.5 h-3.5 text-smoke" />}
                <span className={copiedKey === 'meta' ? 'text-phosphor' : ''}>{copiedKey === 'meta' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-obsidian border border-charcoal text-snow p-4 rounded-sm font-mono text-xs overflow-x-auto selection:bg-phosphor selection:text-obsidian">
              {JSON.stringify(downloadInfo.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
