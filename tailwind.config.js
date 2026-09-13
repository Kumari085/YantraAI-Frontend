/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aegis: {
          950: '#07090e',
          900: '#0b0e14',
          850: '#10141d',
          800: '#161c28',
          750: '#1d2433',
          700: '#263044',
          600: '#384661',
          500: '#4f6285',
          border: 'rgba(56, 189, 248, 0.12)',
          'border-subtle': 'rgba(255, 255, 255, 0.07)',
          'border-focus': 'rgba(56, 189, 248, 0.4)',
        },
        cyan: {
          450: '#14b8a6',
          550: '#0284c7',
        },
        sidebar: '#080a0e',
        workspace: '#0c0f16',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(52, 211, 153, 0.25)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cursor-blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
