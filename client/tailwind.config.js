/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode via class strategy

  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A78BFA',   // Tailwind's purple-400
          DEFAULT: '#8B5CF6', // Tailwind's purple-500
          dark: '#7C3AED',    // Tailwind's purple-600
        },
        gray: {
          950: '#0f0f0f',
        }
      },
      animation: {
        'fade-down': 'fadeDown 0.3s ease-out',
      },
      keyframes: {
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),       // Optional: better styled inputs
    require('@tailwindcss/typography'),  // Optional: better styled content (like about page)
    require('tailwind-scrollbar-hide'),
  ],
};
