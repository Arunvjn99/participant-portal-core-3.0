# Investment Step Rebuild Report

**Date:** 2026-03-04  
**Goal:** Rebuild the Investment step UI to match the Figma mini app while preserving existing application logic.

---

## 1. Components Created

All new components live in `src/enrollment-v2/components/`:

| Component | File | Purpose |
|-----------|------|---------|
| **AIRecommendationBanner** | `AIRecommendationBanner.tsx` | AI recommendation block with gradient (indigo/purple/blue), Sparkles icon, optional "Ask AI" button. Matches Figma "💡 AI Recommendation" banner. |
| **InvestmentStrategyCard** | `InvestmentStrategyCard.tsx` | Strategy card with icon, name, risk label, description; optional target return / age range / timeline grid; allocation bar (stocks/bonds/other); "Recommended" badge; selected state (indigo border + ring); hover/tap motion. |
| **InvestmentSummaryCard** | `InvestmentSummaryCard.tsx` | Right-column summary card for selected strategy: gradient background, "INVESTMENT STYLE", strategy name, risk level bars, "Edit Investment Strategy" button. |
| **AllocationSummaryChart** | `AllocationSummaryChart.tsx` | Donut chart (Recharts Pie), center "100%", "Valid Allocation" badge, fund legend, optional "Estimated at Retirement" block, disclaimer. |

---

## 2. Files Modified

| File | Changes |
|------|---------|
| `src/features/enrollment/investment/InvestmentLayoutV2.tsx` | Rebuilt to use `grid grid-cols-12 gap-8`, `max-w-6xl`; left column (col-span-8): AIRecommendationBanner + InvestmentStrategyCard grid; right column (col-span-4): InvestmentSummaryCard, AllocationSummaryChart, "Your portfolio includes" list. Uses only props; no local state. |
| `src/features/enrollment/investment/InvestmentPage.tsx` | Extended profile options with Figma-style display config: `targetReturn`, `ageRange`, `yearsToRetirement`, `allocation`, `gradient`, `bgGradient`, `riskLevel`, `icon` (Zap, TrendingUp, Target, Shield, DollarSign). Added `estimateRetirementBalance()` and pass `estimatedAtRetirement`, `yearsToRetirement`, `avgReturnPercent` to layout. Added `onEditStrategy` (scroll to strategy cards). No store or context API changes. |

---

## 3. Missing Figma Elements Implemented

| Element | Status |
|---------|--------|
| AI recommendation banner | ✅ `AIRecommendationBanner` with gradient and Ask AI |
| Investment strategy cards | ✅ `InvestmentStrategyCard` with allocation bar, stats grid, recommended badge |
| Selected strategy state | ✅ Indigo border, ring, shadow on selected card |
| Right column investment summary card | ✅ `InvestmentSummaryCard` with gradient and Edit button |
| Allocation summary donut chart | ✅ `AllocationSummaryChart` with Recharts Pie, legend, center "100%" |
| Edit strategy button | ✅ "Edit Investment Strategy" on summary card; scrolls to strategy cards |
| Ask AI interactions | ✅ Optional `onAskAI` prop on banner (caller can wire modal/flow) |
| Animations and hover states | ✅ See §5 |
| Fund Allocation card (Roth/Pretax/After Tax) | ⏸ Not implemented; contribution source allocation remains on Contribution step to avoid duplicating logic. |

---

## 4. Logic Preserved

- **EnrollmentContext:** All investment state still comes from `useEnrollment()`: `state.investmentProfile`, `setInvestmentProfile`, `setInvestmentProfileCompleted`. No new context or state.
- **enrollmentDraftStore:** `loadEnrollmentDraft` / `saveEnrollmentDraft` and `getDraftSnapshot` unchanged; draft still includes `investmentProfile` and `investmentProfileCompleted`.
- **enrollmentStepPaths / stepConfig:** `ENROLLMENT_V2_STEP_PATHS` and footer navigation unchanged.
- **Investment profile type:** Still `RiskTolerance` 1–5 and `InvestmentProfile` from `src/enrollment/types/investmentProfile.ts`. Only display metadata (allocation, target return, icons) added at the page level for UI.

---

## 5. Animations Added

| Location | Animation |
|----------|-----------|
| **AIRecommendationBanner** | Fade-in (opacity + y); subtle opacity pulse on Sparkles icon container (2.5s repeat). |
| **InvestmentStrategyCard** | `whileHover`: scale 1.01, y -2px; `whileTap`: scale 0.99; border/shadow transition 300ms. |
| **InvestmentSummaryCard** | Entry fade-in + y; icon badge spring scale-in; button `whileHover`/`whileTap` scale. |
| **AllocationSummaryChart** | Entry fade-in + y with delay. |
| **Edit Investment Strategy button** | Hover scale 1.02, tap 0.98; gradient hover darkening. |

---

## 6. Layout and Styling

- **Grid:** `grid grid-cols-1 lg:grid-cols-12 gap-8`, `max-w-6xl mx-auto` (aligned with Contribution step).
- **Left column (8):** AI banner + 2-column grid of strategy cards.
- **Right column (4):** Summary card, allocation donut, "Your portfolio includes" list.
- **Surfaces:** Cards use `bg-white`, `border`, `shadow-sm` / `shadow-lg`, `rounded-2xl`; sub-blocks use `bg-gray-50` and `rounded-lg`; dark mode uses `var(--surface-1)`, `var(--border-subtle)`, `var(--text-primary)`, etc.
- **Responsive:** Single column on small screens; 12-col grid and side-by-side summary on `lg:`.

---

## 7. Verification

- **Build:** `npm run build` completes successfully.
- **Lint:** No linter errors on new or modified files.
- **In-browser:** `/enrollment-v2/investment` is behind `ProtectedRoute`; full UI verification requires logging in and stepping through the enrollment flow to the Investment step. Code paths for state (selection, draft save, continue to readiness) are unchanged and only wired to the new layout.

---

## 8. Summary

The Investment step now uses four new enrollment-v2 components and a 12-column grid layout for visual parity with the Figma mini app. All behavior still goes through `EnrollmentContext` and `enrollmentDraftStore`; no stores or step paths were rewritten. Strategy cards, AI banner, summary card, and allocation donut are in place with hover/selection and light motion. Fund allocation (Roth/Pretax/After Tax) remains on the Contribution step.
