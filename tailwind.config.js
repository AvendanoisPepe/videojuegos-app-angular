/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // 👈 Esto le dice a Tailwind que busque en tu app.html y app.ts
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}