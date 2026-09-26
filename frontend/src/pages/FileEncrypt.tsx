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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Encrypt File</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            AUTHENTICATED BINARY ENCRYPTION (UP TO 10 MB PAYLOAD) WITH METADATA PACKAGING
          </p>
        </div>
      </div>

      {/* 4-Step Pipeline Indicator */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-electric-indigo" />
          <span>// FILE ENCRYPTION PIPELINE (4 STEPS)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">01. SELECT FILE</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 1</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Upload file (&lt;10 MB), enter passphrase & pick AEAD cipher.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">02. SCRYPT KDF</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 2</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              16B random salt generated. 256-bit key derived in memory.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-electric-indigo text-sm">03. AEAD STREAM</span>
              <span className="text-[10px] font-mono text-soft-mist/40">STEP 3</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              12B nonce generated. File encrypted + 16B Auth Tag produced.
            </p>
          </div>

          <div className="p-4 bg-graphite-lift border border-electric-indigo/50 rounded-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lime-beacon text-sm">04. DOWNLOAD</span>
              <span className="text-[10px] font-mono text-lime-beacon">READY</span>
            </div>
            <p className="text-soft-mist text-[12px] leading-relaxed">
              Download encrypted <code>.enc</code> file & metadata JSON.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleEncrypt} className="bg-carbon-panel border border-graphite-lift rounded-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // TARGET FILE PAYLOAD (MAX 10 MB)
            </label>
            {(file || password || downloadInfo) && (
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
                placeholder="Enter file encryption passphrase"
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
              // AEAD CIPHER
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="input-protocol bg-carbon-panel text-pure-signal cursor-pointer"
            >
              <option value="aes-256-gcm">AES-256-GCM (Hardware Accelerated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Authenticated)</option>
            </select>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'ENCRYPTING PAYLOAD...' : 'ENCRYPT & GENERATE .ENC'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {downloadInfo && (
        <div className="bg-carbon-panel border border-lime-beacon/40 rounded-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-lift">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-lime-beacon/20 text-lime-beacon rounded-sm flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-pure-signal tracking-tight">
                  File Encrypted Successfully
                </h3>
                <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
                  AUTHENTICATED CIPHERTEXT BINARY & METADATA READY FOR EXTRACTION
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {downloadInfo.url && (
                <a
                  href={downloadInfo.url}
                  download={downloadInfo.filename}
                  className="btn-primary"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD {downloadInfo.filename}</span>
                </a>
              )}
              <button
                onClick={downloadMetadataJsonFile}
                className="btn-secondary"
                title="Download metadata as a .json file for easy decryption"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>DOWNLOAD METADATA JSON</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
                // CRYPTOGRAPHIC METADATA (REQUIRED FOR DECRYPTION)
              </span>
              <button
                onClick={copyMetadataJson}
                className="btn-secondary !py-1.5 !px-3"
              >
                {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5 text-lime-beacon" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'meta' ? 'COPIED' : 'COPY JSON'}</span>
              </button>
            </div>
            <pre className="bg-midnight-void border border-graphite-lift text-pure-signal p-4 rounded-sm font-mono text-xs overflow-x-auto selection:bg-electric-indigo">
              {JSON.stringify(downloadInfo.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
