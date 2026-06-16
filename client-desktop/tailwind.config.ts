import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e94560',
        secondary: '#16213e',
        accent: '#0f3460',
        dark: '#1a1a2e',
        light: '#eaeaea',
      },
    },
  },
  plugins: [],
}
export default config
