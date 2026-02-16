/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a2e',
          600: '#252542',
          500: '#3d3d6b',
          400: '#6b6b9e',
          300: '#9e9ec9',
          200: '#c9c9e6',
          100: '#e6e6f5',
        },
        gold: {
          400: '#d4af37',
          500: '#c5a028',
          600: '#b08d1f',
        },
        purple: {
          400: '#9d4edd',
          500: '#7b2cbf',
          600: '#5a189a',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shuffle': 'shuffle 0.5s ease-in-out',
        'reveal': 'reveal 0.8s ease-out forwards',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #d4af37, 0 0 10px #d4af37' },
          '100%': { boxShadow: '0 0 20px #d4af37, 0 0 30px #d4af37' },
        },
        shuffle: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-10px) rotate(-5deg)' },
          '50%': { transform: 'translateX(10px) rotate(5deg)' },
          '75%': { transform: 'translateX(-5px) rotate(-2deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' },
        },
        reveal: {
          '0%': { transform: 'rotateY(180deg) scale(0.8)', opacity: '0' },
          '100%': { transform: 'rotateY(0) scale(1)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
