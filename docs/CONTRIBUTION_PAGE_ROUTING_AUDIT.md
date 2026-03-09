# Contribution Page — Routing + Component Trace Audit

**Worktree:** pam  
**Date:** 2025-03-03  
**Goal:** Debug why the old Contribution page UI is still rendering.

---

## PHASE 1 — ROUTE ENTRY

### 1. Route definition for `/enrollment/contribution`

| Item | Value |
|------|--------|
| **Config file** | `src/app/router.tsx` (used by `main.tsx` via `RouterProvider`) |
| **Path** | `path: "contribution"` under parent `path: "/enrollment"` |
| **Full URL** | `/enrollment/contribution` |

### 2. File actually rendered

| Question | Answer |
|----------|--------|
| Which file is rendered? | **`src/pages/enrollment/Contribution.tsx`** |
| Is it `pages/enrollment/Contribution.tsx`? | **Yes.** |
| Is it `app/enrollment/contribution/page.tsx`? | **No.** (No App Router in this repo.) |
| Imported wrapper? | **No.** Route uses `<Contribution />` directly. |

### 3. Exact path, layout, dynamic import

| Item | Detail |
|------|--------|
| **Exact file path used in route** | `../pages/enrollment/Contribution` (import line 19 in `router.tsx`) → **`src/pages/enrollment/Contribution.tsx`** |
| **Layout wrapping** | `ProtectedRoute` → `EnrollmentLayout` (Outlet renders the matched child, i.e. Contribution). |
| **Dynamic import** | **None.** Static import: `import { Contribution } from "../pages/enrollment/Contribution";` |

**Note:** `src/app/routes.tsx` also defines a route for `contribution` and imports the same `Contribution` from `../pages/enrollment/Contribution`, but **the app does not use `routes.tsx` for the router**. `main.tsx` uses `router` from `router.tsx`, so **only `router.tsx` is the active route config**.

---

## PHASE 2 — DUPLICATE FILES

### Files containing "Contribution" / contribution page usage

| File | Role |
|------|------|
| **`src/pages/enrollment/Contribution.tsx`** | **The only enrollment step page.** This is the file rendered at `/enrollment/contribution`. |
| `src/app/router.tsx` | Imports and mounts `Contribution` for `path: "contribution"`. |
| `src/app/routes.tsx` | Unused route config; also imports same `Contribution`. |
| `src/components/enrollment/ContributionCard.tsx` | Reusable card component (not a page). |
| `src/components/enrollment/ContributionAmountSection.tsx` | Reusable section (not a page). |
| `src/components/enrollment/ContributionHero.tsx` | Reusable hero (not a page). |
| `src/components/enrollment/ContributionFeedback.tsx` | Reusable feedback (not a page). |
| `src/components/enrollment/ContributionTypeToggle.tsx` | Reusable toggle (not a page). |
| `src/components/enrollment/ContributionTypeRow.tsx` | Reusable row (not a page). |
| `src/components/enrollment/ContributionSourceGroup.tsx` | Reusable source group (not a page). |
| `src/components/enrollment/contribution/AIInsightBanner.tsx` | New sub-component; **not used** by current `Contribution.tsx`. |
| `src/components/enrollment/contribution/QuickSelectButtons.tsx` | New sub-component; **not used** by current `Contribution.tsx`. |
| `src/components/enrollment/contribution/ContributionSlider.tsx` | New sub-component; **not used** by current `Contribution.tsx`. |

### Duplicate page?

- **No second Contribution page file.** There is only one: `src/pages/enrollment/Contribution.tsx`.
- **No `ContributionPage`** component; the page component is named `Contribution`.

### Why the UI looks “old”

- **The same single file** `Contribution.tsx` **contains the old UI implementation.**
- It does **not** import or render:
  - `SectionHeadingWithAccent`
  - `AIInsightBanner`
  - `ContributionInputCard`
  - `TaxSplitSection`
  - `ProjectionCard`
  - `ContributionSummaryCard`
- It **does** render:
  - Inline heading + “What is contribution?” Ask AI link
  - `EnrollmentPageContent` with inline card: quick presets (4%, 6%, 8%), big percentage, **raw `<input type="range">`** slider, **$ / %** inputs with `SegmentedToggle`, and inline “Split contributions” section with checkboxes/sliders
  - `FinancialSlider` (or equivalent) and old layout (`lg:grid-cols-3`, etc.)

So the **correct file is being rendered**, but **its source code is the old UI**. There is no “wrong file” or “duplicate page” — only one page, and it was never updated to the new design in this worktree.

### Missing in this worktree (pam)

- **`src/components/enrollment/contribution/ContributionInputCard.tsx`** — **does not exist.**
- **`src/components/enrollment/contribution/TaxSplitSection.tsx`** — **does not exist.**
- **`src/components/enrollment/contribution/ProjectionCard.tsx`** — **does not exist.**
- **`src/components/enrollment/contribution/ContributionSummaryCard.tsx`** — **does not exist.**
- **`src/components/enrollment/contribution/index.ts`** — **does not exist** (no barrel).

