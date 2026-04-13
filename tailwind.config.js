/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        usob: {
          blue: "#1a3a6b",
          "blue-mid": "#2255a0",
          "blue-light": "#e8eef8",
          yellow: "#f5c518",
          "yellow-dark": "#c9a010",
          "yellow-light": "#fef9e7",
        },
      },
    },
  },
  plugins: [],
};
