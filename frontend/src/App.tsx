import { Navigation } from './components/Navigation';
import { Encrypt } from './pages/Encrypt';
import { Decrypt } from './pages/Decrypt';
import { FileEncrypt } from './pages/FileEncrypt';
import { FileDecrypt } from './pages/FileDecrypt';
import { Compare } from './pages/Compare';
import { History } from './pages/History';
import { HowItWorks } from './pages/HowItWorks';
import { Shield, Key, FileLock2, Cpu, BookOpen } from 'lucide-react';
import { SecureBoxProvider, useSecureBox } from './context/SecureBoxContext';

function MainContent() {
  const { activeTab, setActiveTab } = useSecureBox();

  return (
    <div className="min-h-screen bg-midnight-void text-pure-signal flex flex-col font-sans selection:bg-electric-indigo selection:text-pure-signal">
      <Navigation />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Protocol Hero Header (Carbon Panel, 20px mobile / 24px tablet / 32px desktop padding, 2px radius) */}
        <div className="mb-10 sm:mb-12 bg-carbon-panel border border-graphite-lift rounded-sm p-5 sm:p-6 lg:p-8 relative">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2 h-2 bg-electric-indigo rounded-full inline-block animate-pulse"></span>
              <span className="font-mono text-[11px] sm:text-xs text-warm-filament tracking-widest uppercase">
                // CRYPTOGRAPHIC PROTOCOL INTERFACE
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-pure-signal leading-tight">
              Authenticated Encryption & Decryption Engine
            </h1>
            
            <p className="text-soft-mist text-sm sm:text-base mt-2.5 leading-relaxed">
              Zero-knowledge ciphertext generation with memory-hard key derivation (scrypt) and authenticated AEAD ciphers (AES-256-GCM & ChaCha20-Poly1305).
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-mono">
              <span className="flex items-center space-x-1.5 bg-graphite-lift text-pure-signal px-3 py-1.5 rounded-sm border border-graphite-lift">
                <Key className="w-3.5 h-3.5 text-electric-indigo" />
                <span>scrypt (N=16384, r=8, p=1)</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-graphite-lift text-pure-signal px-3 py-1.5 rounded-sm border border-graphite-lift">
                <Shield className="w-3.5 h-3.5 text-lime-beacon" />
                <span>128-bit Auth Tag</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-graphite-lift text-pure-signal px-3 py-1.5 rounded-sm border border-graphite-lift">
                <FileLock2 className="w-3.5 h-3.5 text-periwinkle-veil" />
                <span>Max 10 MB Files</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-graphite-lift text-pure-signal px-3 py-1.5 rounded-sm border border-graphite-lift">
                <Cpu className="w-3.5 h-3.5 text-orchid-whisper" />
                <span>AES-NI & Constant-Time ARX</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('how-it-works')}
                className="flex items-center space-x-1.5 bg-transparent border border-periwinkle-veil hover:border-cobalt-pulse text-pure-signal px-3 py-1.5 rounded-sm transition cursor-pointer min-h-[36px]"
              >
                <BookOpen className="w-3.5 h-3.5 text-periwinkle-veil" />
                <span>Read Protocol Spec</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Pages */}
        {activeTab === 'encrypt' && <Encrypt />}
        {activeTab === 'decrypt' && <Decrypt />}
        {activeTab === 'file-encrypt' && <FileEncrypt />}
        {activeTab === 'file-decrypt' && <FileDecrypt />}
        {activeTab === 'compare' && <Compare />}
        {activeTab === 'history' && <History />}
        {activeTab === 'how-it-works' && <HowItWorks />}
      </main>

      <footer className="bg-midnight-void border-t border-graphite-lift py-6 mt-12 sm:mt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-soft-mist/60 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SECUREBOX PROTOCOL. ZERO PLAINTEXT PERSISTED.</p>
          <div className="flex items-center space-x-4">
            <span>AEAD: AES-GCM / CHACHA20</span>
            <span>•</span>
            <span>KDF: SCRYPT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <SecureBoxProvider>
      <MainContent />
    </SecureBoxProvider>
  );
}

export default App;
