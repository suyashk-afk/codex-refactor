/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: false, // Don't override existing styles
  corePlugins: {
    preflight: false, // Keep your existing base styles
  },
  theme: {
    extend: {
      colors: {
        // Frankenstein Laboratory Theme
        toxic: {
          50: '#f0ffe8',
          100: '#dcffc6',
          200: '#bcff94',
          300: '#8fff51',
          400: '#39ff14', // Main toxic green
          500: '#2ecc11',
          600: '#1a8b0a',
          700: '#156908',
          800: '#14520c',
          900: '#13440f',
        },
        blood: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#ff0040', // Bright blood red
          500: '#cc0033',
          600: '#8b0000', // Dark blood red
          700: '#7f1d1d',
          800: '#660000',
          900: '#450a0a',
        },
        copper: {
          50: '#fdf8f3',
          100: '#f7ede3',
          200: '#eed9c4',
          300: '#e3bf9d',
          400: '#b8860b', // Bright copper
          500: '#8b6321', // Base copper
          600: '#5a3910', // Dark copper
          700: '#4a2f0d',
          800: '#3d260e',
          900: '#35210f',
        },
        laboratory: {
          950: '#000000',
          900: '#0a0a0a',
          850: '#0d0d0d',
          800: '#0f0f0f',
          700: '#1a1a1a',
          600: '#2a2a2a',
          500: '#3a3a3a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'electric-pulse': 'electricPulse 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
        'spark': 'spark 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
        'blood-drip': 'bloodDrip 3s ease-in-out infinite',
        'voltage-pulse': 'voltagePulse 1s ease-in-out infinite',
      },
      keyframes: {
        electricPulse: {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.5)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(57, 255, 20, 0.6)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '5%': { opacity: '0.6' },
          '10%': { opacity: '1' },
          '15%': { opacity: '0.8' },
          '20%': { opacity: '1' },
        },
        spark: {
          '0%': { opacity: '1', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        bloodDrip: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { transform: 'translateY(10px)', opacity: '1' },
          '100%': { transform: 'translateY(15px)', opacity: '0' },
        },
        voltagePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.6)',
        'glow-red': '0 0 20px rgba(139, 0, 0, 0.6)',
        'glow-copper': '0 0 10px rgba(139, 99, 33, 0.3)',
        'inner-dark': 'inset 0 2px 8px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}
