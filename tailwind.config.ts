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
        primary: {
          50: '#1a1a1a',
          100: '#2d2d2d',
          200: '#404040',
          300: '#595959',
          400: '#737373',
          500: '#0a0a0a',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        brown: {
          50: '#fdf8f6',
          100: '#f2e8cf',
          200: '#e7d4b5',
          300: '#d4b896',
          400: '#c19a6b',
          500: '#8b6f47',
          600: '#6b5639',
          700: '#4a3f2e',
          800: '#3d3426',
          900: '#2d2619',
        },
      },
    },
  },
  plugins: [],
}
export default config
