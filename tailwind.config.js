/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A5276',
        secondary: '#0052D9',
        accent: '#C8102E',
        light: '#EBF5FB',
        dark: '#0B3954',
      }
    },
  },
  plugins: [],
}
