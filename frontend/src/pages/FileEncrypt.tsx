import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileText, Lock, Loader2, Download, Copy, Check, KeyRound, RotateCcw, FileJson, Layers, Eye, EyeOff } from 'lucide-react';
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
  const setAlgorithm = (val: 'aes-256-gcm' | 'chacha20-poly1305' | 'hybrid') => setFileEncryptState((prev) => ({ ...prev, algorithm: val }));
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
      setError('Please select a file to encrypt.');
      return;
    }
    if (algorithm !== 'hybrid' && !password) {
      setError('Password is required.');
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
      setError(err.message || 'File encryption failed.');
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
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Encrypt File</h1>
          <p className="text-xs text-slate-500">
            Upload any file up to 10 MB. Output will be downloaded as an encrypted binary with authentication metadata.
          </p>
        </div>
      </div>

      {/* Step-by-Step Encryption Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Alur Kerja Proses Enkripsi Berkas (File Encryption Flow)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-600 block">Langkah 1: Pilih Berkas</span>
            <p className="text-slate-600">
              Pengguna memilih berkas (maks 10 MB), memasukkan password & memilih cipher.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-600 block">Langkah 2: Salt & KDF</span>
            <p className="text-slate-600">
              16-byte random salt dibuat. Algoritma <strong>scrypt</strong> menurunkan kunci 256-bit di memori.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-600 block">Langkah 3: Nonce & AEAD</span>
            <p className="text-slate-600">
              12-byte nonce dibuat. Berkas dienkripsi dan menghasilkan Auth Tag 128-bit untuk verifikasi.
            </p>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1">
            <span className="font-bold text-indigo-700 block">Langkah 4: Berkas & JSON</span>
            <p className="text-slate-700">
              Unduh berkas terenkripsi <code>.enc</code> beserta metadata JSON (Salt, Nonce, Tag).
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleEncrypt} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Upload Target File (Max 10 MB)
            </label>
            {(file || password || downloadInfo) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
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
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Passphrase {algorithm === 'hybrid' && <span className="text-slate-400 font-normal">(Auto RSA Session Key)</span>}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={algorithm === 'hybrid'}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={algorithm === 'hybrid' ? 'Not required for Hybrid RSA-OAEP' : 'Enter file encryption password'}
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
              <option value="aes-256-gcm">AES-256-GCM (Authenticated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Authenticated)</option>
              <option value="hybrid">Hybrid: AES-256-GCM + RSA-OAEP</option>
            </select>
          </div>
        </div>

        {algorithm === 'hybrid' && (
          <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-lg text-xs space-y-1">
            <div className="font-bold text-indigo-900 tracking-wide">Mode: HYBRID</div>
            <div className="text-indigo-800"><span className="font-semibold">Data Cipher:</span> AES-256-GCM</div>
            <div className="text-indigo-800"><span className="font-semibold">Key Protection:</span> RSA-OAEP (SHA-256)</div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>{loading ? 'Encrypting File...' : 'Encrypt & Download'}</span>
        </button>
      </form>

      {downloadInfo && (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-emerald-800 flex items-center space-x-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>File Encrypted Successfully</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download the encrypted file (.enc) and its metadata JSON file to decrypt later.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {downloadInfo.url && (
                <a
                  href={downloadInfo.url}
                  download={downloadInfo.filename}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Encrypted File ({downloadInfo.filename})</span>
                </a>
              )}
              <button
                onClick={downloadMetadataJsonFile}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
                title="Download metadata as a .json file for easy decryption"
              >
                <FileJson className="w-4 h-4" />
                <span>Download Metadata JSON</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Encryption Metadata (Required to Decrypt)
              </span>
              <button
                onClick={copyMetadataJson}
                className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center space-x-1 font-medium px-2.5 py-1 rounded transition"
              >
                {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'meta' ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              {JSON.stringify(downloadInfo.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
