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

      {/* Step-by-Step Decryption Flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Alur Kerja Proses Dekripsi Berkas (File Decryption Flow)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-600 block">Langkah 1: Muat Berkas & JSON</span>
            <p className="text-slate-600">
              Unggah berkas <code>.enc</code> & isi metadata (Salt/Session Key, Nonce, Tag) manual atau dari JSON.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-600 block">Langkah 2: Dekripsi Kunci</span>
            <p className="text-slate-600">
              Kunci AES didekripsi via RSA-OAEP atau diturunkan melalui password & <strong>scrypt</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-600 block">Langkah 3: Verifikasi Tag</span>
            <p className="text-slate-600">
              AEAD memverifikasi Auth Tag 128-bit. Jika password salah/berkas dirusak, dekripsi ditolak.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <span className="font-bold text-emerald-700 block">Langkah 4: Unduh Berkas Asli</span>
            <p className="text-slate-700">
              Berkas asli berhasil dipulihkan secara utuh dan siap diunduh kembali.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleDecrypt} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Upload Encrypted File (.enc)
            </label>
            {(file || password || salt || encrypted_session_key || downloadInfo) && (
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
            <label className="block text-xs font-medium text-slate-600 mb-1">Passphrase {algorithm === 'hybrid' && <span className="text-slate-400 font-normal">(Auto RSA Private Key)</span>}</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={algorithm === 'hybrid'}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={algorithm === 'hybrid' ? 'Decrypted using backend RSA Private Key' : 'Enter original password'}
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
            <label className="block text-xs font-medium text-slate-600 mb-1">Encryption Mode</label>
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
          disabled={loading || !file}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
          <span>{loading ? 'Authenticating & Decrypting...' : 'Decrypt File'}</span>
        </button>
      </form>

      {downloadInfo && (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-emerald-800">Decryption Successful!</h3>
            <p className="text-xs text-slate-600 mt-0.5">Integrity check passed (Auth Tag matched).</p>
          </div>
          <a
            href={downloadInfo.url}
            download={downloadInfo.filename}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download {downloadInfo.filename}</span>
          </a>
        </div>
      )}
    </div>
  );
};
