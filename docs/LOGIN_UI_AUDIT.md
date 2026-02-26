# Login Page — Structured UI Audit

## STEP 1 — Code Audit

### 1.1 Login Page File
- **File:** `src/pages/auth/Login.tsx`
- **Structure:** Uses `AuthLayout` → `AuthRightPanel` wraps `AuthFormShell` with `headerSlot`, `title`, `bodySlot`. `bodySlot` = `standardBody` (JSX fragment containing detected logo, network warning, **error**, form fields, Login button, divider, **Explore Demo button**, secondary links).
- **Demo:** `showDemoPanel` state; "Explore Demo Scenarios" button (lines 208–223) opens modal with persona list. Modal and `handleDemoLogin` logic remain; only button position changes.

### 1.2 Footer Component
- **Where defined:** `src/components/auth/AuthFooter.tsx`
- **Where used:** Rendered inside `src/components/auth/AuthRightPanel.tsx` (last child, below the scrollable card area).
- **Structure:** `<footer className="flex w-full flex-shrink-0 justify-center bg-transparent px-4 py-6 md:px-8 lg:px-12">` with inner `<div className="flex w-full max-w-[420px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">`. Three children: copyright (order-1), Privacy link (order-2), CORE logo img (order-3, `sm:justify-end`).
- **Logo in footer:** `<img src={core.src} alt={core.label} className="h-8 w-auto object-contain" />` — size controlled by `h-8` in AuthFooter.

### 1.3 CORE Logo
- **Login card header:** `headerSlot = <Logo className="h-10 w-auto" />` in Login.tsx (line 128). `Logo` → `CoreProductBranding` with `imgClassName` from props; default in Logo is `"h-10 w-auto object-contain mb-2"`. So card header logo is **h-10**.
- **Footer:** `AuthFooter` uses `<img ... className="h-8 w-auto object-contain" />` (branding.footer.core.src).
- **Logo size control:** Login header = `h-10` in Login.tsx and in Logo/CoreProductBranding default; footer = `h-8` in AuthFooter.tsx.

### 1.4 Error Handling
- **Where rendered:** Login.tsx lines 151–158, inside `standardBody`: `{error && <div role="alert" ...>{error}</div>}`.
- **Position:** Rendered **above** the form (before the `<div className="flex flex-col gap-6">` that contains email, password, Login button). So error appears **above** the login title’s content block (after title "Login") and above all inputs and button.
- **Logic:** Single `error` state; set by validation ("Please enter your email and password") or by `signIn` catch. No field-specific errors in current code.

### 1.5 Explore Demo
- **Where:** Login.tsx lines 206–223: button "Explore Demo Scenarios" inside the login card, after the "or" divider and before "Don't have an account?".
- **Behavior:** `onClick={() => setShowDemoPanel(true)}`; modal at lines 264–358. Demo navigation (persona picker, `handleDemoLogin`) is unchanged.

### 1.6 Layout Container Structure
- **AuthLayout:** `flex min-h-screen flex-col lg:flex-row`; left panel 50% on lg, right panel 50% on lg.
- **AuthRightPanel:** `flex min-h-screen flex-col`; top bar (ThemeToggle), then flex-1 centered card with `max-w-[420px] md:max-w-[520px] lg:max-w-[560px]`, then `AuthFooter`.
- **AuthFormShell:** `flex flex-col`; headerSlot (logo), title h1, optional description, bodySlot in a `flex flex-col gap-6`.
- **Card padding:** `CARD_PADDING = "p-6 md:p-8 lg:p-10"` in AuthRightPanel; viewport `VIEWPORT_PX`, `VIEWPORT_PY`.

---

## Summary for Implementation

| Item | Location | Current | Target |
|------|----------|---------|--------|
| Footer alignment | AuthFooter.tsx | flex justify-center; inner max-w 420, sm:justify-between | Flex items-center, justify-between, consistent padding, balanced right section |
| Logo size | Login headerSlot, CoreProductBranding, AuthFooter img | h-10 (header), h-8 (footer) | Reduce header to max-height / smaller; footer modest; no overpowering |
| Explore Demo | Login.tsx standardBody | Button inside card after "or" | Fixed left floating button; outside card; ghost style; responsive hide/reposition |
| Error message | Login.tsx standardBody | Above form (before inputs) | Below Login button (global); keep field-level possibility |
| Responsiveness | — | — | Floating button safe; footer intact; no overflow |

No changes to branding colors, typography, or login logic.

---

## Implementation Summary (Post-Change)

### Files modified
- **`src/components/auth/AuthFooter.tsx`** — Footer alignment and logo size.
- **`src/pages/auth/Login.tsx`** — Logo size, error position, Explore Demo moved to floating button, indentation cleanup.

### Components updated
- **AuthFooter:** Inner container uses same max-width as login card (420 / 520 / 560) for padding rhythm; `flex flex-col sm:flex-row sm:items-center sm:justify-between` for balanced alignment; CORE logo `h-8` → `max-h-6` so it stays secondary to Privacy text.
- **Login:** Header logo `h-10` → `max-h-8 w-auto`; single error block moved from above form to below Login button with `aria-live="polite"`; "Explore Demo Scenarios" removed from card and rendered as a fixed left button (`fixed left-6 bottom-6 z-30`, ghost/outline style, `lg:flex` only so it doesn’t overlap on mobile); demo modal and `handleDemoLogin` unchanged.

### Refactors
- None. Only layout/positioning and one accessibility attribute.

### UX impact
- **Footer:** Aligned with card width and spacing; right section (CORE logo) and baseline alignment consistent; less visual noise.
- **Logo:** Smaller header and footer logos improve hierarchy; title remains primary.
- **Explore Demo:** Moved off the card so the primary CTA is clearer; floating left keeps demo discoverable on desktop without competing with Login.
- **Error:** Shown below the Login button so it doesn’t push the title; same styling; `aria-live` improves screen reader announcements.
- **Responsiveness:** Floating button hidden below `lg`; footer stacks on small screens and aligns on larger ones; no layout shifts or overflow from these changes.
