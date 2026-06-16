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
