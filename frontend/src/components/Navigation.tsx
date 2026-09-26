import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  History, 
  BookOpen, 
  Menu, 
  X,
  Lock,
  Unlock,
  FileText,
  FileCheck,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, history } = useSecureBox();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'encrypt', label: 'Encrypt', icon: Lock },
    { id: 'decrypt', label: 'Decrypt', icon: Unlock },
    { id: 'file-encrypt', label: 'File Encrypt', icon: FileText },
    { id: 'file-decrypt', label: 'File Decrypt', icon: FileCheck },
    { id: 'compare', label: 'Benchmark', icon: BarChart3 },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'encrypt': return 'Encrypt';
      case 'decrypt': return 'Decrypt';
      case 'file-encrypt': return 'File Encrypt';
      case 'file-decrypt': return 'File Decrypt';
      case 'compare': return 'Benchmark';
      case 'history': return 'History';
      case 'how-it-works': return 'Spec';
      default: return 'SecureBox';
    }
  };

  return (
    <header className="bg-obsidian/95 backdrop-blur-md border-b border-charcoal sticky top-0 z-50 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo (Left - Prominent & Bold) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none flex-shrink-0 group"
            onClick={() => handleSelectTab('encrypt')}
          >
            <div className="w-10 h-10 rounded-base bg-ash border border-charcoal text-phosphor flex items-center justify-center transition-all duration-200 group-hover:border-phosphor group-hover:scale-105">
              <Shield className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="font-sans font-medium text-lg sm:text-xl tracking-tight text-snow group-hover:text-phosphor transition-colors">
                SecureBox
              </span>
              <span className="hidden sm:inline-block font-mono text-xs text-smoke tracking-terminal px-2.5 py-0.5 rounded-full bg-ash border border-charcoal uppercase">
                AEAD v1.0
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (Center - Prominent 80px Height & 15px Font) */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2 h-20">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center space-x-2 px-4 lg:px-5 h-20 text-sm sm:text-base font-normal transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-snow font-medium'
                      : 'text-silver hover:text-snow hover:bg-ash/50'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-phosphor' : 'text-smoke'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-phosphor rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities (Desktop & Tablet - Generous Pill Sizing) */}
          <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
            {/* History Pill */}
            <button
              onClick={() => handleSelectTab('history')}
              className={`pill-status !py-2 !px-4 cursor-pointer transition-all duration-150 hover:border-graphite hover:scale-[1.02] active:scale-[0.98] ${
                activeTab === 'history'
                  ? 'border-phosphor text-snow bg-ash'
                  : 'text-silver hover:text-snow'
              }`}
              title="Activity History"
            >
              <History className="w-4 h-4 text-smoke" />
              <span className="hidden md:inline font-sans text-sm">History</span>
              {history.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-charcoal text-phosphor font-mono font-medium">
                  {history.length}
                </span>
              )}
            </button>

            {/* Protocol Spec Pill */}
            <button
              onClick={() => handleSelectTab('how-it-works')}
              className={`btn-pill-ghost !py-2 !px-4 !text-sm ${
                activeTab === 'how-it-works'
                  ? '!border-phosphor !text-phosphor'
                  : ''
              }`}
              title="Protocol Specification & Architecture"
            >
              <BookOpen className="w-4 h-4" />
              <span>Spec</span>
            </button>
          </div>

          {/* Mobile/Tablet Menu Toggle (Visible on < 1024px) */}
          <div className="flex lg:hidden items-center space-x-2.5">
            <span className="sm:hidden pill-status !py-1.5 !px-3 text-xs truncate max-w-[120px]">
              {getActiveTabTitle()}
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-silver hover:text-snow bg-ash border border-charcoal rounded-base transition-all duration-150 hover:border-graphite cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-charcoal bg-obsidian/98 backdrop-blur-lg px-4 sm:px-6 pt-4 pb-6 space-y-4 animate-fade-in-down shadow-2xl">
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-normal text-smoke uppercase tracking-terminal">
                Cryptographic Tools
              </span>
              <span className="text-[10px] text-smoke font-mono">5 MODULES</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-base text-sm sm:text-base transition-all duration-150 cursor-pointer flex items-center justify-between border ${
                      isActive
                        ? 'bg-ash text-snow font-medium border-phosphor'
                        : 'bg-obsidian/50 border-charcoal text-silver hover:bg-ash/50 hover:text-snow hover:border-graphite'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-phosphor' : 'text-smoke'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-phosphor" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-smoke/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-charcoal">
            <span className="text-xs font-normal text-smoke uppercase tracking-terminal block px-1 mb-2">
              Utilities & Documentation
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelectTab('history')}
                className={`pill-status justify-between px-4 py-3 cursor-pointer !rounded-base ${
                  activeTab === 'history' ? 'border-phosphor text-snow bg-ash' : ''
                }`}
              >
                <div className="flex items-center space-x-2 text-sm">
                  <History className="w-4 h-4 text-smoke" />
                  <span>History</span>
                </div>
                {history.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-charcoal text-phosphor font-mono">
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelectTab('how-it-works')}
                className={`btn-pill-ghost !py-3 !px-4 !text-sm justify-center !rounded-base ${
                  activeTab === 'how-it-works' ? '!border-phosphor !text-phosphor' : ''
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Protocol Spec</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
