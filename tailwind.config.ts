import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // 8px spacing system
      spacing: {
        0: '0',
        1: '0.25rem', // 4px
        2: '0.5rem', // 8px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        16: '4rem', // 64px
        20: '5rem', // 80px
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }], // caption
        sm: ['14px', { lineHeight: '1.5' }], // secondary text
        base: ['16px', { lineHeight: '1.6' }], // body
        lg: ['18px', { lineHeight: '1.6' }], // large body
        xl: ['20px', { lineHeight: '1.6' }], // section headers
        '2xl': ['24px', { lineHeight: '1.3' }], // page headers
        '3xl': ['32px', { lineHeight: '1.2' }], // hero numbers
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        'full': '9999px',
      },
      colors: {
        // Premium dark theme
        background: '#020617',
        surface: '#0B1220',
        'surface-light': '#111827',
        
        // Text
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        
        // Accent
        primary: '#22C55E',
        'primary-hover': '#16A34A',
        'primary-dark': '#166534',
        
        // UI elements
        border: 'rgba(255, 255, 255, 0.06)',
        'border-light': 'rgba(255, 255, 255, 0.12)',
        
        // Status colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      backgroundColor: {
        background: '#020617',
        surface: '#0B1220',
        'surface-light': '#111827',
      },
      textColor: {
        primary: '#E5E7EB',
        secondary: '#9CA3AF',
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.06)',
        light: 'rgba(255, 255, 255, 0.12)',
      },
      boxShadow: {
        // Soft shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        // Glass morphism shadow
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionDuration: {
        200: '200ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
}

export default config
