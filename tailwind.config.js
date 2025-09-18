/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Nature-Inspired Palette
        'primary-green': '#22c55e',
        'primary-dark': '#16a34a',
        'primary-light': '#86efac',
        'primary-lighter': '#bbf7d0',
        'primary-lightest': '#dcfce7',
        
        // Secondary Nature Colors
        'earth-brown': '#a3a3a3',
        'earth-dark': '#78716c',
        'leaf-green': '#65a30d',
        'leaf-dark': '#4d7c0f',
        'forest-green': '#166534',
        'sage-green': '#84cc16',
        
        // Status Colors
        'warning-orange': '#f59e0b',
        'warning-light': '#fef3c7',
        'error-red': '#ef4444',
        'error-light': '#fee2e2',
        'success-green': '#10b981',
        'success-light': '#d1fae5',
        'info-blue': '#3b82f6',
        'info-light': '#dbeafe',
        
        // Neutral Palette
        'background': '#f8fafc',
        'background-secondary': '#f1f5f9',
        'surface': '#ffffff',
        'surface-elevated': '#ffffff',
        'border-light': '#e2e8f0',
        'border-medium': '#cbd5e1',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'text-tertiary': '#9ca3af',
        'text-inverse': '#ffffff',
        
        // Gradient Colors
        'gradient-start': '#22c55e',
        'gradient-end': '#16a34a',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.025em' }],
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0.025em' }],
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0.0em' }],
        'lg': ['18px', { lineHeight: '28px', letterSpacing: '0.0em' }],
        'xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.025em' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.025em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.025em' }],
        '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.05em' }],
        '5xl': ['48px', { lineHeight: '1', letterSpacing: '-0.05em' }],
        '6xl': ['60px', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'nature': '0 4px 16px rgba(34, 197, 94, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
