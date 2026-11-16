/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: '#2A7A6E', deep: '#1E5C52', light: '#3E9B8D', pale: '#E8F4F0' },
        cream: { DEFAULT: '#F5EFE4', light: '#FAF7F2', dark: '#EDE5D8' },
        amber: { DEFAULT: '#D4A574', deep: '#B8864F' },
        terracotta: '#C76B4F',
        ink: { DEFAULT: '#1A1A1A', soft: '#3A3A3A' },
        muted: '#6B6B6B',
        line: '#E5DDD0',
        dark: '#1C2B28',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(42, 122, 110, 0.08)',
        'lg-custom': '0 10px 30px -5px rgba(28, 43, 40, 0.06), 0 4px 12px -2px rgba(28, 43, 40, 0.03)',
      }
    },
  },
  plugins: [],
}