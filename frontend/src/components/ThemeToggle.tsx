import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-transparent transition-all duration-150 ease-out cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-electric-indigo ${
        isDark
          ? 'border border-graphite-lift text-electric-indigo hover:border-electric-indigo/60 hover:bg-carbon-panel/60'
          : 'border border-electric-indigo text-electric-indigo hover:bg-carbon-panel/40'
      }`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none">
        {isDark ? (
          <Moon className="w-5 h-5 text-electric-indigo transition-transform duration-200" />
        ) : (
          <Sun className="w-5 h-5 text-electric-indigo transition-transform duration-200" />
        )}
      </div>
      <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline-block font-semibold">
        {isDark ? 'DARK' : 'LIGHT'}
      </span>
    </button>
  );
};
