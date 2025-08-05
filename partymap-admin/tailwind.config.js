/** @type {import('tailwindcss').Config} */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
        "./src/**/*.{js,ts,jsx,tsx}","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        lgPlus: "1200px",
      },
      colors: {
        primary: "#E10098",
        secondary: "#202020",
        alpha: "#FAB54E",
      },
      backgroundColor: {
        bgprimary: "#181818",
        bgsecondary: "#1f1f1f",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
