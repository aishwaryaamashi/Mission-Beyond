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
        space: {
          950: '#040711',
          900: '#070C18',
          850: '#0B1224',
          800: '#0F1A34',
          700: '#162347',
          600: '#1F315E',
        },
        slate: {
          850: '#131D2E',
          950: '#090E17',
        },
        hud: {
          cyan: '#06B6D4',
          cyanGlow: '#22D3EE',
          amber: '#F59E0B',
          amberLight: '#FBBF24',
          red: '#EF4444',
          redLight: '#F87171',
          green: '#10B981',
          greenLight: '#34D399',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Chakra Petch"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace'],
        display: ['"Rajdhani"', '"Chakra Petch"', 'sans-serif'],
      },
      boxShadow: {
        'hud': '0 0 15px -3px rgba(6, 182, 212, 0.15), 0 0 6px -2px rgba(6, 182, 212, 0.1)',
        'hud-amber': '0 0 15px -3px rgba(245, 158, 11, 0.2)',
        'hud-red': '0 0 15px -3px rgba(239, 68, 68, 0.25)',
        'hud-green': '0 0 15px -3px rgba(16, 185, 129, 0.2)',
        'panel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
