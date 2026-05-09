import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b1b8c7",
          400: "#838ca3",
          500: "#646d86",
          600: "#4f566c",
          700: "#414758",
          800: "#383d4b",
          900: "#1f2230",
          950: "#11131c",
        },
        accent: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bdd2ff",
          300: "#90b2ff",
          400: "#6088ff",
          500: "#3a62ff",
          600: "#2442f5",
          700: "#1d33dc",
          800: "#1d2db0",
          900: "#1f2c8b",
        },
        mint: {
          400: "#5eead4",
          500: "#2dd4bf",
          600: "#14b8a6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(58,98,255,0.15), 0 8px 30px -8px rgba(58,98,255,0.35)",
        soft: "0 1px 2px rgba(17,19,28,0.04), 0 8px 24px -8px rgba(17,19,28,0.12)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), radial-gradient(circle at 1px 1px, rgba(17,19,28,0.08) 1px, transparent 0)",
        "mesh":
          "radial-gradient(at 20% 10%, rgba(58,98,255,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(45,212,191,0.15) 0px, transparent 50%), radial-gradient(at 80% 90%, rgba(58,98,255,0.10) 0px, transparent 50%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
