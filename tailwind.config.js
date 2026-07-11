/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#0a0a0f',
          800: '#0f0f17',
          700: '#16161f',
          600: '#1d1d29',
          500: '#262633',
          400: '#33333f',
        },
        brand: {
          50: '#eefcfb',
          100: '#d3f8f5',
          200: '#abf0ed',
          300: '#73e3e0',
          400: '#38cdc9',
          500: '#1ab3af',
          600: '#128f8c',
          700: '#13726f',
          800: '#145b59',
          900: '#134c4a',
        },
        accent: {
          50: '#fff8eb',
          100: '#ffeec6',
          200: '#ffd988',
          300: '#ffbf4a',
          400: '#ffa620',
          500: '#f98307',
          600: '#dd6402',
          700: '#b74506',
          800: '#94340c',
          900: '#7a2c0e',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#facc15',
          500: '#eab308',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9' }],
        '11xl': ['14rem', { lineHeight: '0.85' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-rev': 'marquee-rev 40s linear infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid': "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        'radial-fade': 'radial-gradient(ellipse at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
