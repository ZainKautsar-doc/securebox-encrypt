/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-indigo': '#0000ff',
        'cobalt-pulse': '#4141fc',
        'periwinkle-veil': '#8b8bfe',
        'lime-beacon': '#7fd579',
        'orchid-whisper': '#d896ff',
        'midnight-void': '#0d0d0d',
        'carbon-panel': '#161616',
        'graphite-lift': '#252525',
        'steel-hover': '#3b3b3b',
        'pure-signal': '#ffffff',
        'soft-mist': '#eaeaea',
        'warm-filament': '#b8ad97',
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '2px',
        'md': '2px',
        'lg': '16px',
        'full': '1440px',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        'tight': '-0.02em',
      },
    },
  },
  plugins: [],
}

