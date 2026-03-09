# UI Refactor Summary

**Date:** March 8, 2025  
**Reference:** Phase 1 audit in `docs/ui-audit-report.md`

---

## 1. Files Updated

### Design system (tokens & typography)

| File | Change |
|------|--------|
| `src/styles/tokens.css` | Added global semantic aliases (`--color-primary-light`, `--color-card`). Added typography utility classes: `.text-heading-xl`, `.text-heading-lg`, `.text-heading-md`, `.text-heading-sm`, `.text-body`, `.text-body-sm`, `.text-caption`. |

### Dashboard

| File | Change |
|------|--------|
| `src/layouts/DashboardLayout.tsx` | Replaced `bg-gray-50` with `bg-[var(--color-background-secondary)]` for theme/dark support. |
| `src/pages/dashboard/PreEnrollmentDashboard.tsx` | Added `useTranslation`; section title "Need help deciding?" now uses `t("enrollment.needHelpDecidingTitle")`. |
| `src/components/pre-enrollment/HeroSection.tsx` | Replaced hardcoded gray text with token-based and typography classes: `text-[var(--color-text-secondary)]`, `text-body-sm`, `text-heading-md`, `text-body`. |

### Enrollment flow

| File | Change |
|------|--------|
| `src/enrollment-v2/components/NeedInvestmentHelpCard.tsx` | i18n for title, subtitle, and buttons via `t("enrollment.needInvestmentHelp")`, `t("enrollment.chatWithAI")`, `t("enrollment.chatNow")`, `t("enrollment.connect")`. Replaced hex/gradient and blue Tailwind with `var(--color-primary)`, `var(--shadow-lg)`, `rounded-xl`. Typography: `text-heading-sm`, `text-caption`. Button styles use `var(--color-surface)`, `var(--color-primary)`, `var(--color-background-secondary)`. |
| `src/enrollment-v2/components/ContributionLayoutV2.tsx` | Added `useTranslation`. Replaced "You", "Employer", "Total" with `t("enrollment.you")`, `t("enrollment.employer")`, `t("enrollment.total")`. Replaced "Done" / "Edit Contribution Split" with `t("enrollment.done")`, `t("enrollment.editContributionSplit")`. Replaced `border-gray-200 bg-white` / `bg-gray-50` with `border-[var(--color-border)]`, `bg-[var(--color-surface)]`, `bg-[var(--color-background-secondary)]` for theme/dark. Used `text-body-sm` for labels. |

### Locales

| File | Change |
|------|--------|
| `src/locales/en/enrollment.json` | Added keys: `needInvestmentHelp`, `chatWithAI`, `gotIt`, `you`, `employer`, `total`, `allocationBySource`, `allocation`, `youBelongTo`, `edit`, `chatNow`, `connect`. |

---

## 2. Tokens Applied

- **Background:** `--color-background-secondary` (dashboard layout, contribution cards), `--color-surface` (cards), `--color-primary-light` (alias in `styles/tokens.css`).
- **Border:** `--color-border` (cards, layout).
- **Text:** `--color-text-primary`, `--color-text-secondary` (HeroSection, typography utilities).
- **Primary / CTA:** `--color-primary`, `--color-primary-hover` (NeedInvestmentHelpCard gradient and button text).
- **Shadows:** `--shadow-lg` (NeedInvestmentHelpCard).
- **Radius:** Replaced arbitrary `rounded-[14px]` with `rounded-xl` where it aligns to the design scale.

Existing theme tokens in `src/theme/tokens.css` and `src/styles/tokens.css` remain the source of truth; new/updated components use these variables instead of hex or Tailwind color classes.

---

## 3. Typography Scale

Utility classes added in `src/styles/tokens.css`:

| Class | Intended use |
|-------|----------------|
| `.text-heading-xl` | Hero / page title |
| `.text-heading-lg` | Section title |
| `.text-heading-md` | Card title / subtitle |
| `.text-heading-sm` | Small heading / label |
| `.text-body` | Default body |
| `.text-body-sm` | Secondary body / small copy |
| `.text-caption` | Captions, hints, metadata |

