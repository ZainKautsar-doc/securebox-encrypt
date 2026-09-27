/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-indigo': 'rgb(var(--color-electric-indigo) / <alpha-value>)',
        'cobalt-pulse': 'rgb(var(--color-cobalt-pulse) / <alpha-value>)',
        'periwinkle-veil': 'rgb(var(--color-periwinkle-veil) / <alpha-value>)',
        'lime-beacon': 'rgb(var(--color-lime-beacon) / <alpha-value>)',
        'orchid-whisper': 'rgb(var(--color-orchid-whisper) / <alpha-value>)',
        'midnight-void': 'rgb(var(--color-midnight-void) / <alpha-value>)',
        'carbon-panel': 'rgb(var(--color-carbon-panel) / <alpha-value>)',
        'graphite-lift': 'rgb(var(--color-graphite-lift) / <alpha-value>)',
        'charcoal': 'rgb(var(--color-charcoal) / <alpha-value>)',
        'steel-hover': 'rgb(var(--color-steel-hover) / <alpha-value>)',
        'graphite': 'rgb(var(--color-graphite) / <alpha-value>)',
        'smoke': 'rgb(var(--color-smoke) / <alpha-value>)',
        'pure-signal': 'rgb(var(--color-pure-signal) / <alpha-value>)',
        'soft-mist': 'rgb(var(--color-soft-mist) / <alpha-value>)',
        'warm-filament': 'rgb(var(--color-warm-filament) / <alpha-value>)',
        light: {
          'primary': '#121212',
          'surface': '#ffffff',
          'surface-elevated': '#f5f5f5',
          'border': '#d4d4d4',
          'text': '#121212',
          'text-secondary': '#4d4d4d',
        },
        dark: {
          'primary': '#ffffff',
          'surface': '#0d0d0d',
          'surface-elevated': '#161616',
          'border': '#252525',
          'text': '#ffffff',
          'text-secondary': '#eaeaea',
        }
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
