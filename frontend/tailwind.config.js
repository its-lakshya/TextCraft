/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      color: {
        primary: "#7C3AED",
        primaryDark: "#4C1D95",
        primaryLight: "#D8B4FE",
      },
      backgroundColor: {
        primary: "#7C3AED",
        primaryDark: "#4C1D95",
        primaryLight: "#D8B4FE",
      },
      padding: {
        rootXPadd: '80px',
      },
      textColor: {
        black: "#0E1729",
        primary: "#7C3AED",
        primaryDark: "#4C1D95",
        primaryLight: "#D8B4FE",
      },
      fontSize: {
        md: '16px',
        logoFontSize: "32px",
      }
    },
  },
  plugins: [],
};
