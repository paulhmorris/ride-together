/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
