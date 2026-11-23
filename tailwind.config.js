/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#011222',
        orange: '#FB8731',
        'orange-light': '#FB8835',
        'gray-light': '#F0F3F8',
        'text-dark': '#011222',
        'text-gray': '#6B6767',
        'text-light': '#F9F5F5',
        'border-color': '#E2E2E2',
      },
      fontFamily: {
        almarai: ['Almarai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
