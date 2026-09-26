import { Navigation } from './components/Navigation';
import { Encrypt } from './pages/Encrypt';
import { Decrypt } from './pages/Decrypt';
import { FileEncrypt } from './pages/FileEncrypt';
import { FileDecrypt } from './pages/FileDecrypt';
import { Compare } from './pages/Compare';
import { History } from './pages/History';
import { HowItWorks } from './pages/HowItWorks';
import { Shield, Key, FileLock2, Cpu, BookOpen, ArrowRight } from 'lucide-react';
import { SecureBoxProvider, useSecureBox } from './context/SecureBoxContext';

function MainContent() {
  const { activeTab, setActiveTab } = useSecureBox();

  return (
    <div className="min-h-screen bg-obsidian text-snow flex flex-col font-sans selection:bg-phosphor selection:text-obsidian">
      <Navigation />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-10 space-y-12">
        {/* Supabase Hero Card (Obsidian canvas, 1px Charcoal border, 16px radius, Phosphor accents) */}
        <section className="bg-obsidian border border-charcoal rounded-base p-8 sm:p-10 relative overflow-hidden transition-all duration-200 hover:border-graphite">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 pill-status">
              <span className="w-2 h-2 bg-phosphor rounded-full animate-pulse-phosphor" />
              <span className="text-xs font-mono text-silver tracking-terminal uppercase">
                Terminal-Native Cryptography
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-3xl font-normal tracking-tight text-snow leading-tight">
              Enterprise Authenticated Encryption Suite
            </h1>
            
            <p className="text-silver text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              State-of-the-art zero-knowledge AEAD cryptography with scrypt memory-hard key derivation. Built for developers with high throughput and instant in-memory verification.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              <span className="pill-status">
                <Key className="w-3.5 h-3.5 text-smoke" />
                <span className="text-silver">scrypt (N=16384, r=8, p=1)</span>
              </span>
              <span className="pill-status">
                <Shield className="w-3.5 h-3.5 text-phosphor" />
                <span className="text-silver">128-bit Auth Tag</span>
              </span>
              <span className="pill-status">
                <FileLock2 className="w-3.5 h-3.5 text-smoke" />
                <span className="text-silver">Max 10 MB Files</span>
              </span>
              <span className="pill-status">
                <Cpu className="w-3.5 h-3.5 text-smoke" />
                <span className="text-silver">AES-NI & Constant-Time ARX</span>
              </span>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('encrypt')}
                className="btn-pill-primary"
              >
                <span>Encrypt Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('how-it-works')}
                className="btn-pill-ghost"
              >
                <BookOpen className="w-3.5 h-3.5 text-silver" />
                <span>Protocol Spec</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Pages */}
        <section className="animate-fade-in-up">
          {activeTab === 'encrypt' && <Encrypt />}
          {activeTab === 'decrypt' && <Decrypt />}
          {activeTab === 'file-encrypt' && <FileEncrypt />}
          {activeTab === 'file-decrypt' && <FileDecrypt />}
          {activeTab === 'compare' && <Compare />}
          {activeTab === 'history' && <History />}
          {activeTab === 'how-it-works' && <HowItWorks />}
        </section>
      </main>

      <footer className="bg-obsidian border-t border-charcoal py-8 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-smoke">
          <p>© {new Date().getFullYear()} SecureBox. Zero plaintext persisted to server.</p>
          <div className="flex items-center space-x-4 font-mono text-xs">
            <span className="hover:text-silver transition-colors">AES-256-GCM</span>
            <span>•</span>
            <span className="hover:text-silver transition-colors">ChaCha20-Poly1305</span>
            <span>•</span>
            <span className="hover:text-silver transition-colors">scrypt KDF</span>
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
