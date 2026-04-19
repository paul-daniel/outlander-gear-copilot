/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'outlander': {
          50:  '#faf9f7',
          100: '#f2efeb',
          200: '#e2ddd5',
          300: '#c8bfb3',
          400: '#ad9f8f',
          500: '#968574',
          600: '#7d6d5d',
          700: '#675a4d',
          800: '#574c42',
          900: '#332e29',
          950: '#1d1b18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
      },
      keyframes: {
        copilotBounce: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        copilotBounce: 'copilotBounce 1.2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};