All use `var(--color-text-primary)` or `var(--color-text-secondary)` and existing `--font-size-*` / `--font-weight-*` from `styles/tokens.css`. Applied in HeroSection and enrollment-v2 components refactored in this pass.

---

## 4. Components Standardized

- **Dashboard layout:** Uses token-based background; no raw gray.
- **HeroSection:** Uses typography classes and text tokens; no raw `text-gray-*`.
- **NeedInvestmentHelpCard:** Uses tokens for container, buttons, and text; still uses native `<button>` (full migration to `@/components/ui/Button` can be a follow-up).
- **ContributionLayoutV2:** Uses tokens for cards and labels; continues to use `Button` from `@/components/ui/Button` where already present.

Shared `Button`, `Card`, `Input`, `Modal` were not changed in this pass. The audit report lists remaining spots where raw `<button>` and ad-hoc card wrappers can be replaced by these components in a later phase.

---

## 5. i18n Coverage

- **PreEnrollmentDashboard:** Section title uses `t("enrollment.needHelpDecidingTitle")`.
- **NeedInvestmentHelpCard:** Title, subtitle, and both button labels use enrollment keys.
- **ContributionLayoutV2:** "You", "Employer", "Total", "Done", "Edit Contribution Split" use enrollment keys.

New keys added in `src/locales/en/enrollment.json` for the above and for future use: `needInvestmentHelp`, `chatWithAI`, `gotIt`, `you`, `employer`, `total`, `allocationBySource`, `allocation`, `youBelongTo`, `edit`, `chatNow`, `connect`.

Remaining hardcoded strings (e.g. in EnrollmentConfirmModal, AllocationSummaryChart, AllocationBySourceCard, InvestmentSummaryCard, ContributionProjectionCard, WizardFooter, AgentModeLab) are listed in the audit report and can be moved to i18n in a follow-up.

---

## 6. Dark Mode

- **DashboardLayout:** Background uses `--color-background-secondary`, which is overridden in `.dark` in `theme/tokens.css`, so dark mode is supported.
- **ContributionLayoutV2:** Replaced `bg-white dark:bg-[var(--surface-1)]` and `border-gray-200 dark:border-[var(--border-subtle)]` with single token-based classes `bg-[var(--color-surface)]` and `border-[var(--color-border)]`, so light/dark switching is driven entirely by theme variables.
- **NeedInvestmentHelpCard:** Gradient and buttons use CSS variables that resolve correctly in both themes.

---

## 7. What Was Not Changed

- **Routing, state, API, Supabase, business logic:** Unchanged; only UI structure and styling were updated.
- **Remaining enrollment-v2 components:** AllocationSummaryChart, AllocationBySourceCard, InvestmentSummaryCard, InvestmentStrategyCard, ContributionProjectionCard, EnrollmentConfirmModal, and others still contain hardcoded colors/strings listed in the audit; they can be refactored in the same way in a follow-up.
- **index.css:** No edits in this pass; the audit notes many hex/rgba usages there that can be gradually replaced with tokens.
- **figma-dump:** Left as reference; not part of the production refactor.

---

## 8. Suggested Next Steps

1. Replace remaining hardcoded colors and strings in enrollment-v2 and wizard components using the same pattern (tokens + i18n).
2. Migrate raw `<button>` elements to `@/components/ui/Button` with variants (primary, secondary, outline) as in the audit.
3. Use shared `Card` (or a token-based card wrapper) for all card-style containers.
4. Align arbitrary spacing (e.g. `p-5`, `rounded-[14px]`) to the spacing/radius scale (e.g. `--spacing-*`, `--radius-*`).
5. Add or extend Spanish (and other) locale entries for the new enrollment keys.

---

*Refactor performed incrementally: Dashboard → Pre-enrollment → Enrollment flow (ContributionLayoutV2, NeedInvestmentHelpCard). Audit report: `docs/ui-audit-report.md`.*
