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
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
