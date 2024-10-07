/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['ALSSiriusRegular', 'sans-serif'],
        'serif': ['ALSSiriusRegular', 'serif'],
        'regular': ['ALSSiriusRegular', 'sans-serif'],
        'ALSSiriusRegular': ['ALSSiriusRegular', 'sans-serif'],
        'ALSSiriusBold': ['ALSSiriusBold', 'sans-serif'],
        'ALSSiriusBlack': ['ALSSiriusBlack', 'sans-serif'],
        'ALSSiriusMedium': ['ALSSiriusMedium', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

