/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'theme-peach': "#FCCBB8",
        'theme-light-peach': "#FFE5DA",
        'theme-very-light-peach': "#FFF3F0",
        'theme-dark-peach': "#FC7E5E",
        'theme-very-dark-peach': "#FF5E3A",
      }
    },
  },
  plugins: [],
}

