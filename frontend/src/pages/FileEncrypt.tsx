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
      <div className="flex items-center space-x-3 pb-3 border-b border-graphite-lift">
        <div className="w-9 h-9 bg-electric-indigo text-pure-signal rounded-sm flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-pure-signal">Enkripsi Berkas (Encrypt File)</h1>
          <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
            PENYANDIAN BERKAS BINARI HINGGA 10 MB DENGAN PENGEMASAN METADATA OTOMATIS
          </p>
        </div>
      </div>

      {/* Tujuan & Maksud Fitur */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <FileJson className="w-4 h-4 text-electric-indigo" />
          <span className="font-mono text-xs font-bold text-warm-filament uppercase tracking-wider">
            // MAKSUD & TUJUAN FITUR
          </span>
        </div>
        <p className="text-xs sm:text-sm text-soft-mist leading-relaxed font-sans">
          Fitur ini bertujuan untuk <strong>mengenkripsi dokumen, gambar, PDF, atau arsip binari apa pun menjadi file terenkripsi (.enc)</strong>. File yang dihasilkan tidak dapat dibuka atau diintip tanpa kunci yang sah. Anda juga akan mendapatkan file <code>metadata.json</code> (berisi Salt, Nonce, dan Tag) yang digunakan saat dekripsi.
        </p>
      </div>

      {/* Step-by-Step Encryption Flow */}
      <div className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 text-warm-filament font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-electric-indigo" />
          <span>// ALUR PROSES ENKRIPSI BERKAS (4 TAHAP)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">01. PILIH FILE</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">TAHAP 1</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Unggah Berkas</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Pilih file yang ingin diamankan (&le; 10 MB), ketik password, dan tentukan mode cipher.
              </p>
            </div>
            <span className="text-[10px] font-mono text-warm-filament pt-1 block">Max 10 MB</span>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">02. DERIVASI KUNCI</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">TAHAP 2</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">scrypt KDF</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Dihasilkan Salt 16-byte unik, lalu password ditransformasikan menjadi Kunci Simetris 256-bit.
              </p>
            </div>
            <span className="text-[10px] font-mono text-electric-indigo pt-1 block">Salt 16 Byte</span>
          </div>

          <div className="p-4 bg-graphite-lift border border-graphite-lift rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-electric-indigo text-xs">03. ENKRIPSI STREAM</span>
                <span className="text-[10px] font-mono text-pure-signal bg-midnight-void px-1.5 py-0.5 rounded-sm border border-graphite-lift/50">TAHAP 3</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Enkripsi AEAD</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Nonce 12-byte dibuat, byte berkas diacak rapat, dan segel Auth Tag 128-bit dihasilkan.
              </p>
            </div>
            <span className="text-[10px] font-mono text-lime-beacon pt-1 block">Nonce + Auth Tag</span>
          </div>

          <div className="p-4 bg-graphite-lift border border-electric-indigo/50 rounded-sm space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lime-beacon text-xs">04. UNDUH PAKET</span>
                <span className="text-[10px] font-mono text-lime-beacon bg-lime-beacon/10 px-1.5 py-0.5 rounded-sm">SIAP</span>
              </div>
              <h4 className="font-bold text-pure-signal font-sans">Berkas .enc & Metadata</h4>
              <p className="text-soft-mist/80 text-[11px] leading-relaxed font-sans">
                Unduh file terenkripsi (.enc) beserta metadata JSON untuk penyimpanan atau transmisi aman.
              </p>
            </div>
            <span className="text-[10px] font-mono text-pure-signal pt-1 block">Download .enc</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleEncrypt} className="bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-8 space-y-5 w-full shadow-none">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-bold text-soft-mist uppercase tracking-wider">
              // TARGET FILE PAYLOAD (MAX 10 MB)
            </label>
            {(file || password || downloadInfo) && (
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
                placeholder={algorithm === 'hybrid' ? 'Not required for Hybrid RSA' : 'Enter encryption password'}
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
              <option value="aes-256-gcm">AES-256-GCM (Authenticated)</option>
              <option value="chacha20-poly1305">ChaCha20-Poly1305 (Authenticated)</option>
              <option value="hybrid">Hybrid: AES-256-GCM + RSA-OAEP</option>
            </select>
          </div>
        </div>

        {algorithm === 'hybrid' && (
          <div className="p-3.5 bg-midnight-void border border-graphite-lift rounded-sm text-xs font-mono space-y-1">
            <div className="font-bold text-pure-signal tracking-wide">// MODE: HYBRID ENCRYPTION</div>
            <div className="text-soft-mist/80"><span className="text-warm-filament">Data Cipher:</span> AES-256-GCM (Session Key)</div>
            <div className="text-soft-mist/80"><span className="text-warm-filament">Key Protection:</span> RSA-OAEP 2048-bit (SHA-256)</div>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'ENCRYPTING PAYLOAD...' : 'ENCRYPT & GENERATE .ENC'}</span>
          </button>
        </div>
      </form>

      {downloadInfo && (
        <div className="bg-carbon-panel border border-lime-beacon/40 rounded-sm p-6 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-lift">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-lime-beacon/20 text-lime-beacon rounded-sm flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-pure-signal tracking-tight font-sans">
                  File Encrypted Successfully
                </h3>
                <p className="text-xs font-mono text-soft-mist/60 mt-0.5">
                  AUTHENTICATED CIPHERTEXT BINARY & METADATA READY
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {downloadInfo.url && (
                <a
                  href={downloadInfo.url}
                  download={downloadInfo.filename}
                  className="btn-primary text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD {downloadInfo.filename}</span>
                </a>
              )}
              <button
                onClick={downloadMetadataJsonFile}
                className="btn-secondary text-xs"
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
                className="btn-secondary !py-1 !px-2.5 text-xs"
              >
                {copiedKey === 'meta' ? <Check className="w-3.5 h-3.5 text-lime-beacon" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'meta' ? 'COPIED!' : 'COPY JSON'}</span>
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
