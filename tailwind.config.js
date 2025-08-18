module.exports = {
  safelist: [
    'bg-[conic-gradient(var(--tw-gradient-stops))]',
    'from-purple-500',
    'via-pink-500',
    'to-purple-500',
  ],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      animation: {
        'slideInUp': 'slideInUp 0.3s ease-out',
      },
      keyframes: {
        slideInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}; 