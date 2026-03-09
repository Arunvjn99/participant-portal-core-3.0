# Enrollment V2 — Feature-based structure

Refactor completed. Enrollment flow is under a feature-based layout.

## Final file structure tree

```
src/
├── features/
│   └── enrollment/
│       ├── config/
│       │   └── stepConfig.ts
│       ├── layout/
│       │   ├── EnrollmentLayoutV2.tsx
│       │   └── EnrollmentRedirectWhenV2.tsx
│       ├── plan/
│       │   ├── ChoosePlanPage.tsx
│       │   └── PlanCardV2.tsx
│       ├── contribution/
│       │   ├── ContributionPage.tsx
│       │   ├── ContributionLayoutV2.tsx
│       │   └── ContributionCardV2.tsx
│       ├── autoIncrease/
│       │   ├── AutoIncreasePage.tsx
│       │   └── AutoIncreaseLayoutV2.tsx
│       ├── investment/
│       │   ├── InvestmentPage.tsx
│       │   ├── InvestmentLayoutV2.tsx
│       │   └── InvestmentCardV2.tsx
│       ├── readiness/
│       │   ├── ReadinessPage.tsx
│       │   └── ReadinessLayoutV2.tsx
│       └── review/
│           ├── ReviewPage.tsx
│           ├── ReviewLayoutV2.tsx
│           ├── SummarySectionV2.tsx
│           └── AllocationCardV2.tsx
│
├── shared/
│   └── ui/
│       └── StepIndicatorV2.tsx
│
├── app/
│   └── router.tsx                    # imports from features/enrollment/*
├── components/
│   └── enrollment/                  # shared enrollment UI (unchanged)
│       ├── EnrollmentPageContent.tsx
│       ├── EnrollmentFooter.tsx
│       └── ...
├── enrollment/                      # context, stores, logic (unchanged)
│   ├── context/
│   ├── enrollmentDraftStore.ts
│   ├── enrollmentStepPaths.ts
│   └── logic/
└── ...
```

## What was done

1. **Analyzed** `src/enrollment-v2/` and `src/components/` and assigned files to each step.
2. **Created** `src/features/enrollment/` with step folders: `plan`, `contribution`, `autoIncrease`, `investment`, `readiness`, `review`, plus `layout` and `config`.
3. **Moved** step-specific components into the matching feature folder:
   - **plan:** ChoosePlanPage, PlanCardV2
   - **contribution:** ContributionPage, ContributionLayoutV2, ContributionCardV2
   - **autoIncrease:** AutoIncreasePage, AutoIncreaseLayoutV2
   - **investment:** InvestmentPage, InvestmentLayoutV2, InvestmentCardV2
   - **readiness:** ReadinessPage, ReadinessLayoutV2
   - **review:** ReviewPage, ReviewLayoutV2, SummarySectionV2, AllocationCardV2
4. **Moved** layout and config: EnrollmentLayoutV2, EnrollmentRedirectWhenV2 → `layout/`; stepConfig → `config/`.
5. **Reusable UI:** StepIndicatorV2 → `shared/ui/`.
6. **Updated** all imports (relative paths from new locations; no routing or state changes).
7. **Removed** the old `src/enrollment-v2/` directory.

## Unchanged (as required)

- **Routing:** Paths and route config in `router.tsx` unchanged (`/enrollment-v2/*`).
- **State:** EnrollmentContext, enrollmentDraftStore, useContributionStore, enrollmentStepPaths — not moved or modified.
- **ThemeContext, AuthContext, Supabase** — not modified.
- **EnrollmentFooter** — still in `components/enrollment/`; still used by each step page.

## Router imports (updated)

```ts
// app/router.tsx
import { EnrollmentRedirectWhenV2 } from "../features/enrollment/layout/EnrollmentRedirectWhenV2";
import { EnrollmentLayoutV2 } from "../features/enrollment/layout/EnrollmentLayoutV2";
import { ChoosePlanPage } from "../features/enrollment/plan/ChoosePlanPage";
import { ContributionPage } from "../features/enrollment/contribution/ContributionPage";
import { AutoIncreasePage } from "../features/enrollment/autoIncrease/AutoIncreasePage";
import { InvestmentPage } from "../features/enrollment/investment/InvestmentPage";
import { ReadinessPage } from "../features/enrollment/readiness/ReadinessPage";
import { ReviewPage } from "../features/enrollment/review/ReviewPage";
```

Build verified: `npm run build` succeeds.
