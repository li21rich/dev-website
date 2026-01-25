/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6F00",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      sm: '650px',
      md: '768px',
      mm: '888px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1636px',
      xxxl: '2300px',
    },
  },
  plugins: [],
}
