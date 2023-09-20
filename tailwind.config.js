/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        petgreen: '#45e14f',
        activepetgreen: '#22d12d'
      },
    },
  },
  plugins: [],
}

