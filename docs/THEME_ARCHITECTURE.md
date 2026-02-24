# Theme & Dark Mode Architecture

## Principle

**All colors come from CSS variables.** Variables are set by the ThemeProvider from `company.branding_json`. Dark mode only switches which set of values is applied (light vs dark palette). Components must never hardcode colors.

## Semantic CSS Variables

| Variable | Purpose |
|----------|---------|
| `--surface-primary` | Page/main background |
| `--surface-secondary` | Cards, panels, inputs |
| `--text-primary` | Primary text |
| `--text-secondary` | Secondary/muted text |
| `--border-subtle` | Borders, dividers |
| `--brand-primary` | Primary brand color |
| `--brand-hover` | Hover state for brand |
| `--brand-active` | Active/pressed state |

## Tailwind Usage

Use semantic classes so the UI responds to theme and dark mode:

- **Backgrounds:** `bg-surface-primary`, `bg-surface-secondary`, `bg-[var(--surface-primary)]`
- **Text:** `text-foreground-primary`, `text-foreground-secondary`, `text-[var(--text-primary)]`
- **Borders:** `border-border-subtle`, `border-[var(--border-subtle)]`
- **Brand:** `bg-brand-primary`, `hover:bg-brand-hover`, `active:bg-brand-active`

## Do Not Use

- `bg-white`, `bg-gray-*`, `text-gray-*`, `border-gray-*`
- Hex/rgba in components (e.g. `#ffffff`, `rgba(0,0,0,0.1)`)
- Conditional classes like `dark:bg-gray-800` for colors; dark mode is handled by variable values

## Flow

1. User logs in → `UserContext` fetches company (including `branding_json`).
2. `setCompanyBranding(companyName, branding_json, logo_url)` is called.
3. `ThemeContext` resolves theme via `themeManager.getTheme()` (uses `branding_json` when present).
4. `applyThemeToDOM(currentColors)` injects CSS variables on `document.documentElement`.
5. `effectiveMode` (light/dark) determines `currentColors`; `.dark` class is toggled on `<html>`.
6. All components that use `var(--*)` or semantic Tailwind colors update automatically.

## Files

- **Theme engine:** `src/theme/utils.ts` (`applyThemeToDOM`, `clearThemeFromDOM`, `generateDarkTheme`)
- **Tokens (fallbacks):** `src/theme/tokens.css` (`:root` and `.dark` defaults)
- **Provider:** `src/context/ThemeContext.tsx`
- **Resolution:** `src/theme/themeManager.ts`, `src/theme/defaultThemes.ts`
- **Tailwind:** `tailwind.config.js` (semantic colors)
