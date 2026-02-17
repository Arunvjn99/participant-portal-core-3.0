# Phase 1 — Enrollment Design System Analysis

**Source:** Enrollment flow components, `src/theme/tokens.css`, `src/index.css` (enrollment-footer, preset-pills).  
**Scope:** Card system, shadows, radius, padding, typography, stepper, buttons, forms, layout, tokens.  
**Do not modify enrollment files; use as reference only.**

---

## 1. Token usage (`--enroll-*` and related)

| Token | Purpose |
|-------|--------|
| `--enroll-bg` | Page background (#f8fafc) |
| `--enroll-brand` | Primary CTA, active state (#4f46e5) |
| `--enroll-brand-rgb` | 79 70 229 (for rgba) |
| `--enroll-text-primary` | Headings, primary text (#0f172a) |
| `--enroll-text-secondary` | Body, labels (#475569) |
| `--enroll-text-muted` | Helper, placeholder (#94a3b8) |
| `--enroll-card-bg` | Card background (#ffffff) |
| `--enroll-card-border` | Card border (#e2e8f0) |
| `--enroll-card-radius` | Card corner radius (16px) |
| `--enroll-soft-bg` | Soft panels (#f1f5f9) |
| `--enroll-elevation-1` | Light shadow: 0 1px 2px rgba(0,0,0,0.04) |
| `--enroll-elevation-2` | Medium: 0 4px 12px rgba(0,0,0,0.06) |
| `--enroll-elevation-3` | Strong: 0 8px 24px rgba(0,0,0,0.08) |
| `--txn-brand-soft` | rgb(79 70 229 / 0.08) — soft brand tint |
| `--txn-card-radius` | Alias to --enroll-card-radius |
| `--txn-elevation` | Alias to --enroll-elevation-2 |

---

## 2. Shadow system (elevation)

- **Enrollment:** Uses `--enroll-elevation-1 | 2 | 3`. No raw Tailwind `shadow-md` / `shadow-lg` in token-aligned components.
- **Dashboard/heroui:** `--heroui-card-shadow`, `--heroui-card-hover-shadow` (light).
- **Rule:** Page background = no shadow. Primary cards = `--enroll-elevation-2`. Nested panels = lighter (`--enroll-elevation-1`).

---

## 3. Card hierarchy

- **Primary card:** Same as Enrollment main step cards — `background: var(--enroll-card-bg)`, `border-color: var(--enroll-card-border)`, `border-radius: var(--enroll-card-radius)`, `box-shadow: var(--enroll-elevation-2)`.
- **TransactionStepCard:** Already matches (rounded-[var(--enroll-card-radius)], border, --enroll-elevation-2).
- **Nested card / panel:** Softer background `--enroll-soft-bg`, border `--enroll-card-border`, no or light shadow.

---

## 4. Border radius

- **Scale (tokens.css):** `--radius-xs` (2px) → `--radius-2xl` (16px), `--radius-full` (9999px).
- **Enrollment cards:** 16px via `--enroll-card-radius`.
- **Buttons / inputs:** 8px typical (e.g. footer buttons in CSS use border-radius: 8px).

---

## 5. Padding scale

- **Spacing scale:** 4px base (`--spacing-1`) through 80px (`--spacing-20`). Common: 8, 12, 16, 24, 32.
- **Enrollment page:** `py-8 md:py-10`, `px-4 md:px-6`, `max-w-[1200px]`, header `mb-8`.
- **Enrollment footer:** `padding: var(--spacing-4) var(--spacing-6)`, desktop `var(--spacing-8)` sides.
- **Card content:** `p-4 sm:p-6 md:p-8` (DashboardCard); TransactionStepCard uses `p-4 sm:p-6 md:p-8`.

---

## 6. Typography scale

- **Page title:** `text-[28px] md:text-[32px] font-bold`, color `--enroll-text-primary`.
- **Subtitle:** `text-base`, `mt-1.5`, color `--enroll-text-secondary`.
- **Section / card title:** `text-lg font-semibold`, `--enroll-text-primary`.
- **Body / labels:** `text-sm`, `--enroll-text-secondary` or `--enroll-text-muted`.
- **Helper / disclaimer:** `text-sm` or `0.9375em`, `--enroll-text-muted`.
- **Small caps / labels:** `text-xs font-medium uppercase`, `--enroll-text-muted`.

---

## 7. Stepper styling (Enrollment reference)

- **EnrollmentStepper:** Completed = emerald (green) + check; Current = indigo + icon + ring; Upcoming = grey outline. Connector: completed = solid emerald; else dotted grey.
- **Token equivalent for Transactions:** Completed = `--color-success` (emerald); Active = `--enroll-brand` (indigo) + ring; Upcoming = `--enroll-card-border`, background `--color-background` or `--enroll-card-bg`.
- **Transaction flow stepper:** Uses progress bar + step indicators. Indicators already use `--enroll-brand` for active/completed; for visual parity with Enrollment, completed can use `--color-success`.

---

## 8. Button hierarchy

- **Primary (enrollment-footer__primary):** Background `--color-primary` (or align to `--enroll-brand`), color white, min-height 44px, min-width 160px, border-radius 8px, focus ring 2px `--enroll-brand`.
- **Secondary / Back / Save & Exit:** Transparent or light bg, border `--color-border`, text `--color-text`; hover: `--color-background-secondary`, border `--color-border` or `--enroll-brand` for save-exit.
- **Disabled:** opacity 0.5, cursor not-allowed.
- **Transaction footer:** Already mirrors enrollment; primary uses `--enroll-brand` in CSS.

---

## 9. Form / input styling

- **Inputs:** Border `--enroll-card-border`, background `--enroll-card-bg`, color `--enroll-text-primary`, placeholder `--enroll-text-muted`, radius `var(--radius-lg)` (8px).
- **Focus:** 2px outline/ring with `--enroll-brand` and offset.
- **Labels:** `text-sm font-medium`, `--enroll-text-primary`; spacing above input (e.g. mb-2).
- **Validation / error:** Use `--color-danger`; warning `--color-warning`, background `--color-warning-light`.

---

## 10. Layout rhythm

- **Grid:** Enrollment uses max-width 1200px, mx-auto, px-4 md:px-6.
- **Section gap:** `space-y-6` or `gap: var(--spacing-6)` (24px) between major sections.
- **Card-to-card:** Same 24px (or mb-6 / gap-6).
- **Step content:** Consistent padding inside TransactionStepCard (p-4 sm:p-6 md:p-8).
- **Footer:** Sticky, bottom 0, safe-area inset, same horizontal padding as content.

---

## 11. Background layering

- **Page:** `--enroll-bg`.
- **Primary surface:** `--enroll-card-bg`.
- **Soft / nested:** `--enroll-soft-bg` or `--color-background-secondary`.
- **Transaction stepper container:** Currently `--color-background-secondary`; can stay for parity with “soft” area.

---

## 12. Section separators

- **Borders:** 1px solid `--enroll-card-border` or `--color-border`.
- **Footer top:** border-top 1px solid `--color-border`, light shadow (0 -2px 8px rgba(0,0,0,0.06)).

---

## Summary for Phase 2

- **Cards:** Use only token-based card (TransactionStepCard or equivalent): `--enroll-card-bg`, `--enroll-card-border`, `--enroll-card-radius`, `--enroll-elevation-2`. No `bg-white`, no `border-slate-*`, no `shadow-md`/`shadow-lg`.
- **Shadows:** Only `--enroll-elevation-*` or `--shadow-soft`/`--shadow-medium` (aliases to enroll).
- **Typography:** Only `--enroll-text-primary/secondary/muted` or `--color-text`; no `text-slate-*` / `text-gray-*`.
- **Buttons:** Enrollment footer pattern; primary = brand, secondary = border + background secondary; focus = `--enroll-brand`.
- **Forms:** Token-only borders, backgrounds, focus ring, labels, validation colors.
- **Stepper:** Completed = `--color-success`; Active = `--enroll-brand`; Upcoming = `--enroll-card-border` + light bg.
- **No:** brand-*, emerald-*, amber-*, slate-* classes; no new design tokens; no new shadow values; no modification to enrollment styles.
