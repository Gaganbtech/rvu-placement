/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#19252F', // Primary Navy
          dark: '#101A22',    // Dark Navy
          card: '#20303A',    // Card Navy
          surface: '#15212A', // Subtle surface
          deep: '#0B1218',    // Deepest ambient
        },
        gold: {
          DEFAULT: '#CCAA68', // Primary RVU Gold
          highlight: '#D8B978', // Gold Highlight
          light: '#E6CF9D',
          dark: '#A68545',
          muted: 'rgba(204, 170, 104, 0.4)',
          faint: 'rgba(204, 170, 104, 0.12)',
          border: 'rgba(204, 170, 104, 0.20)',
        },
        rvu: {
          text: '#F2F4F5',      // Light text
          muted: '#AEB7BC',     // Muted text
          subtle: '#78848C',    // Extra subtle text
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(204, 170, 104, 0.18)',
        'gold-sm': '0 0 12px rgba(204, 170, 104, 0.12)',
        'gold-hover': '0 10px 30px -5px rgba(204, 170, 104, 0.25)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.45)',
        'card-elevated': '0 20px 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'circuit-radial': 'radial-gradient(circle at 50% 0%, rgba(204, 170, 104, 0.12) 0%, transparent 60%)',
        'gold-gradient': 'linear-gradient(135deg, #CCAA68 0%, #D8B978 50%, #B8924E 100%)',
        'navy-gradient': 'linear-gradient(180deg, #19252F 0%, #101A22 100%)',
      }
    },
  },
  plugins: [],
}
