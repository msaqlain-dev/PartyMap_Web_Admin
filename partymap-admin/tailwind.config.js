/** @type {import('tailwindcss').Config} */
const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
  ...defaultConfig,
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      screens: {
        xs: "480px", // Adding xs screen for 480px
        lgPlus: "1200px", // 1200px screen
      },
      colors: {
        primary: "#1467B0",
        secondary: "#1996A6",
        alpha: "#FAB54E",
        // secondary:"#83cdff"
      },
      backgroundColor: {
        bgprimary: "#181818",
        bgsecondary: "#1f1f1f",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
};
