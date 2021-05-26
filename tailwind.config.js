const defaultTheme = require("tailwindcss/defaultConfig").theme;

module.exports = {
  // mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}", "./src/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#1F1D2B",
          200: "#252836",
          500: "#525298",
        },
        secondary: {
          500: "#08A0F7",
        },
      },
      fontSize: {
        base: ".9375rem",
      },
      fontFamily: {
        // sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        none: "0px",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "1.875rem",
        full: "9999px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
