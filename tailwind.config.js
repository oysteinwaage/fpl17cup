/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fpl: {
          purple: '#38003C',
          green:  '#00FF87',
          yellow: '#FFBB00',
        },
      },
      fontFamily: {
        premier: ['"PremierSans-Regular"', 'Arial', '"Helvetica Neue"', 'Helvetica', 'sans-serif'],
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'zoom-in': { from: { transform: 'scale(0.95)' }, to: { transform: 'scale(1)' } },
        'zoom-out': { from: { transform: 'scale(1)' }, to: { transform: 'scale(0.95)' } },
      },
      animation: {
        'in':  'fade-in 0.15s ease-out, zoom-in 0.15s ease-out',
        'out': 'fade-out 0.1s ease-in, zoom-out 0.1s ease-in',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
