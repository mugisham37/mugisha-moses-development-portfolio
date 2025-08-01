import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./test-styling.html",
    "./tailwind-test.html",
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
          "dark-gray": "#2a2a2a",
          "light-gray": "#f5f5f5",
          "medium-gray": "#666666",
        },
        // Semantic color assignments for contrast-safe combinations
        "text-on-white": "var(--text-on-white)",
        "text-on-yellow": "var(--text-on-yellow)",
        "text-on-black": "var(--text-on-black)",
        "text-on-gray": "var(--text-on-gray)",
        "text-on-light-gray": "var(--text-on-light-gray)",
        "text-on-dark-gray": "var(--text-on-dark-gray)",
        // Interactive state colors
        "hover-bg-from-white": "var(--hover-bg-from-white)",
        "hover-text-from-white": "var(--hover-text-from-white)",
        "hover-bg-from-yellow": "var(--hover-bg-from-yellow)",
        "hover-text-from-yellow": "var(--hover-text-from-yellow)",
        "hover-bg-from-black": "var(--hover-bg-from-black)",
        "hover-text-from-black": "var(--hover-text-from-black)",
        // Safe color variants
        "safe-text-light": "var(--safe-text-light)",
        "safe-text-dark": "var(--safe-text-dark)",
        "safe-text-medium": "var(--safe-text-medium)",
        "safe-bg-light": "var(--safe-bg-light)",
        "safe-bg-dark": "var(--safe-bg-dark)",
        "safe-accent": "var(--safe-accent)",
        // Focus state colors
        "focus-outline": "var(--focus-outline-color)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Additional semantic colors for comprehensive coverage
        "text-primary": "var(--foreground)",
        "text-secondary": "var(--brutalist-medium-gray)",
        "text-muted": "var(--brutalist-gray)",
        "bg-primary": "var(--background)",
        "bg-secondary": "var(--brutalist-light-gray)",
        "bg-accent": "var(--brutalist-yellow)",
        "border-primary": "var(--foreground)",
        "border-secondary": "var(--brutalist-gray)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        typing: "typing 3.5s steps(40, end)",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
        "loading-shimmer": "loading-shimmer 1.5s infinite",
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
        "loading-shimmer": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
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
  plugins: [
    function ({ addUtilities, theme }: { addUtilities: any; theme: unknown }) {
      const newUtilities = {
        // Contrast-safe background utilities
        ".bg-white-safe": {
          backgroundColor: theme("colors.brutalist.white"),
          color: theme("colors.text-on-white"),
        },
        ".bg-yellow-safe": {
          backgroundColor: theme("colors.brutalist.yellow"),
          color: theme("colors.text-on-yellow"),
        },
        ".bg-black-safe": {
          backgroundColor: theme("colors.brutalist.black"),
          color: theme("colors.text-on-black"),
        },
        ".bg-light-gray-safe": {
          backgroundColor: theme("colors.brutalist.light-gray"),
          color: theme("colors.text-on-light-gray"),
        },
        ".bg-dark-gray-safe": {
          backgroundColor: theme("colors.brutalist.dark-gray"),
          color: theme("colors.text-on-dark-gray"),
        },
        ".bg-gray-safe": {
          backgroundColor: theme("colors.brutalist.gray"),
          color: theme("colors.text-on-gray"),
        },

        // Contrast-safe text utilities
        ".text-safe-on-white": {
          color: theme("colors.text-on-white"),
        },
        ".text-safe-on-yellow": {
          color: theme("colors.text-on-yellow"),
        },
        ".text-safe-on-black": {
          color: theme("colors.text-on-black"),
        },
        ".text-safe-on-light-gray": {
          color: theme("colors.text-on-light-gray"),
        },
        ".text-safe-on-dark-gray": {
          color: theme("colors.text-on-dark-gray"),
        },
        ".text-safe-on-gray": {
          color: theme("colors.text-on-gray"),
        },

        // Contrast-safe hover utilities
        ".hover-safe-from-white:hover": {
          backgroundColor: theme("colors.hover-bg-from-white"),
          color: theme("colors.hover-text-from-white"),
        },
        ".hover-safe-from-yellow:hover": {
          backgroundColor: theme("colors.hover-bg-from-yellow"),
          color: theme("colors.hover-text-from-yellow"),
        },
        ".hover-safe-from-black:hover": {
          backgroundColor: theme("colors.hover-bg-from-black"),
          color: theme("colors.hover-text-from-black"),
        },

        // Contrast-safe button variants
        ".btn-safe-white": {
          backgroundColor: theme("colors.brutalist.white"),
          color: theme("colors.text-on-white"),
          border: `3px solid ${theme("colors.brutalist.black")}`,
          padding: "0.75rem 1.5rem",
          fontFamily: theme("fontFamily.mono"),
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "all 0.2s ease",
          boxShadow: "3px 3px 0px var(--brutalist-black)",
        },
        ".btn-safe-white:hover": {
          backgroundColor: theme("colors.hover-bg-from-white"),
          color: theme("colors.hover-text-from-white"),
          transform: "translate(-2px, -2px)",
          boxShadow: "5px 5px 0px var(--brutalist-black)",
        },
        ".btn-safe-yellow": {
          backgroundColor: theme("colors.brutalist.yellow"),
          color: theme("colors.text-on-yellow"),
          border: `3px solid ${theme("colors.brutalist.black")}`,
          padding: "0.75rem 1.5rem",
          fontFamily: theme("fontFamily.mono"),
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "all 0.2s ease",
          boxShadow: "3px 3px 0px var(--brutalist-black)",
        },
        ".btn-safe-yellow:hover": {
          backgroundColor: theme("colors.hover-bg-from-yellow"),
          color: theme("colors.hover-text-from-yellow"),
          transform: "translate(-2px, -2px)",
          boxShadow: "5px 5px 0px var(--brutalist-black)",
        },
        ".btn-safe-black": {
          backgroundColor: theme("colors.brutalist.black"),
          color: theme("colors.text-on-black"),
          border: `3px solid ${theme("colors.brutalist.white")}`,
          padding: "0.75rem 1.5rem",
          fontFamily: theme("fontFamily.mono"),
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "all 0.2s ease",
          boxShadow: "3px 3px 0px var(--brutalist-white)",
        },
        ".btn-safe-black:hover": {
          backgroundColor: theme("colors.hover-bg-from-black"),
          color: theme("colors.hover-text-from-black"),
          transform: "translate(-2px, -2px)",
          boxShadow: "5px 5px 0px var(--brutalist-white)",
        },

        // Focus utilities with proper contrast
        ".focus-safe:focus": {
          outline: `3px solid ${theme("colors.focus-outline")}`,
          outlineOffset: "2px",
        },

        // Theme-aware navigation utilities
        ".nav-theme-aware": {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderColor: "var(--foreground)",
        },
        ".nav-focus-safe:focus": {
          outline: `3px solid ${theme("colors.brutalist.yellow")}`,
          outlineOffset: "2px",
          backgroundColor: theme("colors.brutalist.yellow"),
          color: theme("colors.text-on-yellow"),
        },
        ".nav-hover-safe:hover": {
          color: theme("colors.brutalist.yellow"),
        },

        // Mobile menu theme-aware utilities
        ".mobile-menu-theme-aware": {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderColor: "var(--foreground)",
        },

        // Enhanced scroll progress bar
        ".scroll-progress-enhanced": {
          backgroundColor: theme("colors.brutalist.yellow"),
          borderTop: "1px solid var(--foreground)",
          boxShadow: "0 -1px 0 var(--foreground)",
        },

        // Contrast-safe card utilities
        ".card-safe": {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          border: "3px solid var(--foreground)",
          padding: "1.5rem",
          boxShadow: "5px 5px 0px var(--foreground)",
          transition: "all 0.2s ease",
        },
        ".card-safe:hover": {
          transform: "translate(-2px, -2px)",
          boxShadow: "7px 7px 0px var(--foreground)",
        },

        // Status indicator utilities with proper contrast
        ".status-success": {
          backgroundColor: "#10b981",
          color: "#ffffff",
          padding: "0.5rem 1rem",
          border: "2px solid #065f46",
        },
        ".status-error": {
          backgroundColor: "#ef4444",
          color: "#ffffff",
          padding: "0.5rem 1rem",
          border: "2px solid #991b1b",
        },
        ".status-warning": {
          backgroundColor: theme("colors.brutalist.yellow"),
          color: theme("colors.text-on-yellow"),
          padding: "0.5rem 1rem",
          border: `2px solid ${theme("colors.brutalist.black")}`,
        },
        ".status-info": {
          backgroundColor: theme("colors.brutalist.light-gray"),
          color: theme("colors.text-on-light-gray"),
          padding: "0.5rem 1rem",
          border: `2px solid ${theme("colors.brutalist.black")}`,
        },

        // Additional contrast-safe utilities for comprehensive coverage
        ".text-contrast-high": {
          color: theme("colors.brutalist.black"),
          textShadow: "1px 1px 0px rgba(255, 255, 255, 0.8)",
        },
        ".text-contrast-high-inverse": {
          color: theme("colors.brutalist.white"),
          textShadow: "1px 1px 0px rgba(0, 0, 0, 0.8)",
        },

        // Enhanced link utilities with proper contrast
        ".link-safe": {
          color: theme("colors.foreground"),
          textDecoration: "underline",
          textDecorationColor: theme("colors.brutalist.yellow"),
          textUnderlineOffset: "0.2em",
          transition: "all 0.2s ease",
        },
        ".link-safe:hover": {
          color: theme("colors.brutalist.yellow"),
          textDecorationColor: theme("colors.foreground"),
        },
        ".link-safe:focus": {
          outline: `2px solid ${theme("colors.brutalist.yellow")}`,
          outlineOffset: "2px",
          backgroundColor: theme("colors.brutalist.yellow"),
          color: theme("colors.text-on-yellow"),
          textDecoration: "none",
        },

        // Form element utilities with proper contrast
        ".input-safe": {
          backgroundColor: theme("colors.background"),
          color: theme("colors.foreground"),
          border: `2px solid ${theme("colors.foreground")}`,
          padding: "0.75rem",
          fontFamily: theme("fontFamily.mono"),
        },
        ".input-safe:focus": {
          outline: `3px solid ${theme("colors.brutalist.yellow")}`,
          outlineOffset: "2px",
          borderColor: theme("colors.brutalist.yellow"),
        },

        // Table utilities with proper contrast
        ".table-safe": {
          borderCollapse: "collapse",
          width: "100%",
        },
        ".table-safe th": {
          backgroundColor: theme("colors.brutalist.light-gray"),
          color: theme("colors.text-on-light-gray"),
          border: `1px solid ${theme("colors.foreground")}`,
          padding: "0.75rem",
          textAlign: "left",
          fontWeight: "bold",
        },
        ".table-safe td": {
          border: `1px solid ${theme("colors.foreground")}`,
          padding: "0.75rem",
          textAlign: "left",
        },

        // Modal utilities with proper contrast
        ".modal-safe": {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "1000",
          backgroundColor: theme("colors.background"),
          border: `3px solid ${theme("colors.foreground")}`,
          padding: "2rem",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: `8px 8px 0px ${theme("colors.foreground")}`,
        },

        // Tooltip utilities with proper contrast
        ".tooltip-safe": {
          position: "absolute",
          zIndex: "1000",
          padding: "0.5rem",
          backgroundColor: theme("colors.brutalist.dark-gray"),
          color: theme("colors.text-on-dark-gray"),
          border: `1px solid ${theme("colors.text-on-dark-gray")}`,
          fontSize: "0.875rem",
          maxWidth: "200px",
          fontFamily: theme("fontFamily.mono"),
        },

        // Loading state utilities
        ".loading-safe": {
          position: "relative",
          overflow: "hidden",
        },
        ".loading-safe::after": {
          content: '""',
          position: "absolute",
          top: "0",
          left: "-100%",
          width: "100%",
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${theme(
            "colors.brutalist.yellow"
          )}40, transparent)`,
          animation: "loading-shimmer 1.5s infinite",
        },

        // High contrast mode utilities
        ".high-contrast-safe": {
          "--background": theme("colors.brutalist.black"),
          "--foreground": theme("colors.brutalist.white"),
        },
        ".high-contrast-safe *": {
          backgroundColor: "var(--background) !important",
          color: "var(--foreground) !important",
          borderColor: "var(--foreground) !important",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover", "focus"]);
    },
  ],
};

export default config;
