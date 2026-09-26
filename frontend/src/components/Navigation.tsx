import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  FileText, 
  FileCheck, 
  BarChart3, 
  History, 
  BookOpen, 
  Menu, 
  X
} from 'lucide-react';
import { useSecureBox } from '../context/SecureBoxContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, history } = useSecureBox();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainToolItems = [
    { id: 'encrypt', label: 'Encrypt Text', icon: Lock },
    { id: 'decrypt', label: 'Decrypt Text', icon: Unlock },
    { id: 'file-encrypt', label: 'Encrypt File', icon: FileText },
    { id: 'file-decrypt', label: 'Decrypt File', icon: FileCheck },
    { id: 'compare', label: 'Benchmark', icon: BarChart3 },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'encrypt': return 'Encrypt Text';
      case 'decrypt': return 'Decrypt Text';
      case 'file-encrypt': return 'Encrypt File';
      case 'file-decrypt': return 'Decrypt File';
      case 'compare': return 'Benchmark';
      case 'history': return 'History';
      case 'how-it-works': return 'Cara Kerja';
      default: return 'SecureBox';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer flex-shrink-0"
            onClick={() => handleSelectTab('encrypt')}
          >
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">SecureBox</span>
              <span className="hidden xl:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                AEAD Suite
              </span>
            </div>
          </div>

          {/* Desktop Navigation (No scrollbar, clean and fitted) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {mainToolItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities (History & How It Works) */}
          <div className="hidden md:flex items-center space-x-2">
            {/* History Pill */}
            <button
              onClick={() => handleSelectTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Lihat riwayat enkripsi & dekripsi"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {history.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {history.length}
                </span>
              )}
            </button>

            {/* How It Works Button */}
            <button
              onClick={() => handleSelectTab('how-it-works')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                activeTab === 'how-it-works'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Pelajari cara kerja & algoritma enkripsi"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cara Kerja</span>
            </button>
          </div>

          {/* Mobile Right Bar: Active Tab Badge + Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 truncate max-w-[120px]">
              {getActiveTabTitle()}
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (No horizontal scroll, clean vertical list) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg px-4 pt-3 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Kriptografi Teks & Berkas
            </span>
            <div className="grid grid-cols-1 gap-1 mt-1.5">
              {mainToolItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center space-x-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Riwayat & Informasi
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button
                onClick={() => handleSelectTab('history')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition border ${
                  activeTab === 'history'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <History className="w-4 h-4" />
                  <span>History</span>
                </div>
                {history.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'history' ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelectTab('how-it-works')}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition border ${
                  activeTab === 'how-it-works'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Cara Kerja</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
