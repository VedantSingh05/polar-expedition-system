/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'polar-bg': '#0B1120',
        'polar-surface': '#111827',
        'polar-elevated': '#1F2937',
        'polar-border': '#1E3A5F',
        'polar-accent': '#38BDF8',
        'polar-accent2': '#7DD3FC',
        'polar-success': '#34D399',
        'polar-warning': '#FBBF24',
        'polar-danger': '#EF4444',
        'polar-text': '#F9FAFB',
        'polar-muted': '#9CA3AF'
      }
    },
  },
  plugins: [],
}
