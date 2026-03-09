# Figma-to-Production Integration Rules

Use this document whenever translating Figma Make (or any Figma-exported) app code into production for the Retirement Participant Portal. These rules protect the global theme, white-label branding, dark mode, and existing design system.

---

## Rule 1 — Never copy raw Figma components into production

- Do **not** copy components from `figma-dump` (or any Figma export) into `src/components`, `src/pages`, or `src/features`.
- Use Figma output as **reference only**. Reimplement behavior and layout using **existing** app components and patterns.
- If a pattern does not exist, add it in the appropriate layer (e.g. a new primitive in `src/components/ui` or a feature component) and follow existing token and layout conventions.

---

## Rule 2 — Replace all hex colors with CSS variables

- Production UI must not use hardcoded hex (e.g. `#3b82f6`, `#0f172a`) in components or styles.
- Map every color to an existing token, for example:
  - **Backgrounds:** `var(--color-background)`, `var(--color-surface)`, `var(--enroll-bg)`, `var(--enroll-card-bg)`
  - **Text:** `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--enroll-text-primary)`
  - **Borders:** `var(--color-border)`, `var(--enroll-card-border)`
  - **Brand / accent:** `var(--color-primary)`, `var(--enroll-brand)`, `var(--enroll-accent)`
  - **Status:** `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)`
- Token definitions live in `src/theme/tokens.css` and `src/styles/tokens.css`; theme overrides (including white-label) are applied via `ThemeContext` and `theme/utils.ts` to `document.documentElement`. Do not introduce new token files without an architecture decision.

---

## Rule 3 — Replace gradients with token-based values

- Do not paste raw gradient definitions (e.g. `linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)`) into production.
- Use existing gradient tokens where they exist, e.g.:
  - `var(--banner-gradient)`, `var(--contrib-section-heading-bar)`, `var(--contrib-ai-banner-bg)`, `var(--enroll-plan-overview-bg)`
- If a gradient has no token, extend the **existing** token set in `theme/tokens.css` or `styles/tokens.css` (and document it); do not add one-off inline gradients in components.

---

## Rule 4 — Use existing layout wrappers

- **App shell:** All authenticated content is rendered under `RootLayout` (see `src/app/router.tsx`).
- **Dashboard / standard pages:** Use `DashboardLayout` with optional `header` and `subHeader`. Do not introduce a new top-level layout for Figma screens.
- **Enrollment wizard:** Use `EnrollmentLayout` and step routes under `/enrollment/*`. Step content uses `EnrollmentPageContent` and the shared enrollment stepper/footer. Do not duplicate enrollment layout or step flow.
- **Transparent background (enrollment steps):** Use `DashboardLayout` with `transparentBackground` when the page provides its own full-bleed background (e.g. enrollment steps).

---

## Rule 5 — Use existing contexts

- **Theme / branding:** Use `ThemeContext` (`useTheme`). Do not add a parallel theme or brand context for Figma-driven screens.
- **Enrollment state:** Use `EnrollmentContext` (`useEnrollment`) for wizard state. Do not duplicate enrollment state in local or alternate stores for Figma flows.
- **Auth / user:** Use `AuthContext`, `UserContext` for session and profile. Routing and guards use `ProtectedRoute`.
- **AI / Core AI:** Use `CoreAIModalContext`, `AISettingsContext` as defined. Do not wire Figma UI to a different AI or modal system.

---

## Rule 6 — Do not introduce duplicate components

- **Buttons:** Use `src/components/ui/Button.tsx` or the auth-specific `AuthButton` where appropriate. Do not add a new generic “Figma Button” or duplicate primary/secondary variants elsewhere.
- **Cards:** Use `src/components/ui/card.tsx` (Card, CardContent, etc.) or existing feature cards (e.g. dashboard, enrollment). Do not add a parallel “Figma Card” primitive.
- **Inputs:** Use `src/components/ui/Input.tsx`, `PasswordInput`, or auth inputs. Do not add duplicate text input primitives.
- **Modals:** Use `src/components/ui/Modal.tsx` or existing feature modals. Do not add a new base modal for Figma screens.
- If the design requires a variant (e.g. a new card style), extend the existing component or add a variant in the same file/layer; do not create a second design-system layer.

---

## Rule 7 — Preserve dark mode and white-label support

- **Dark mode:** The app uses class-based switching (`.light` / `.dark` on `document.documentElement`) and token overrides in `theme/dark.css`, `theme/enrollment-dark.css`, and `styles/tokens.css`. All new or modified UI must use semantic tokens so dark overrides apply; no light-only hex or fixed colors.
- **White-label:** Brand colors, logo, and typography are driven by `ThemeContext` and `themeManager` (company theme from DB or default map). New screens must not hardcode brand colors or logos; use `var(--color-primary)`, `var(--enroll-brand)`, `var(--logo-url)`, etc., so tenant branding continues to apply.

---

## Summary

| Do | Don’t |
|----|--------|
| Use `figma-dump` as reference only | Import or copy from `figma-dump` into production |
| Map all colors to existing CSS variables | Use hex or raw rgb in UI |
| Use existing gradient tokens | Paste raw gradient definitions |
| Use DashboardLayout / EnrollmentLayout | Introduce new root or step layouts |
| Use ThemeContext, EnrollmentContext, etc. | Add parallel theme/enrollment contexts |
| Use existing Button, Card, Input, Modal | Create duplicate primitives |
| Rely on tokens for theme and dark mode | Hardcode light-only or tenant-specific values |
