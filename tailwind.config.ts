import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: "#07080d",
          900: "#0c0e16",
          850: "#11131e",
          800: "#161927",
          750: "#1c2032",
          700: "#23283d",
          600: "#313850",
          500: "#4a5270",
          400: "#6f7a9e",
          300: "#9aa4c4",
          200: "#c6cde3",
          100: "#e9ecf7",
        },
        accent: {
          DEFAULT: "#7c5cff",
          soft: "#a78bfa",
          glow: "#c4b5fd",
        },
        mint: "#3ddc97",
        coral: "#ff6b81",
        amber: "#ffb02e",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,.45), 0 0 24px rgba(124,92,255,.25)",
        panel: "0 10px 40px rgba(0,0,0,.45)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in .25s ease-out",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
