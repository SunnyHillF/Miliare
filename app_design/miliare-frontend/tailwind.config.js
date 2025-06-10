/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1566C0', // Sapphire
          dark: '#1252a3',
          light: '#E6F0FF', // Light sapphire for backgrounds
        },
        sapphire: '#1566C0',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

