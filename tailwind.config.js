/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "bella-pulse": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
          "50%": { transform: "scale(1.03)", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "bella-pulse": "bella-pulse 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
      colors: {
        /* Theme engine: all colors from CSS variables (branding_json + dark mode) */
        "surface-primary": "var(--surface-primary)",
        "surface-secondary": "var(--surface-secondary)",
        "foreground-primary": "var(--text-primary)",
        "foreground-secondary": "var(--text-secondary)",
        "border-subtle": "var(--border-subtle)",
        "brand-primary": "var(--brand-primary)",
        "brand-hover": "var(--brand-hover)",
        "brand-active": "var(--brand-active)",
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        "background-tertiary": "var(--color-background-tertiary)",
        card: "var(--card-bg)",
        "card-foreground": "var(--color-text)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--bg-surface-muted)",
        foreground: "var(--color-text)",
        muted: "var(--color-text-secondary)",
        "muted-foreground": "var(--color-text-tertiary)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--border-subtle)",
          muted: "var(--color-background-tertiary)",
        },
        danger: "var(--color-danger)",
        success: "var(--accent-success)",
        warning: "var(--accent-warning)",
      },
      borderRadius: {
        card: "var(--radius-2xl)",
        button: "var(--radius-md)",
        input: "var(--radius-md)",
      },
      spacing: {
        "rhythm-1": "8px",
        "rhythm-2": "16px",
        "rhythm-3": "24px",
        "rhythm-4": "32px",
      },
      fontFamily: {
        sans: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
