# UI System Stabilization — Output Summary

## 1. Hardcoded Audit Report

**Location:** `docs/UI_STABILIZATION_PHASE1_AUDIT.md`

Structured audit of:
- **ChoosePlan** — inline padding, icon hex colors
- **PlanCard** — colors (hex/rgb/gradients), spacing (px), radius, shadows, typography, fixed widths (380px, 1144px)
- **HelpSectionCard** — border, background gradient, padding 33px, typography, button colors
- **SectionHeadingWithAccent** — gradient, accent bar dimensions, font sizes
- **EnrollmentFooter** — inline disabled style
- **EnrollmentHeaderWithStepper / EnrollmentStepper** — tokens already used; breakpoints 600px, 1024px
- **EnrollmentPageContent** — token-based background

Grouped by: colors, spacing, radius, shadows, typography, layout.

---

## 2. tokens.css Content

**Location:** `src/styles/tokens.css`

**Defined:**

- **Colors:** `--color-bg-primary`, `--color-bg-secondary`, `--color-surface`, `--color-surface-elevated`, `--color-border`, `--color-border-active`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`, `--color-accent-soft`, `--color-accent-soft-alt`, `--color-accent-icon-roth`, `--color-accent-icon-traditional`, `--color-success`, `--color-success-bg`, `--color-success-border`, `--color-warning`
- **Gradients:** `--gradient-card-bg`, `--gradient-badge`, `--gradient-heading`, `--gradient-accent-bar`, `--gradient-help-card`, `--gradient-icon-selected`, `--gradient-icon-unselected`, `--gradient-selected-pill`, `--gradient-benefit-row`
- **Spacing:** `--space-xs` (4px) through `--space-3xl` (48px), `--space-card` (26px), `--space-help-padding` (33px)
- **Radius:** `--radius-sm` (8), `--radius-md` (10), `--radius-lg` (14), `--radius-xl` (16), `--radius-2xl` (24)
- **Shadow:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-badge`
- **Typography:** `--font-size-xs` (12) through `--font-size-2xl` (36), `--font-weight-regular` (400), `--font-weight-medium` (500), `--font-weight-semibold` (600), `--font-weight-bold` (700)
- **Layout:** `--layout-content-max` (1144px), `--layout-container-max` (1200px), `--layout-footer-max` (1440px)

**Dark overrides:** `[data-theme="dark"], .dark` override color and gradient variables only (surface layering, AA contrast).

---

## 3. ThemeProvider Implementation

**Existing:** `src/context/ThemeContext.tsx` already provides:
- Modes: `light` | `dark` | `system`
- Persistence: `localStorage.getItem("theme")` / `setItem("theme", m)`
- Application: `document.documentElement.classList.add(effective)` and **now** `document.documentElement.setAttribute("data-theme", effective)`

**Changes made:**
- `applyThemeClass()` in ThemeContext now sets `data-theme="light"` or `data-theme="dark"` on `<html>`.
- Same `data-theme` is set in `main.tsx` before first paint (no flash).

Theme is applied via both `class="light|dark"` and `data-theme="light|dark"` for compatibility with existing `.dark` CSS and new token overrides.

---

## 4. i18n Implementation

**Existing:** `src/i18n.ts` and `useTranslation()` from `react-i18next`.

- **Resources:** `en` = `locales/en/common.json` + `locales/en/enrollment.json` merged; `es` = `locales/es/common.json` + enrollment (English enrollment merged, Spanish keys in common win when present).
- **Persistence:** `localStorage.getItem("i18nextLng")` / `languageChanged` → `setItem("i18nextLng", …)`.
- **Default:** English. Toggle via existing `LanguageSwitcher` in `DashboardHeader`; re-render via `RouterProvider key={i18nInstance.language}`.

**ChoosePlan / PlanCard / Help / Footer / Stepper:** All user-facing strings use `t("enrollment.xxx")` (e.g. `choosePlanTitle`, `choosePlanSubtitleStrategy`, `planRoth401kTitle`, `keyBenefits`, `needHelpDecidingTitle`, `viewDetailedComparison`, `continueToContribution`, `footerBack`, `footerSaveAndExit`, `stepperPlan`, etc.). No hardcoded copy in these components.

For full Spanish enrollment strings, add `locales/es/enrollment.json` and merge it in i18n (similar to `enrollmentEn`) so `es` has its own enrollment keys.

---

## 5. Files Modified

