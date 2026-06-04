import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f2847",
          50: "#e8f0fa",
          100: "#c5d8f0",
          200: "#9dbde4",
          300: "#74a0d6",
          400: "#4f88cb",
          500: "#2e6fbf",
          600: "#1e5399",
          700: "#153d73",
          800: "#0f2847",
          900: "#091a30",
        },
        accent: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0f2847 0%, #153d73 50%, #1e5399 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
