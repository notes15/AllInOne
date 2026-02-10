/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#D4A574',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F5DC',
          foreground: '#333333',
        },
        accent: {
          DEFAULT: '#C9A66B',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#333333',
        },
        border: '#E5E5E0',
        muted: {
          DEFAULT: '#F0EDE5',
          foreground: '#666666',
        },
      },
    },
  },
  plugins: [],
};