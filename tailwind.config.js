/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ton: {
          50:  '#e8f4fd',
          100: '#d0e9fb',
          200: '#a1d3f7',
          300: '#5cb8f5',
          400: '#2ea6f4',
          500: '#0098ea',
          600: '#007ec5',
          700: '#005f96',
          800: '#003f64',
          900: '#001f32',
        },
      },
    },
  },
  plugins: [],
}
