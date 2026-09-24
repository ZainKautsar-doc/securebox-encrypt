import React from 'react';
import { Shield, Lock, Unlock, FileText, FileCheck, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'encrypt', label: 'Encrypt Text', icon: Lock },
    { id: 'decrypt', label: 'Decrypt Text', icon: Unlock },
    { id: 'file-encrypt', label: 'Encrypt File', icon: FileText },
    { id: 'file-decrypt', label: 'Decrypt File', icon: FileCheck },
    { id: 'compare', label: 'Benchmark', icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('encrypt')}
          >
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">SecureBox</span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                AES-GCM & ChaCha20
              </span>
            </div>
          </div>

          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
