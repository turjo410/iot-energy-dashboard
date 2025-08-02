// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Good practice to include this
    "./app/**/*.{js,ts,jsx,tsx,mdx}",       // If you use the app router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};