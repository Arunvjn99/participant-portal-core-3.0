# Personalize Plan Modal – CSS Refactor (Global Design System)

## 1. Component file path

- **Popup component:** `src/components/enrollment/PersonalizePlanModal.tsx`
- **Modal wrapper:** `src/components/ui/Modal.tsx` (already used; no change)
- **Popup styles:** `src/index.css` (`.premium-wizard*` and `.premium-wizard--figma` block, ~1552–2570)

## 2. Hardcoded styles removed

| Before | After |
|--------|--------|
| `#fff`, `#ffffff` | `var(--color-surface)`, `var(--color-text-inverse)` |
| `#155dfc`, `#4f39f6`, `#2b7fff`, `#ad46ff` | `var(--color-primary)`, `var(--color-primary-hover)` |
| `#101828`, `#1e2939`, `#364153` | `var(--color-text)` |
| `#4a5565`, `#6a7282` | `var(--color-text-secondary)`, `var(--color-text-tertiary)` |
| `#dbeafe`, `#eff6ff`, `#faf5ff`, `#f3e8ff`, `#e9d4ff` | `rgb(var(--color-primary-rgb) / 0.08)` etc. |
| `#e5e7eb`, `#d1d5dc`, `#f3f4f6` | `var(--color-border)`, `var(--color-background-tertiary)` |
| `#f9fafb` | `var(--color-background-secondary)` |
| `#dcfce7`, `#008236` | `rgb(var(--color-success-rgb) / 0.15)`, `var(--color-success)` |
| `#fef9c2`, `#a65f00` | `rgb(var(--color-warning-rgb) / 0.15)`, `var(--color-warning)` |
| `rgba(255,255,255,0.9)` | `rgb(var(--color-text-inverse-rgb) / 0.9)` |
| `rgba(21,93,252,0.2)` | `rgb(var(--color-primary-rgb) / 0.2)` |
| `linear-gradient(..., #155dfc, #4f39f6)` | `linear-gradient(..., var(--color-primary), var(--color-primary-hover))` |
| `border-radius: 14px`, `10px`, `4px` | `var(--radius-2xl)`, `var(--radius-lg)`, `var(--radius-sm)` |
| `border-radius: 24px` (dialog) | `var(--radius-2xl)` |
| `box-shadow: 0 25px 50px...` | `var(--shadow-xl)` |
| `box-shadow: 0 1px 3px...` | `var(--shadow-sm)` |
| `box-shadow: 0 10px 15px #bedbff...` | `rgb(var(--color-primary-rgb) / 0.25)` etc. |
| `padding: 16px 24px` (footer) | `var(--spacing-4) var(--spacing-6)` |
| `gap: 12px` | `var(--spacing-3)` where appropriate |

## 3. Tokens used

- **Colors:** `--color-primary`, `--color-primary-hover`, `--color-primary-active`, `--color-primary-rgb`, `--color-text`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`, `--color-text-inverse-rgb`, `--color-surface`, `--color-border`, `--color-background-secondary`, `--color-background-tertiary`, `--color-success`, `--color-success-rgb`, `--color-warning`, `--color-warning-rgb`
- **Radius:** `--radius-sm`, `--radius-lg`, `--radius-2xl`, `--radius-full`
- **Spacing:** `--spacing-3`, `--spacing-4`, `--spacing-6`
- **Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-xl`
- **Wizard-specific (unchanged):** `--wizard-accent`, `--wizard-border`, `--wizard-text`, `--wizard-text-muted`, `--wizard-success`

## 4. Dark mode

- All updated rules use theme variables. When `.dark` is applied (e.g. on `html` or `body`), `src/theme/dark.css` overrides `--color-*`, `--shadow-*`, etc., so the popup follows the dark theme without new `.dark .premium-wizard*` overrides.

## 5. Validation

1. Start dev server and open dashboard.
2. Open the retirement personalization popup (e.g. from Choose Plan or enrollment flow).
3. Check: header gradient, body/card backgrounds, text and border colors, spacing, radius, and CTA/footer.
4. Toggle dark mode and confirm the popup uses dark backgrounds and readable text.

## 6. Confirmation

The retirement personalization popup now uses the global CSS design system: colors, gradients, borders, radius, spacing, and shadows are token-based and theme-aware. UI layout and behavior are unchanged; only styling is aligned with the rest of the participant portal.
