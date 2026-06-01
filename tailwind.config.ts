import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#3b82f6',
        'accent-dark': '#1d4ed8',
        ink: '#111827',
        muted: '#6b7280',
        axis: '#9ca3af',
        line: '#e5e7eb',
        zebra: '#f9fafb',
        navy: '#0a0e2a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
} satisfies Config;
