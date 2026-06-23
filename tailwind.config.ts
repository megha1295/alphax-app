import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#F1ECE2',
        surface: '#FAF8F4',
        ink: '#2A2724',
        muted: '#8A8276',
        border: '#E4DFD4',
        'border-strong': '#DCD6CB',
        accent: '#0F6E56',
        'accent-soft': '#DCEEE7',
        danger: '#A32D2D',
        'danger-soft': '#F4DEDE',
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}

export default config
