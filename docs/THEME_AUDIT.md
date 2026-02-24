# Full Theme System Audit & Structural Fix

## 1. What Was Wrong (Root Cause)

### Architecture
- **Dark mode:** Implemented via Tailwind `class` on `document.documentElement` (`.light` / `.dark`). ThemeProvider applies `applyThemeToDOM(currentColors)` so CSS variables are set from `branding_json` for both light and dark. **No `data-theme`**; no mix.
- **Problem:** Many components **bypassed** theme tokens:
  - `bg-[#FFFFFF]` on dashboard cards (always white).
  - Inline `backgroundColor: "#0b1020"`, `#f8fafc`, `rgba(...)` in BellaScreen and others.
  - Hardcoded hex in QuickActionsCard (icon colors), FloatingCards (stroke, stopColor), AIInsightsPanel (rgba).
  - BellaScreen used **local** `isDarkMode` state and conditional styling instead of global theme, so it could disagree with the rest of the app.

### Portals & Modals
- Modals use `createPortal(..., document.body)`. They are still in the same document; CSS variables cascade from `document.documentElement`, so **portals do inherit theme**. No structural change was needed for portals; the issue was components inside modals using hardcoded colors (e.g. dialog background). Modal dialog background was switched to `var(--surface-1)` and border to `var(--border-subtle)`.

### Duplicate / Legacy
- `primary_color` and `secondary_color` are still selected from the API in UserContext but **theming uses only `branding_json`**. No duplicate theme logic was added; old columns left in place for API compatibility.

---

## 2. What Was Removed

- **Hardcoded `bg-[#FFFFFF]`** in:
  - HeroEnrollmentCard, QuickActionsCard, LearningResourceCard, PersonalizedScoreCard, Dashboard (page), GoalSimulatorCard, RecentTransactionsCard, PortfolioTable, RateOfReturnCard, PlanOverviewCard, DashboardCard, FloatingCards  
  Replaced with `bg-[var(--surface-1)]`.
- **BellaScreen local dark state for styling:** Removed conditional background layers and inline `#0b1020` / `#f8fafc` / `rgba(...)`. Bella now uses global theme only (`useTheme().effectiveMode`); toggle calls `setMode()`.
- **QuickActionsCard** fixed hex icon colors (`#5D3FD3`, `#3465F5`, etc.) → theme vars (`var(--brand-primary)`, `var(--success)`, `var(--text-secondary)`, `var(--surface-2)`).
- **FloatingCards** hardcoded `#8b5cf6`, `#6d28d9` → `var(--brand-primary)`.
- **AIInsightsPanel** inline `rgba(255,255,255,...)` → `rgb(var(--color-primary-rgb) / 0.15)` (and border).
- **Modal dialog** background → `var(--surface-1)`, border → `var(--border-subtle)` (no default white).
- **Conditional light/dark styling** in BellaScreen wrapper, footer, input area, phase badges, sliders — replaced with single rules using `var(--surface-1)`, `var(--surface-2)`, `var(--text-primary)`, `var(--border-subtle)` where applicable.

---

## 3. What Was Rebuilt

### Single source of truth (CSS variables)
- **`src/theme/utils.ts`**
  - `applyThemeToDOM(colors)` now sets:
    - `--surface-1`, `--surface-2` (alias to background/surface).
    - `--danger`, `--success`.
    - `--color-success-rgb`, `--color-warning-rgb` (for opacity use).
  - `clearThemeFromDOM()` updated to clear these.

- **`src/theme/tokens.css`**
  - `:root`: `--surface-1`, `--surface-2`, `--danger`, `--success` (light defaults).
  - `.dark`: same variables with dark defaults; legacy tokens (e.g. `--color-background`, `--enroll-*`) overridden so dark mode works before React.

