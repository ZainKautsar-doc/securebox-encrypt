import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileText, Lock, Loader2, Download, Copy, Check, KeyRound } from 'lucide-react';

export const FileEncrypt: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<'aes-256-gcm' | 'chacha20-poly1305'>('aes-256-gcm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<{
    url: string;
    filename: string;
    metadata: any;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to encrypt.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setError(null);
    setLoading(true);
    setDownloadInfo(null);

    try {
      const res = await api.encryptFile(file, password, algorithm);
      const url = window.URL.createObjectURL(res.blob);
      setDownloadInfo({
        url,
        filename: res.filename,
        metadata: res.metadata,
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

      <form onSubmit={handleEncrypt} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Upload Target File (Max 10 MB)
          </label>
          <FileUpload onFileSelect={setFile} selectedFile={file} maxSizeMB={10} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Passphrase
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter file encryption password"
                className="w-full pl-9 text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Cipher Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aes-256-gcm">AES-256-GCM (Authenticated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Authenticated)</option>
            </select>
          </div>
        </div>

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
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-emerald-800 flex items-center space-x-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>File Encrypted Successfully</span>
            </h3>
            <a
              href={downloadInfo.url}
              download={downloadInfo.filename}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Encrypted File ({downloadInfo.filename})</span>
            </a>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Encryption Metadata (Required to Decrypt)
              </span>
              <button
                onClick={copyMetadataJson}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-medium bg-indigo-50 px-2.5 py-1 rounded"
              >
                {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'meta' ? 'Copied Metadata JSON!' : 'Copy Metadata JSON'}</span>
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
