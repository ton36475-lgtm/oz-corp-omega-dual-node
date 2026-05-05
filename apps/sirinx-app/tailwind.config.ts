import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy':  '#0A2342',
        'solar-gold': '#F5A623',
        'emerald':    '#10B981',
        'ice-blue':   '#E8F4FD',
        'slate-text': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'sans-serif'],
      },
      borderRadius: {
        card:   '12px',
        button: '8px',
        input:  '6px',
      },
    },
  },
  plugins: [],
}

export default config
