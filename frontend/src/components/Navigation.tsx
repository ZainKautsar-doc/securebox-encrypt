import React, { useState } from 'react';
import { 
  Shield, 
  History, 
  BookOpen, 
  Menu, 
  X
} from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, history } = useSecureBox();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'encrypt', label: '• ENCRYPT' },
    { id: 'decrypt', label: '• DECRYPT' },
    { id: 'file-encrypt', label: '• FILE ENCRYPT' },
    { id: 'file-decrypt', label: '• FILE DECRYPT' },
    { id: 'compare', label: '• BENCHMARK' },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'encrypt': return '• ENCRYPT';
      case 'decrypt': return '• DECRYPT';
      case 'file-encrypt': return '• FILE ENCRYPT';
      case 'file-decrypt': return '• FILE DECRYPT';
      case 'compare': return '• BENCHMARK';
      case 'history': return '• HISTORY';
      case 'how-it-works': return '• SPEC';
      default: return 'SECUREBOX';
    }
  };

  return (
    <header className="bg-midnight-void/95 backdrop-blur-md border-b border-graphite-lift sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo (Header Hierarchy Level 1) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none flex-shrink-0 group"
            onClick={() => handleSelectTab('encrypt')}
          >
            <div className="w-8 h-8 bg-electric-indigo/20 border border-electric-indigo/50 text-electric-indigo flex items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-105">
              <Shield className="w-4 h-4 text-periwinkle-veil" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-pure-signal group-hover:text-periwinkle-veil transition-colors">
                SecureBox
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] text-warm-filament/90 bg-carbon-panel border border-graphite-lift px-2 py-0.5 rounded-sm uppercase tracking-wider">
                AEAD PROTOCOL v1.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items (Header Hierarchy Level 2 - Strict Single Line) */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-sm font-mono text-xs tracking-wider uppercase whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-electric-indigo text-pure-signal font-semibold shadow-sm'
                      : 'text-soft-mist/75 hover:text-pure-signal hover:bg-graphite-lift/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities (History & Spec) */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            {/* History Button */}
            <button
              onClick={() => handleSelectTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-mono text-xs tracking-wider uppercase whitespace-nowrap flex-shrink-0 transition cursor-pointer border ${
                activeTab === 'history'
                  ? 'bg-electric-indigo text-pure-signal border-electric-indigo font-semibold'
                  : 'bg-carbon-panel text-soft-mist/80 border-graphite-lift hover:border-periwinkle-veil/50 hover:text-pure-signal'
              }`}
              title="Activity History"
            >
              <History className="w-3.5 h-3.5" />
              <span>• HISTORY</span>
              {history.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono font-bold ${
                  activeTab === 'history' ? 'bg-midnight-void text-pure-signal' : 'bg-graphite-lift text-periwinkle-veil'
                }`}>
                  {history.length}
                </span>
              )}
            </button>

            {/* Protocol Spec / Cara Kerja */}
            <button
              onClick={() => handleSelectTab('how-it-works')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm font-mono text-xs tracking-wider uppercase whitespace-nowrap flex-shrink-0 transition cursor-pointer border ${
                activeTab === 'how-it-works'
                  ? 'bg-electric-indigo text-pure-signal border-electric-indigo font-semibold'
                  : 'bg-transparent border-graphite-lift text-soft-mist/80 hover:border-periwinkle-veil/50 hover:text-pure-signal hover:bg-graphite-lift/40'
              }`}
              title="Protocol Specification & Architecture"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>• SPEC</span>
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex lg:hidden items-center space-x-2">
            <span className="font-mono text-xs px-2.5 py-1 bg-carbon-panel text-soft-mist rounded-sm border border-graphite-lift truncate max-w-[140px]">
              {getActiveTabTitle()}
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-soft-mist hover:text-pure-signal bg-carbon-panel border border-graphite-lift rounded-sm transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-graphite-lift bg-midnight-void px-6 pt-3 pb-6 space-y-4 shadow-xl">
          <div>
            <span className="font-mono text-[10px] text-warm-filament uppercase tracking-wider block px-1 mb-2">
              // CRYPTOGRAPHIC PROTOCOLS
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-sm font-mono text-xs tracking-wider uppercase transition cursor-pointer ${
                      isActive
                        ? 'bg-electric-indigo text-pure-signal font-semibold'
                        : 'text-soft-mist hover:bg-carbon-panel hover:text-pure-signal'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-graphite-lift">
            <span className="font-mono text-[10px] text-warm-filament uppercase tracking-wider block px-1 mb-2">
              // UTILITIES
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectTab('history')}
                className={`flex items-center justify-between px-3 py-2 rounded-sm font-mono text-xs uppercase transition border ${
                  activeTab === 'history'
                    ? 'bg-electric-indigo text-pure-signal border-electric-indigo'
                    : 'bg-carbon-panel text-soft-mist border-graphite-lift'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>• HISTORY</span>
                </div>
                {history.length > 0 && (
                  <span className="text-[10px] px-1 py-0.5 rounded-sm bg-midnight-void text-pure-signal font-bold">
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelectTab('how-it-works')}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-sm font-mono text-xs uppercase transition border ${
                  activeTab === 'how-it-works'
                    ? 'bg-electric-indigo text-pure-signal border-electric-indigo'
                    : 'bg-carbon-panel text-soft-mist border-graphite-lift'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>• SPEC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
