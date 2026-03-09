# Theme & Design Tokens

- **CSS variables**: `src/theme/tokens.css` (primary), overridden by `src/theme/light.css`, `src/theme/dark.css`, `src/theme/enrollment-dark.css`
- **Tailwind**: `tailwind.config.js` (content, darkMode: "class", theme.extend from CSS vars)
- **Global styles**: `src/index.css` (base, utilities, component classes; file is large — see repo for full content)

---

## Full `src/theme/tokens.css`

```css
/* ─── Single source of truth: theme variables (overridden by ThemeProvider from branding_json) ─── */
:root {
  --surface-1: #ffffff;
  --surface-2: #f8fafc;
  --surface-primary: #ffffff;
  --surface-secondary: #f8fafc;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-subtle: #e5e7eb;
  --brand-primary: #3b82f6;
  --brand-hover: #2563eb;
  --brand-active: #1d4ed8;
  --danger: #ef4444;
  --success: #10b981;
}

.dark {
  --surface-1: #0f172a;
  --surface-2: #1e293b;
  --surface-primary: #0f172a;
  --surface-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-subtle: #334155;
  --brand-primary: #60a5fa;
  --brand-hover: #3b82f6;
  --brand-active: #2563eb;
  --danger: #f87171;
  --success: #34d399;
  /* Legacy tokens ... */
  --color-background: #0f172a;
  --color-background-secondary: #1e293b;
  --color-background-tertiary: #334155;
  --color-text: #f1f5f9;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #cbd5e1;
  --color-border: #334155;
  --color-surface: #1e293b;
  --color-surface-elevated: #334155;
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-primary-active: #2563eb;
  --enroll-bg: #0f172a;
  --enroll-card-bg: #1e293b;
  --enroll-card-border: #334155;
  --enroll-soft-bg: #1e293b;
  --enroll-text-primary: #f1f5f9;
  --enroll-text-secondary: #94a3b8;
  --enroll-text-muted: #cbd5e1;
  --card-bg: #1e293b;
  --card-border: rgba(51, 65, 85, 0.5);
  --slider-track-unfilled: #334155;
}

:root {
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;
  --color-primary-rgb: 59 130 246;
  --color-danger: #ef4444;
  --color-danger-rgb: 239 68 68;
  --color-warning-rgb: 245 158 11;

  --color-background: #ffffff;
  --color-background-secondary: #f9fafb;
  --color-background-tertiary: #f3f4f6;
  --color-text: #111827;
  --color-text-primary: var(--color-text);
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --color-text-inverse: #ffffff;
  --color-border: #e5e7eb;
  --color-surface: var(--color-background);
  --color-surface-elevated: var(--color-background);
  --slider-track-unfilled: #e2e8f0;
  --card-bg: var(--color-surface-elevated);
  --card-border: rgb(17 24 39 / 0.08);
  --card-shadow: var(--shadow-lg);

  /* Auth */
  --auth-left-bg: linear-gradient(135deg, #0b1220 0%, #111827 100%);
  --auth-glass-bg: rgb(255 255 255 / 0.08);
  --auth-glass-border: rgb(255 255 255 / 0.16);
  --auth-dot: rgb(255 255 255 / 0.30);
  --auth-dot-active: rgb(255 255 255 / 0.90);

  /* Enrollment */
  --enroll-bg: #f8fafc;
  --enroll-brand: #4f46e5;
  --enroll-brand-rgb: 79 70 229;
  --enroll-accent: #22c55e;
  --enroll-accent-rgb: 34 197 94;
  --enroll-text-primary: #0f172a;
  --enroll-text-secondary: #475569;
  --enroll-text-muted: #94a3b8;
  --enroll-card-bg: #ffffff;
  --enroll-card-border: #e2e8f0;
  --enroll-card-radius: 16px;
  --enroll-soft-bg: #f1f5f9;
  --enroll-elevation-1: 0 1px 2px rgba(0, 0, 0, 0.04);
  --enroll-elevation-2: 0 4px 12px rgba(0, 0, 0, 0.06);
  --enroll-elevation-3: 0 8px 24px rgba(0, 0, 0, 0.08);

  /* HeroUI-style */
  --heroui-radius: 0.75rem;
  --heroui-radius-sm: 0.5rem;
  --heroui-input-bg: transparent;
  --heroui-input-border: 2px solid var(--color-border);
  --heroui-input-focus-ring: 0 0 0 2px var(--color-primary);
  --heroui-card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --heroui-switch-track: var(--color-background-tertiary);
  --heroui-switch-track-checked: var(--color-primary);
  --heroui-transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Full `tailwind.config.js`

```js
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
```

---

## Global CSS

**File**: `src/index.css`  
- Imports: `@tailwind base; @tailwind components; @tailwind utilities;`
- `:root` base (font-family, color-scheme, status colors)
- Utility classes: `.glass-card`, `.elevation-1` / `.elevation-2` / `.elevation-3`, `.pre-enrollment-hero-bg`, `.button`, etc.
- File is very large (~16k+ lines); when designing, pass `src/index.css` as context and use line ranges only for 1000+ line files to extract sections used by the target page.
