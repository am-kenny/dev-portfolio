/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionDuration: {
        theme: 'var(--theme-transition-duration)',
      },
      transitionTimingFunction: {
        theme: 'var(--theme-transition-easing)',
      },
    },
  },
  plugins: [],
}