### Theme provider (unchanged structurally)
- **ThemeProvider** already:
  - Fetches company theme (via UserContext → `setCompanyBranding(companyName, branding_json, logo_url)`).
  - Resolves theme from `themeManager.getTheme()` (uses `branding_json` when present).
  - Applies `.light` / `.dark` on `document.documentElement`.
  - Calls `applyThemeToDOM(currentColors)` so variables come from company + light/dark.
  - Persists mode in `localStorage`; no reload needed.

### Component refactors
- **Dashboard cards:** All use `bg-[var(--surface-1)]` (no white).
- **QuickActionsCard:** Icons use `var(--brand-primary)`, `var(--success)`, `var(--color-warning)`, `var(--text-secondary)`, `var(--surface-2)` and matching RGB vars for backgrounds.
- **BellaScreen:** Uses `useTheme()`; `isDarkMode = effectiveMode === "dark"`; theme toggle calls `setMode(isDarkMode ? "light" : "dark")`. Wrapper and layers use `var(--surface-1)`, `var(--surface-2)`, `var(--text-primary)`, `var(--border-subtle)` only; no hex/rgba or conditional light/dark classes for colors.
- **Modal:** `.modal-dialog` uses `var(--surface-1)`, `var(--border-subtle)`, `var(--text-primary)`.

---

## 4. Final Theme Structure

### Flow
1. User logs in → UserContext loads company (including `branding_json`).
2. `setCompanyBranding(companyName, branding_json, logo_url)` runs.
3. ThemeContext resolves theme (themeManager + optional `branding_json`); `effectiveMode` (light/dark) picks `currentColors`.
4. `applyThemeClass(effectiveMode)` sets `.light` or `.dark` on `<html>`.
5. `applyThemeToDOM(currentColors)` sets all CSS variables on `document.documentElement`.
6. Every component uses only these variables (or Tailwind classes that map to them). No component branches on “is dark” for colors.

### Semantic variables (single source of truth)
| Variable           | Purpose                |
|--------------------|------------------------|
| `--surface-1`     | Page/main background   |
| `--surface-2`     | Cards, panels, inputs  |
| `--text-primary`  | Primary text           |
| `--text-secondary`| Secondary/muted text   |
| `--border-subtle` | Borders, dividers      |
| `--brand-primary` | Primary brand          |
| `--brand-hover`   | Hover state            |
| `--brand-active`  | Active/pressed state   |
| `--danger`        | Danger/error           |
| `--success`       | Success                |

Legacy names (`--color-primary`, `--color-background`, `--enroll-*`, etc.) are still set from the same palette so existing code keeps working.

### Files touched
- **Engine:** `src/theme/utils.ts`, `src/theme/tokens.css`
- **Layout/global:** `src/index.css` (modal-dialog)
- **Dashboard:** HeroEnrollmentCard, QuickActionsCard, LearningResourceCard, PersonalizedScoreCard, GoalSimulatorCard, RecentTransactionsCard, PortfolioTable, RateOfReturnCard, PlanOverviewCard, DashboardCard, Dashboard.tsx
- **Pre-enrollment:** FloatingCards
- **Bella:** BellaScreen.tsx (theme sync, removal of conditional colors)
- **Modals/portals:** Modal styles use theme vars; portals inherit from `document.documentElement`.

### What to avoid
- Do not add `bg-white`, `bg-gray-*`, `text-gray-*`, `border-gray-*`.
- Do not add inline hex/rgba for UI colors; use `var(--…)` or Tailwind theme classes.
- Do not add component-level “if dark then …” for colors; dark is handled by variable values and `.dark` on `<html>`.

---

## 5. Validation Checklist

**Light mode**
- No dark containers; cards/panels use `--surface-1` / `--surface-2`.
- Contrast and brand consistent.

**Dark mode**
- No white cards; same variables, different values.
- Text uses `--text-primary` / `--text-secondary`; no low-contrast hardcoded grays.
- Borders use `--border-subtle`.

**Switching**
- Toggling light/dark updates entire UI (no reload).
- Changing company (branding_json) updates colors and logo via existing ThemeProvider flow.

**Portals/modals**
- Modals and portals inherit theme; dialog uses `--surface-1` and `--border-subtle`.