So the **new UI exists only in part** in pam (AIInsightBanner, QuickSelectButtons, ContributionSlider) and is **not used**; the rest of the new components are **missing** in this worktree.

---

## PHASE 3 — BUILD ENTRY

| Check | Result |
|-------|--------|
| Dev server runs from | Project root (pam worktree). No evidence of wrong folder. |
| Cached build | Not verified; if old UI persists after hard refresh, it’s because the **source** is old, not cache. |
| Stale component export | **No.** Single default export `Contribution` from `Contribution.tsx`; router imports it by name. |
| Barrel file exporting old version | **N/A.** There is no `index.ts` in `src/components/enrollment/contribution/`. No barrel re-export of the page. |

**Conclusion:** Build and entry are consistent with a single page component; the only thing rendered is `src/pages/enrollment/Contribution.tsx`, and that file’s content is the old UI.

---

## PHASE 4 — FORCE TRACE

- **Inserted:**  
  `console.log("NEW CONTRIBUTION PAGE LOADED");`  
  at the top of `Contribution` in `src/pages/enrollment/Contribution.tsx` (right after the function open).

- **After reload:**
  - **If this log appears:** The file that is running is `src/pages/enrollment/Contribution.tsx`. The old UI is coming from **this file’s implementation**, not from a wrong route or duplicate.
  - **If this log does not appear:** Then something else is rendering (e.g. different build, different entry, or route not matching). In the current codebase, the only route for `/enrollment/contribution` points to this file, so in normal conditions the log should appear.

---

## PHASE 5 — ROOT CAUSE AND FIX

### Root cause

1. **Route and file are correct:**  
   `/enrollment/contribution` → **`src/pages/enrollment/Contribution.tsx`** (single page, no duplicate).

2. **That file still implements the old UI:**  
   Inline card with presets, single slider, $/% inputs, and inline split section. It does not use the new components (SectionHeadingWithAccent, AIInsightBanner, ContributionInputCard, TaxSplitSection, ProjectionCard, ContributionSummaryCard).

3. **New design not fully present in this worktree:**  
   - New **page layout/content** (two-column, new cards) was never applied to `Contribution.tsx` in pam.  
   - New **sub-components** `ContributionInputCard`, `TaxSplitSection`, `ProjectionCard`, `ContributionSummaryCard` (and optionally a barrel `index.ts`) are **missing** in pam.

So the “old UI” is the **current implementation** of the only Contribution page in this worktree.

### Fix (no UI changed in this audit)

- **No duplicate to remove:** Only one page component.
- **No barrel to fix:** No contribution component barrel in use for the page.
- **No wrong route or layout to change:** Route and layout are correct.

**Required fix:**

1. **Bring the new Contribution UI into this worktree:**  
   - Either copy/merge the **new** `Contribution.tsx` (and any new hooks/helpers it uses) from the worktree that has the new design (e.g. zmg), **or**
   - Re-implement the new design inside the existing `Contribution.tsx` and add any missing components.

2. **Add missing components under `src/components/enrollment/contribution/` (if not present):**  
   - `ContributionInputCard.tsx`  
   - `TaxSplitSection.tsx`  
   - `ProjectionCard.tsx`  
   - `ContributionSummaryCard.tsx`  
   - Optionally `index.ts` to re-export them.

3. **Update `Contribution.tsx`** so it:
   - Uses `SectionHeadingWithAccent` for the step heading.
   - Renders `AIInsightBanner`, `ContributionInputCard`, `TaxSplitSection`, and (if in design) `ProjectionCard` and `ContributionSummaryCard`.
   - Removes or replaces the old inline card (presets + single slider + $/% row + inline split).

After that, the same route and same file will render the new component-based UI. No route or build change is required once the source is updated.

---

## OUTPUT SUMMARY

| # | Item | Result |
|---|------|--------|
| 1 | **Exact route file used** | `src/pages/enrollment/Contribution.tsx` (import in `src/app/router.tsx` line 19). |
| 2 | **Duplicate exists?** | **No.** Single page component; no second Contribution page. |
| 3 | **Root cause** | The only Contribution page file **contains the old UI**. New UI was never applied in this worktree; new sub-components are missing or unused. |
| 4 | **Fix applied** | **None** (audit only). Recommended: add missing contribution components and replace the body of `Contribution.tsx` with the new layout and components. |
| 5 | **Confirmation** | **Force trace added.** After reload, if you see `NEW CONTRIBUTION PAGE LOADED` in the console, this file is the one rendering; then the only remaining step is to change this file’s content to the new UI. |

---

**Remove the debug log** (`console.log("NEW CONTRIBUTION PAGE LOADED");`) once you have confirmed the correct file is loading and before shipping.
