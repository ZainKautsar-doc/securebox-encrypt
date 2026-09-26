/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-indigo': '#0000ff', // Pure Vana Electric Indigo
        'cobalt-pulse': '#4141fc',    // Hover blue
        'periwinkle-veil': '#8b8bfe', // Highlight / secondary border
        'lime-beacon': '#7fd579',     // Success status
        'orchid-whisper': '#d896ff',  // Alert / Accent
        'midnight-void': '#0d0d0d',   // Canvas background
        'carbon-panel': '#161616',    // Card / Form surface
        'graphite-lift': '#252525',   // Surface borders & elevated badges
        'charcoal': '#333333',        // Component borders
        'steel-hover': '#3b3b3b',     // Hover / disabled surfaces
        'graphite': '#4d4d4d',        // Low-emphasis icons / borders
        'smoke': '#898989',           // Metadata / caption text
        'pure-signal': '#ffffff',     // Primary text / button labels
        'soft-mist': '#eaeaea',       // Secondary / body text
        'warm-filament': '#b8ad97',   // Protocol terminal accents
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

