import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        sans: ["Space Mono", "monospace"], // Use Space Mono as default
      },
      colors: {
        brutalist: {
          black: "#000000",
          white: "#ffffff",
          yellow: "#ffff00",
          gray: "#808080",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        typing: "typing 3.5s steps(40, end)",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
      },
      keyframes: {
        glow: {
          "0%": {
            boxShadow: "0 0 5px #ffff00, 0 0 10px #ffff00, 0 0 15px #ffff00",
          },
          "100%": {
            boxShadow: "0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00",
          },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      borderWidth: {
        "3": "3px",
        "5": "5px",
        "6": "6px",
        "8": "8px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

export default config;
