/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/theme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/button.js",
    './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#EDEDED',
        menuColor: '#142043',
        error: '#FF0000',
        cardBg: 'rgba(255,255,255, 0.65)',
        buttonLogin: '#3366FF',
        titleColor: '#095580',
        tableHeader: '#005c8e',
        teksBlack: '#474D66',
        teksNavi: '#101840',
        teksPrimary: '#22356F',
        onGoing: '#008DEB',
        completed: '#27AE60',
        revision: '#D14343',
        waitingForReview: '#FFB020',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
}