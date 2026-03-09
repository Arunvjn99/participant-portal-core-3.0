# PreEnrollmentDashboard — Migration Plan

**Design reference (read-only):** `src/figma-dump/retireready-dashboard (1)/`  
**Goal:** Implement a new dashboard page **PreEnrollmentDashboard** with Hero, InsightCards, EnrollmentStepsStrip, LearningBanner, SupportSection, and FAQSection.  
**Rule:** Do not import any code from `src/figma-dump`; use it only as a visual/structure reference.

---

## 1. Exact file structure to create

### New page (single file)

| Path | Purpose |
|------|--------|
| `src/pages/dashboard/PreEnrollmentDashboard.tsx` | New page component that composes all sections and uses DashboardLayout. |

### New components (pre-enrollment)

| Path | Purpose |
|------|--------|
| `src/components/pre-enrollment/InsightCards.tsx` | Section containing two insight cards (employer match + growth impact). Uses Card, optional chart. |
| `src/components/pre-enrollment/EnrollmentStepsStrip.tsx` | Horizontal strip of enrollment steps driven by `stepConfig` (paths + labels). |
| `src/components/pre-enrollment/LearningBanner.tsx` | Single dark/feature CTA card for “Understanding your retirement plan” / learning center. |
| `src/components/pre-enrollment/FAQSection.tsx` | Accordion list of FAQ items (question/answer); data-driven. |

### Optional new UI (only if needed)

| Path | Purpose |
|------|--------|
| `src/components/ui/Accordion.tsx` | Generic accordion (optional). If the project already has an accordion (e.g. in a UI library), reuse it instead of creating this. |

### Files to update (no new files under features for this page)

| Path | Change |
|------|--------|
| `src/components/pre-enrollment/index.ts` | Export `InsightCards`, `EnrollmentStepsStrip`, `LearningBanner`, `FAQSection` (and any other new pre-enrollment components used by the page). |
| `src/app/router.tsx` | Add a route for the new page (e.g. `/dashboard` → PreEnrollmentDashboard, or a new path like `/dashboard/pre-enrollment` if the product wants to keep current PreEnrollment on `/dashboard`). |

**No new folders** under `src/features` are required for this page; it lives under `src/pages/dashboard` and `src/components/pre-enrollment` (and `src/components/ui` only if a new Accordion is added).

---

## 2. Existing components to reuse

Use these as-is or with minimal props; do not duplicate their behavior.

