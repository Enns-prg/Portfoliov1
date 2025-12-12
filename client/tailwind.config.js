/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // "Orbitron" for Headers (The Star Wars / Sci-Fi look)
        space: ['"Orbitron"', 'sans-serif'],
        // "Rajdhani" for Body text (Clean tech look)
        tech: ['"Rajdhani"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}