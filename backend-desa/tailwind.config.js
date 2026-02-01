/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'resmi-blue': '#1E3A8A', // Biru Formal Pemerintah
        'resmi-light': '#F8FAFC',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'], // Font portal resmi
      }
    },
  },
  plugins: [],
}