| Component | Path | How it’s used on PreEnrollmentDashboard |
|-----------|------|----------------------------------------|
| **HeroSection** | `src/components/pre-enrollment/HeroSection.tsx` | Hero block. Already has greeting, title, subtitle, primary/secondary CTAs, and optional PersonalizePlanModal. For the new page, the primary CTA will be wired to “Start Enrollment” → navigate to enrollment flow (see §5). |
| **DashboardSection** | `src/components/dashboard/DashboardSection.tsx` | Wrapper for any section that has a title and optional action. Use for InsightCards (section title), EnrollmentStepsStrip (title + “Approx. 4 minutes”), SupportSection (title), FAQSection (title + subtitle) if desired. |
| **Card** (and subcomponents) | `src/components/ui/card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent. Use inside InsightCards (two cards), LearningBanner (one card), SupportSection (two cards). |
| **Button** | `src/components/ui/Button.tsx` (or shared Button) | All CTAs: Hero (if not using custom button), LearningBanner, SupportSection (Ask AI, Schedule Call). Use `Link` or `useNavigate` for “Start Enrollment” so it routes to enrollment. |
| **LearningSection** | `src/components/pre-enrollment/LearningSection.tsx` | Can be reused as the “learning” block. If the design calls for a single dark CTA card (LearningBanner), either wrap/restyle LearningSection or build LearningBanner using Card + Button and same i18n intent. |
| **AdvisorSection** | `src/components/pre-enrollment/AdvisorSection.tsx` | Maps to SupportSection (AI + human help). Reuse as-is for the two support cards, or use it inside a DashboardSection titled “Need help deciding?” so the layout matches the reference. |
| **DashboardLayout** | `src/layouts/DashboardLayout.tsx` | Page shell: same as current PreEnrollment. Pass `header={<DashboardHeader />}` and render all sections as `children`. |
| **DashboardHeader** | `src/components/dashboard/DashboardHeader.tsx` | Top bar for the dashboard. No change. |

**Step configuration (not a component, but reused):**

| Export | Path | Use in |
|--------|------|--------|
| `ENROLLMENT_V2_STEP_PATHS`, `ENROLLMENT_V2_STEP_LABEL_KEYS`, step labels via i18n | `src/features/enrollment/config/stepConfig.ts` | EnrollmentStepsStrip: map paths to step titles (and optional descriptions), derive “current” step from URL or default to first. |

---

## 3. New components to create

These do not exist in production today; implement them from scratch (inspired by the reference, no imports from figma-dump).

| Component | Responsibility | Reused building blocks |
|-----------|----------------|--------------------------|
| **InsightCards** | Section with two cards: (1) Employer match (short copy + optional simple chart or number), (2) Growth impact (optional chart + copy). | DashboardSection (title), Card (CardHeader, CardTitle, CardDescription, CardContent), theme tokens. Optional: recharts if charts are used. |
| **EnrollmentStepsStrip** | Horizontal strip of 6 steps from `stepConfig`: show path labels (and optional short description), icon or number, “current” state for first step (or from route). Connecting line on desktop. | `ENROLLMENT_V2_STEP_PATHS`, `ENROLLMENT_V2_STEP_LABEL_KEYS` (or t(stepLabelKey)), no Card; custom step tiles with border/radius to match reference. |
| **LearningBanner** | Single full-width card: dark background, “Featured Guide” pill, heading, body copy, one CTA (e.g. “Explore Learning Center”). | Card (or div with card-like styling), Button. Use theme tokens for dark surface and text. |
| **SupportSection** | Section title + two cards (AI Assistant, Retirement Specialist). | DashboardSection, Card, Button. Can wrap existing AdvisorSection or duplicate its structure with the same content (AdvisorOptionCard / Core AI + human booking). Prefer reusing AdvisorSection here. |
| **FAQSection** | Section title + subtitle + list of expandable FAQ items. | DashboardSection (or plain section), accordion behavior (expand/collapse one item). If project has Accordion in ui, use it; else implement simple state (openIndex) + button + animated content. |

**No new components** are required for Hero (use HeroSection) or for Support (use AdvisorSection), unless the product explicitly wants differently named components that still delegate to these.

---

## 4. How sections are composed inside PreEnrollmentDashboard

- **Layout:** One page component, no extra wrapper beyond what DashboardLayout already provides.
- **Structure:**
  1. **DashboardLayout** with `header={<DashboardHeader />}`.
  2. **Children** of the layout = a single container (e.g. `div`) with consistent vertical spacing (e.g. `flex flex-col gap-6` or `space-y-8`), containing in order:
     - **Hero** → `<HeroSection />` (reused).
     - **InsightCards** → `<InsightCards />` (new).
     - **EnrollmentStepsStrip** → `<EnrollmentStepsStrip />` (new), fed by step config.
     - **LearningBanner** → `<LearningBanner />` (new), or `<LearningSection />` if reusing as the learning block.
     - **SupportSection** → `<AdvisorSection />` (reused) or a thin wrapper that adds a DashboardSection title “Need help deciding?” and renders AdvisorSection content.
     - **FAQSection** → `<FAQSection />` (new).
- **Loading / skeleton:** If the page needs loading state (e.g. user data), reuse existing skeletons (HeroSkeleton, LearningSkeleton, AdvisorSkeleton) in the same order as sections, and swap to real sections when ready; same pattern as current PreEnrollment.
- **Spacing:** Use the same main content padding as current dashboard (DashboardLayout’s main already has `max-w-7xl` and padding). Section gaps: e.g. `gap-6` or `gap-8` between sections to match reference.

**Pseudo-structure (no code):**

- Page = DashboardLayout(header, children).
- children = div with spacing → [ HeroSection, InsightCards, EnrollmentStepsStrip, LearningBanner, AdvisorSection (or SupportSection wrapper), FAQSection ].

---

## 5. How the “Start Enrollment” CTA routes to the enrollment flow

- **Target flow:** The app’s enrollment flow is V2 at `/enrollment-v2`, with first step at `/enrollment-v2/choose-plan`. The router’s `/enrollment` route uses `EnrollmentRedirectWhenV2`, which redirects to the V2 flow (index redirect to `/enrollment-v2/choose-plan`).
- **Recommended behavior for “Start Enrollment”:** Navigate the user to the first step of the V2 flow so they land on Choose Plan.
  - **Option A (recommended):** Link or programmatic navigate to **`/enrollment-v2/choose-plan`**. This is explicit and matches stepConfig.
  - **Option B:** Link or navigate to **`/enrollment-v2`** and rely on the existing index redirect to `/enrollment-v2/choose-plan`.
  - **Option C:** Link to **`/enrollment`** and rely on `EnrollmentRedirectWhenV2` to send them into V2 (slightly less explicit for the new dashboard).
- **Where to implement:**
  - **HeroSection:** Today the primary CTA opens PersonalizePlanModal. For PreEnrollmentDashboard, either (1) add an optional prop to HeroSection (e.g. `primaryCtaHref="/enrollment-v2/choose-plan"` or `onPrimaryCtaClick` that navigates) and use it only on this page, or (2) render a separate primary button on PreEnrollmentDashboard that uses `useNavigate()` or `<Link to="/enrollment-v2/choose-plan">` and place it in the hero area (if the layout allows), or (3) keep HeroSection as-is and add a second “Start Enrollment” in the header/nav that goes to `/enrollment-v2/choose-plan`. The plan recommends (1) or (2) so the main hero CTA on this page starts enrollment.
  - **DashboardHeader / nav:** If the header already has a “Start Enrollment” button, ensure it points to `/enrollment-v2/choose-plan` (or `/enrollment-v2`) so it matches this behavior.
- **Implementation detail:** Use React Router’s `useNavigate()` or `<Link to="...">` from `react-router-dom`. No full-page reload; stay in the SPA. Protected route is already applied to `/enrollment-v2` in the router.

---

## 6. Summary checklist

- [ ] Create `src/pages/dashboard/PreEnrollmentDashboard.tsx` composing Hero, InsightCards, EnrollmentStepsStrip, LearningBanner, Support/Advisor, FAQ.
- [ ] Create `InsightCards.tsx`, `EnrollmentStepsStrip.tsx`, `LearningBanner.tsx`, `FAQSection.tsx` under `src/components/pre-enrollment/`.
- [ ] Reuse `HeroSection`, `DashboardSection`, `Card`, `Button`, `LearningSection` and/or `AdvisorSection`, `DashboardLayout`, `DashboardHeader`.
- [ ] Use `ENROLLMENT_V2_STEP_PATHS` and `ENROLLMENT_V2_STEP_LABEL_KEYS` (and i18n) in `EnrollmentStepsStrip`; no imports from figma-dump.
- [ ] Wire “Start Enrollment” to navigation to `/enrollment-v2/choose-plan` (or `/enrollment-v2`) from the hero and/or header.
- [ ] Update `src/components/pre-enrollment/index.ts` exports and router (new route or replace `/dashboard` with PreEnrollmentDashboard as needed).
- [ ] Do not implement any code in figma-dump; reference only.
