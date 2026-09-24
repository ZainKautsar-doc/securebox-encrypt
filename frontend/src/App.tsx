import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Encrypt } from './pages/Encrypt';
import { Decrypt } from './pages/Decrypt';
import { FileEncrypt } from './pages/FileEncrypt';
import { FileDecrypt } from './pages/FileDecrypt';
import { Compare } from './pages/Compare';
import { Shield, Key, FileLock2, Cpu } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('encrypt');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Hero Banner */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Enterprise Authenticated Encryption Suite
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Protect your data with AEAD ciphers (AES-256-GCM & ChaCha20-Poly1305) derived securely with scrypt.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>scrypt KDF (N=16384, r=8, p=1)</span>
              </span>
              <span className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>128-bit Auth Tag</span>
              </span>
              <span className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <FileLock2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Max 10 MB Files</span>
              </span>
              <span className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AES-NI & SIMD Benchmarks</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Pages */}
        {activeTab === 'encrypt' && <Encrypt />}
        {activeTab === 'decrypt' && <Decrypt />}
        {activeTab === 'file-encrypt' && <FileEncrypt />}
        {activeTab === 'file-decrypt' && <FileDecrypt />}
        {activeTab === 'compare' && <Compare />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SecureBox. Zero plaintexts stored. Client-side authentication checks enabled.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
