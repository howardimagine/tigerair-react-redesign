export default {
  theme: {
    extend: {
      colors: {
        primary: '#faa836',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-delay-1': 'fade-in-up 0.6s ease-out forwards 0.1s',
        'fade-in-delay-2': 'fade-in-up 0.6s ease-out forwards 0.2s',
        'fade-in-delay-3': 'fade-in-up 0.6s ease-out forwards 0.3s',
        'fade-in-delay-4': 'fade-in-up 0.6s ease-out forwards 0.4s',
        'fade-in-delay-5': 'fade-in-up 0.6s ease-out forwards 0.5s',
      },
    },
  },
}
