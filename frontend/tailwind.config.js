/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'phosphor': '#3ecf8e',
        'mint': '#00c573',
        'forest': '#1f4b37',
        'emerald': '#006239',
        'snow': '#fafafa',
        'silver': '#b4b4b4',
        'smoke': '#898989',
        'graphite': '#4d4d4d',
        'slate': '#393939',
        'charcoal': '#2e2e2e',
        'ash': '#242424',
        'obsidian': '#121212',
      },
      borderRadius: {
        'sm': '8px',
        'base': '16px',
        'full': '9999px',
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
        '80': '80px',
        '96': '96px',
      },
      fontFamily: {
        'sans': ['Inter', 'Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '36px',
        '3xl': '48px',
      },
      letterSpacing: {
        'tight': '-0.007em',
        'terminal': '+0.100em',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
