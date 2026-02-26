# Floating "Explore Demo Scenarios" Button — Audit

## STEP 1 — Current Implementation

### Component responsible
- **Location:** `src/pages/auth/Login.tsx` (lines 237–251)
- **Type:** Inline `<button>` (no separate component). Rendered as a sibling to `AuthFormShell`, inside `AuthLayout`; demo modal and `handleDemoLogin` unchanged.

### CSS / Tailwind classes applied (current)
- **Position:** `fixed left-6 bottom-6 z-30`
- **Visibility:** `hidden lg:flex` — only visible from `lg` breakpoint; hidden on smaller viewports.
- **Layout:** `items-center gap-2`
- **Shape:** `rounded-lg`
- **Border:** `border border-[var(--color-border)]`
- **Background:** `bg-[var(--color-surface)]/90` — **90% opacity surface** (semi-transparent; can blend with background and feel washed out).
- **Text:** `text-sm text-[var(--color-textSecondary)]` — **secondary text color = low contrast** in default state.
- **Padding:** `px-4 py-2.5`
- **Shadow:** `shadow-sm` — minimal.
- **Transition:** `transition-colors` only (no transform or shadow transition).
- **Hover:** `hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-background)] hover:text-[var(--color-text)]` — visibility and contrast **improve only on hover**, so default state feels hidden.

### Opacity / border / hover usage
- **Opacity:** Background uses `/90` (90% opacity); no opacity-based hiding of the whole button.
- **Border:** Single border with `--color-border` (neutral); no primary tint in default state.
- **Hover-based styling:** Default uses `textSecondary` and neutral border; hover switches to primary border tint, background to `--color-background`, and `--color-text`. So the button is **visually weak until hover**.

### Breakpoints
- **Below `lg`:** Button is **hidden** (`hidden lg:flex`) to avoid overlapping the form; no repositioning.
- **`lg` and up:** Shown as fixed at `left-6 bottom-6` (24px from left and bottom). Not vertically centered; anchored to bottom.

### Summary of issues
1. Default state uses **low-contrast** `textSecondary` and neutral border.
2. Background is **semi-transparent** surface (`/90`), so it can blend with the page.
3. **No brand tint** in default state; brand only appears on hover.
4. **Hover** does most of the work for visibility (border, bg, text change).
5. Icon is 16px with no explicit color (inherits `textSecondary`).
6. No focus ring documented in the class list (browser default or global focus style may apply).
7. Border radius is `rounded-lg`; login card uses `rounded-2xl` (could match for system consistency).

---

## STEP 2 — Redesign Applied

### Changes made
- **Always visible:** Replaced `bg-[var(--color-surface)]/90` and `text-[var(--color-textSecondary)]` with brand-tinted background and primary-colored text (no hover-dependent visibility).
- **Visual weight:** Background `rgb(var(--color-primary-rgb) / 0.12)`, border `rgb(var(--color-primary-rgb) / 0.25)`, `shadow-md`, `rounded-2xl` to match login card, `px-4 py-3`, `gap-2.5` between icon and text.
- **Brand alignment:** Light primary tint (12%), primary border tint (25%), text and icon `color: var(--color-primary)`.
- **Icon:** Size set to 18px; spacing `gap-2.5`; icon inherits primary via `currentColor`.
- **Hover:** `hover:-translate-y-0.5`, `hover:shadow-lg`, `transition-[box-shadow,transform] duration-200`; background/border unchanged so no drastic color shift.
- **Position:** Kept `fixed left-6 bottom-6`; still `hidden lg:flex` so no overlap on small screens.
- **Accessibility:** `focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2`; `aria-label` unchanged.
