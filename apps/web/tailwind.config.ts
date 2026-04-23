import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        confidence: {
          0: '#6b7280',
          1: '#ef4444',
          2: '#f97316',
          3: '#eab308',
          4: '#22c55e',
          5: '#3b82f6',
        },
        domain: {
          algorithms: '#8b5cf6',
          ml: '#06b6d4',
          deeplearning: '#f59e0b',
          systems: '#10b981',
          quant: '#ef4444',
          biology: '#ec4899',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
