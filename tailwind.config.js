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
        bg: 'var(--bg-base)',
        'bg-card': 'var(--bg-card)',
        'bg-card-alt': 'var(--bg-card-alt)',
        'bg-hover': 'var(--bg-hover)',
        sidebar: {
          bg: 'var(--sidebar-bg)',
          text: 'var(--sidebar-text)',
          'text-active': 'var(--sidebar-text-active)',
          'active-bg': 'var(--sidebar-active-bg)',
          accent: 'var(--sidebar-accent)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          muted: 'var(--color-primary-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          muted: 'var(--color-accent-muted)',
        },
        text: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        border: {
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        mobile: '640px',
        desktop: '1100px',
      },
    },
  },
  plugins: [],
}
