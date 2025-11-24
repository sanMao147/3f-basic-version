module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      fontSize: {
        '10xl': '10rem',
        '11xl': '11rem',
        '12xl': '12rem',
        '13xl': '13rem',
      },
      animation: {
        horizontalScroll: 'horizontalScroll linear 16s infinite ',
        'horizontalScroll-2': 'horizontalScroll-2 linear 16s infinite ',
      },
      keyframes: {
        horizontalScroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'horizontalScroll-2': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
