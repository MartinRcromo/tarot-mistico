/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          900: '#0a0a0f', 800: '#12121a', 700: '#1a1a2e',
          600: '#252542', 500: '#3d3d6b', 400: '#6b6b9e',
          300: '#9e9ec9', 200: '#c9c9e6', 100: '#e6e6f5',
        },
        gold: { 400: '#d4af37', 500: '#c5a028', 600: '#b08d1f' },
        purple: { 400: '#9d4edd', 500: '#7b2cbf', 600: '#5a189a' }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'reveal': 'reveal 0.8s ease-out forwards',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow: { '0%': { boxShadow: '0 0 5px #d4af37' }, '100%': { boxShadow: '0 0 20px #d4af37' } },
        reveal: { '0%': { transform: 'rotateY(180deg) scale(0.8)', opacity: '0' }, '100%': { transform: 'rotateY(0) scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
