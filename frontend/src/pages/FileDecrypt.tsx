import React, { useState } from 'react';
import { api } from '../services/api';
import { FileUpload } from '../components/FileUpload';
import { FileCheck, Unlock, Loader2, Download, UploadCloud } from 'lucide-react';

export const FileDecrypt: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<'aes-256-gcm' | 'chacha20-poly1305'>('aes-256-gcm');
  const [salt, setSalt] = useState('');
  const [nonce, setNonce] = useState('');
  const [tag, setTag] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<{
    url: string;
    filename: string;
  } | null>(null);

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
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (!salt.trim() || !nonce.trim() || !tag.trim()) {
      setError('Salt, Nonce, and Auth Tag metadata are required to decrypt.');
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
    } catch (err: any) {
      setError(err.message || 'File decryption failed. Authentication or password mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Decrypt File</h1>
          <p className="text-xs text-slate-500">
            Upload the encrypted binary (.enc) and supply the correct passphrase and cryptographic metadata.
          </p>
        </div>
      </div>

      <form onSubmit={handleDecrypt} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Upload Encrypted File (.enc)
          </label>
          <FileUpload onFileSelect={setFile} selectedFile={file} maxSizeMB={10} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Decryption Parameters
          </span>
          <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Load Metadata JSON</span>
            <input type="file" accept=".json,application/json" onChange={handleJsonUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Passphrase</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter original password"
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aes-256-gcm">AES-256-GCM</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
            </select>
          </div>
        </div>

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
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
          <span>{loading ? 'Authenticating & Decrypting...' : 'Decrypt File'}</span>
        </button>
      </form>

      {downloadInfo && (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-emerald-800">Decryption Successful!</h3>
            <p className="text-xs text-slate-600 mt-0.5">Integrity check passed (Auth Tag matched).</p>
          </div>
          <a
            href={downloadInfo.url}
            download={downloadInfo.filename}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download {downloadInfo.filename}</span>
          </a>
        </div>
      )}
    </div>
  );
};
