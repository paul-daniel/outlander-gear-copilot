/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'outlander': {
          50:  '#f7f8f7',
          100: '#e8ebe8',
          200: '#d1d7d1',
          300: '#a8b5a8',
          400: '#7d8f7d',
          500: '#5a6e5a',
          600: '#465846',
          700: '#3a4a3a',
          800: '#2d3a2d',
          900: '#1a241a',
          950: '#0d130d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
      },
    },
  },
  plugins: [],
};