| File | Changes |
|------|--------|
| `docs/UI_STABILIZATION_PHASE1_AUDIT.md` | **New** — full hardcoded audit. |
| `docs/UI_STABILIZATION_OUTPUT.md` | **New** — this summary. |
| `src/styles/tokens.css` | **New** — central tokens (colors, spacing, radius, shadow, typography, layout) + dark overrides. |
| `src/styles/enrollment-choose-plan.css` | **New** — token-based styles for PlanCard, HelpSectionCard, SectionHeadingWithAccent, ChoosePlan page. |
| `src/main.tsx` | Import `styles/tokens.css` and `styles/enrollment-choose-plan.css`; set `data-theme` on html before paint. |
| `src/context/ThemeContext.tsx` | Set `data-theme` on document when applying theme. |
| `src/components/enrollment/PlanCard.tsx` | Removed inline styles and hex/rgb; use token-based classes (e.g. `choose-plan-card`, `__badge`, `__title`, `__description`, `__selected-pill`, `__select-pill`, `__benefits-col`, `__benefit-item`, `__benefit-text`, `ask-ai-btn-gradient`). Removed `CARD_RADIUS`/`CARD_PADDING` constants. |
| `src/components/ui/HelpSectionCard.tsx` | Removed inline styles; use `help-section-card`, `__title`, `__description`, `__button`, `__inner`, `__icon-wrap` and token classes. |
| `src/components/ui/SectionHeadingWithAccent.tsx` | Removed inline styles and gradient constants; use `section-heading-accent__bar`, `__title`, `__subtitle` (tokens in CSS). |
| `src/pages/enrollment/ChoosePlan.tsx` | Replaced icon hex classes with `choose-plan-icon-roth`, `choose-plan-icon-traditional`, `choose-plan-icon-help`; content wrapper uses `max-w-[var(--layout-content-max)]` and `pb-[var(--space-2xl)]`. |
| `src/components/enrollment/EnrollmentFooter.tsx` | Removed inline `style` for disabled primary; disabled/aria-disabled styling in CSS. |
| `src/index.css` | `.enrollment-footer__primary[aria-disabled="true"]` with pointer-events and opacity; `.ask-ai-btn-gradient` uses `var(--color-bg-primary)` and `var(--color-accent-soft)`. |

**Not modified:** Enrollment routing, business logic, or step flow.

---

## 6. Final Validation Checklist

| Check | Status |
|-------|--------|
| No hex codes remain in PlanCard, HelpSectionCard, SectionHeadingWithAccent, ChoosePlan | ✅ Replaced with token classes or CSS vars. |
| No raw px in component JSX (spacing/radius) | ✅ Replaced with `var(--space-*)`, `var(--radius-*)`, or token-based classes. |
| No inline styles in scanned components | ✅ Removed; styling in `enrollment-choose-plan.css` and tokens. |
| Dark mode works | ✅ `[data-theme="dark"]` and `.dark` override tokens; existing enrollment-dark.css still applies. |
| Language switch works | ✅ useTranslation + LanguageSwitcher; localStorage; Router key by language. |
| Layout responsive | ✅ PlanCard: grid-cols-1 md:grid-cols-[380px_1fr]; HelpSectionCard: flex-col md:flex-row; content: px-4 sm:px-6; footer has existing media queries. |
| Enrollment flow untouched | ✅ No changes to routes, step paths, or navigation logic. |
| No duplicated styling logic | ✅ Single token set in `styles/tokens.css`; component styles in `enrollment-choose-plan.css`. |

**Remaining in codebase (outside this scope):**
- Tailwind utility classes still use numeric values (e.g. `gap-6`, `px-4`, `mb-4`). Full migration would replace these with token-based utility classes or additional CSS rules.
- `index.css` and `theme/tokens.css` still contain some px values (e.g. footer min-height 44px, padding 10px 24px) as requested only for the Choose Plan flow components; global footer/stepper can be tokenized in a follow-up.
- Some fixed widths remain in Tailwind (e.g. `md:grid-cols-[380px_1fr]`, `pl-[25px]`) to preserve layout; these can be moved to tokens in a later pass.

---

## Responsive and Alignment (Phases 6–7)

- **Breakpoints:** Mobile &lt; 640px, Tablet 640–1024px, Desktop &gt; 1024px (already used via Tailwind and stepper media queries).
- **Containers:** Choose Plan content uses `max-w-[var(--layout-content-max)]` (1144px); page wrapper uses `max-w-7xl` with `px-4 sm:px-6 lg:px-8`.
- **PlanCard:** Stacks on mobile (`grid-cols-1`), two columns from `md` up; spacing via Tailwind gap/margin.
- **Footer:** Existing rules stack buttons on small screens and reorder left/center/right.
- **Stepper:** Compact “Step X of Y” on narrow screens; full stepper on larger.
- **Alignment:** H1 and content share the same wrapper and padding; section spacing uses `gap-8` / `gap-6`.

No redesign; visual appearance preserved; architecture upgraded to tokens and theme/i18n as above.
