/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
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
    // backgroundImage: {
    //   "landlord-login": "url('assets/images/landlordBgImage.png')",
    //   "forgot-password-Bg": "url('assets/images/forgetPassowrdBg.png')",
    //   "auth-Bg": "url('assets/images/authBg.png')",
    //   "auth-dark-Bg": "url('assets/images/AuthBgDark.png')",
    // },
  },
};
export const plugins = [require("daisyui")];
