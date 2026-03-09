# Enrollment V2 ↔ Figma UI Parity Report

**Generated:** Phase 1–2 (screenshots captured, implementation analyzed)

## Screenshots Captured (Phase 1)

| Step            | File                 | Location                                      |
|----------------|----------------------|-----------------------------------------------|
| Plan           | `plan.png`           | `src/figma-dump/screenshots/plan.png`        |
| Contribution   | `contribution.png`   | `src/figma-dump/screenshots/contribution.png` |
| Auto Increase  | `auto-increase.png`  | `src/figma-dump/screenshots/auto-increase.png`|
| Investment     | `investment.png`     | `src/figma-dump/screenshots/investment.png`   |
| Readiness     | `readiness.png`      | `src/figma-dump/screenshots/readiness.png`    |
| Review        | `review.png`         | `src/figma-dump/screenshots/review.png`      |

---

## Figma Component Map (Phase 3)

### Plan Page (Choose Plan)
| Figma section              | enrollment-v2 equivalent     | Status        |
|----------------------------|------------------------------|---------------|
| Step indicator             | EnrollmentStepper (parent)   | ✅            |
| Plan selection cards       | `PlanCardV2`                 | ✅            |
| Key benefits chips         | PlanCardV2 benefits list     | ✅            |
| Selected state indicator   | PlanCardV2 badge + border    | ✅            |
| Ask AI button              | PlanCardV2 `onAskAI`         | ✅            |
| **Need help deciding?**    | —                            | ⬜ **Added**  |
| View Detailed Comparison   | —                            | ⬜ **Added**  |

### Contribution Page
| Figma section           | enrollment-v2 equivalent      | Status |
|-------------------------|-------------------------------|--------|
| AI insight banner       | ContributionLayoutV2 banner  | ✅     |
| Quick contribution chips| 4% / 6% / 15% presets        | ✅     |
| Contribution slider     | Slider + % / $ toggle        | ✅     |
| Tax strategy split       | SourceRow + split bar        | ✅     |
| Projection card          | Right column projection      | ✅     |
| Contribution summary     | Paycheck impact + bar        | ✅     |
| Grid (left/right)        | `lg:grid-cols-3`             | ✅     |

### Auto Increase Page
| Figma section        | enrollment-v2 equivalent     | Status |
|----------------------|------------------------------|--------|
| Education screen     | AutoIncreaseLayoutV2 phase   | ✅     |
| AI insight           | Banner with difference $     | ✅     |
| Keep it Steady / Grow | Two cards                   | ✅     |
| Configure: slider    | increaseAmount + chart       | ✅     |

### Investment Page
| Figma section           | enrollment-v2 equivalent     | Status        |
|-------------------------|------------------------------|---------------|
| AI Recommendation       | aiRecommendationText banner  | ✅            |
| Risk profile cards       | ProfileCardV2 grid          | ✅            |
| **Allocation Summary**   | —                            | ⬜ **Added**  |
| **Feature bullets**      | —                            | ⬜ **Added**  |
| (Need Expert Help?)      | Optional CTA                | ✅ (optional) |

### Readiness Page
| Figma section           | enrollment-v2 equivalent     | Status |
|-------------------------|------------------------------|--------|
| Readiness score circle  | ReadinessLayoutV2 circle     | ✅     |
| Understanding your score| understandingText            | ✅     |
| AI Recommendations      | improvement cards            | ✅     |
| Apply buttons           | improvement cards CTA        | ✅     |

### Review Page
| Figma section        | enrollment-v2 equivalent     | Status |
|----------------------|------------------------------|--------|
| “You're Almost Done!”| title from page              | ✅     |
| Plan overview card   | planOverviewCells grid       | ✅     |
| Disclaimer           | planDisclaimer               | ✅     |
| Readiness / Contrib  | SummarySectionV2             | ✅     |
| Auto-Increase        | SummarySectionV2             | ✅     |
| Asset allocation     | AllocationCardV2             | ✅     |
| Terms + Confirm      | checkbox + button            | ✅     |

---

## Missing Components (Before Fixes)

1. **Choose Plan:** “Need help deciding?” block with “View Detailed Comparison” CTA.
2. **Investment:** Right column “Allocation Summary” disclaimer and feature bullets (Automatic Rebalancing, Professional Management, Change Anytime).

---

## Layout / Hierarchy Notes

- **Contribution:** Grid already matches Figma (left: AI + contribution card + tax strategy; right: projection + summary). No change.
- **Investment:** Right column was minimal; added Allocation Summary + feature bullets to match Figma.
- **Review:** Plan overview uses simple grid; Figma uses per-cell icons and gradient card. Optional enhancement (tokens) can be done later.

---

## Architecture Confirmation

- **EnrollmentContext** — not modified.
- **enrollmentDraftStore** — not modified.
- **enrollmentStepPaths** — not modified.
- **planEnrollmentAgent** — not modified.
- **ThemeContext / AuthContext / Supabase** — not modified.
- No new state stores. State remains `useEnrollment()` and `useContributionStore()`.
- Navigation remains via `EnrollmentFooter`.

---

## Components Created

- None new. Reused existing `HelpSectionCard` for “Need help deciding?”.

## Components Modified

- `src/enrollment-v2/pages/ChoosePlanPage.tsx` — added HelpSectionCard block.
- `src/enrollment-v2/components/InvestmentLayoutV2.tsx` — added right-column Allocation Summary + feature bullets.

## Layout Fixes

- Choose Plan: bottom section (HelpSectionCard) added to match Figma.
- Investment: right column expanded with Allocation Summary + feature bullets; grid unchanged.
- All new UI uses CSS variables; responsive and dark-mode safe.

---

## Phase 9 — Final Output Summary

### 1. Screenshots captured
- `src/figma-dump/screenshots/plan.png`
- `src/figma-dump/screenshots/contribution.png`
- `src/figma-dump/screenshots/auto-increase.png`
- `src/figma-dump/screenshots/investment.png`
- `src/figma-dump/screenshots/readiness.png`
- `src/figma-dump/screenshots/review.png`

### 2. UI parity report
- This document (`docs/ENROLLMENT_V2_UI_PARITY_REPORT.md`).

### 3. Components created
- None (reused `HelpSectionCard`).

### 4. Components modified
- `src/enrollment-v2/pages/ChoosePlanPage.tsx` — HelpSectionCard section.
- `src/enrollment-v2/components/InvestmentLayoutV2.tsx` — Right column Allocation Summary + feature bullets.

### 5. Layout fixes applied
- Choose Plan: "Need help deciding?" block added.
- Investment: right column content expanded.

### 6. Architecture untouched
- EnrollmentContext, enrollmentDraftStore, enrollmentStepPaths, planEnrollmentAgent, ThemeContext, AuthContext, Supabase: **not modified**.
- State: **useEnrollment()**, **useContributionStore()** only.
- Navigation: **EnrollmentFooter** only.
- No new state stores.
