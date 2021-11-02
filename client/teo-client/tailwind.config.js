module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        celest: {
          light: '#C2D3DA',
          dark: '#81A3A7',
        },
        gray: {
          dark: '#585A56',
        },
        black: {
          dark: '#272424',
        },
        white: {
          light: '#F1F3F2',
        },
      },
      borderStyle: ['responsive', 'hover'],
      borderWidth: ['responsive', 'hover'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
