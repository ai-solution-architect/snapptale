/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'snaptale-primary': '#A8DADC',
        'snaptale-secondary': '#FFD6BA',
        'snaptale-highlight': '#457B9D',
        'snaptale-shadow': '#1D3557',
        'snaptale-background': '#F9FAFB',
        'snaptale-app-background': '#A8DADC',
        // New color palette
        'primary': '#13a4ec',
        'background-light': '#f6f7f8',
        'background-dark': '#101c22',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        display: ['var(--font-plus-jakarta-sans)', 'sans-serif'], // New font family
      },
      borderRadius: {
        // New borderRadius extensions
        'DEFAULT': '0.5rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px'
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Add dark mode configuration
}