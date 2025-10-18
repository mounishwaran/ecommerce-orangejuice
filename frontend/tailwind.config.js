/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff7a00',
          light: '#ffa64d',
          dark: '#cc6200',
        }
      }
    },
  },
  plugins: [],
}
