/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Caveat"', '"Patrick Hand"', 'cursive'],
        sans: ['"Nunito"', 'sans-serif']
      },
      colors: {
        sakura: {
          50: '#fef5f5',
          100: '#fde8e8',
          200: '#f9c5c5',
          300: '#f4a0a0',
          400: '#e87878',
          500: '#d95c5c',
          600: '#c44040',
          700: '#a03030',
          800: '#7d2323',
          900: '#5a1818'
        },
        blush: '#f9ebe8',
        petal: '#e8c4bc'
      }
    }
  },
  plugins: []
};
