module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Clinical White Palette
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Severity scale (medical convention)
        severity: {
          normal:   '#059669', // emerald-600
          veryMild: '#D97706', // amber-600
          mild:     '#EA580C', // orange-600
          moderate: '#DC2626', // red-600
        },
        // Neutral surface scale
        surface: {
          page:   '#F8FAFC', // slate-50
          card:   '#FFFFFF',
          muted:  '#F1F5F9', // slate-100
          border: '#E2E8F0', // slate-200
          input:  '#F8FAFC',
        },
        // Text scale
        ink: {
          primary:   '#0F172A', // slate-900
          secondary: '#475569', // slate-600
          muted:     '#94A3B8', // slate-400
          inverse:   '#FFFFFF',
        },
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        panel: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        float: '0 10px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.25rem',
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
