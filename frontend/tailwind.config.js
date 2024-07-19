/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      color: {
        primary: '#7C3AED',
        primaryDark: '#4C1D95',
        primaryLight: '#D8B4FE',
      },
      backgroundColor: {
        primary: '#7C3AED',
        primaryDark: '#4C1D95',
        primaryLight: '#D8B4FE',
        primaryExtraLight: '#F3E7FF',
        documentBackground: '#F8F8Fa',
        toolbarColor: '#EDF2FA',
      },
      borderColor: {
        primary: '#7C3AED',
        primaryDark: '#4C1D95',
        primaryLight: '#D8B4FE',
      },
      outlineColor: {
        primary: '#7C3AED',
        primaryDark: '#4C1D95',
        primaryLight: '#D8B4FE',
      },
      padding: {
        rootXPadd: '80px',
        documentPagePadd: '20px',
      },
      margin: {
        documentPageMargin: '20px',
      },
      textColor: {
        black: '#0E1729',
        primary: '#7C3AED',
        primaryDark: '#4C1D95',
        primaryLight: '#D8B4FE',
      },
      fontSize: {
        md: '16px',
        logoFontSize: '32px',
        logoFontSizeSmall: '26px',
      },
      keyframes: {
        arrowMove: {
          '0%': { left: '0%' },
          '50%': { left: '10%' },
          '100%': { left: '0%' },
        },
      },
      animation: {
        arrowMove: 'arrowMove 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
