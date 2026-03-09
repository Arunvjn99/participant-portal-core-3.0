# Full System UI Refactor Safety Audit

**Purpose:** Architectural and safety audit before a complete UI redesign of the retirement participant portal.  
**Scope:** No code modifications — analysis only.  
**Date:** March 3, 2025.

---

## Executive Summary

The application has **strong centralization** of enrollment steps, auth, and theme, but **significant coupling** between UI and logic in several areas. A full UI refactor carries **medium–high risk** unless boundaries are respected. The single largest risks are: (1) **EnrollmentFooter** using `window.location.href` for Next (full page reload), (2) **BellaScreen** and **Core AI enrollment flow** depending on **step names and order** that mirror the wizard, (3) **~20k-line index.css** and **dual token systems** that tie theme to many class names, and (4) **Enrollment state** living in React Context + sessionStorage with **layout-dependent** provider placement.

**Refactor Safety Score: 5/10** — feasible with a strict migration plan and a clear “do not touch” list.

---

## PHASE 1 — ARCHITECTURE MAP

### 1.1 Folder Structure (`/src`)

```
src/
├── app/                    # router.tsx, investments layout + page
├── agent/                  # AgentController, intentClassifier, taskDefinitions, LLMEnhancer, steps, participantState, resolveNextStep
├── bella/                  # BellaScreen, agents (planEnrollmentAgent, loanApplicationAgent, vestingInfoAgent, withdrawalInfoAgent), ui/
├── components/
│   ├── ai/                 # CoreAIFab
│   ├── auth/               # Login/Signup panels, ProtectedRoute, AuthOTPInput, AuthLayout
│   ├── enrollment/         # Stepper, Footer, PlanCard, PersonalizePlanModal, contribution/*, EnrollmentInvestmentsGuard, etc.
│   ├── core-ai/            # CoreAssistantModal, MessageInput, flows (enrollmentFlow, loanFlow, vestingFlow, withdrawalFlow), interactive/
│   ├── dashboard/          # Header, cards, modules (activity, snapshot, hero, contributions, etc.)
│   ├── investments/        # Allocation, ManualBuilder, FundSearchModal, InvestmentsFooter
│   ├── layout/             # Footer
│   ├── profile/            # ProfileCard, ContactInformationCard, etc.
│   ├── pre-enrollment/     # HeroSection, AdvisorSection, LearningSection
│   ├── system/             # NetworkBanner
│   ├── transactions/       # TransactionApplication, TransactionFlowFooter, etc.
│   └── ui/                 # Button, Input, Modal, HelpSectionCard, SectionHeadingWithAccent, etc.
├── context/                # ThemeContext, AuthContext, UserContext, OtpContext, AISettingsContext, CoreAIModalContext, NetworkContext, InvestmentContext
├── enrollment/             # context/EnrollmentContext, context/useContributionStore, logic/*, enrollmentDraftStore, enrollmentStepPaths
├── features/               # transactions/, transaction-hub/
├── layouts/                # RootLayout, DashboardLayout, EnrollmentLayout
├── lib/                    # supabase.ts, network/, analytics/
├── pages/                  # auth, dashboard, enrollment, profile, settings, transactions
├── services/               # coreAiService, companyBrandingService, enrollmentService, plansService, etc.
├── theme/                  # tokens.css, light.css, dark.css, enrollment-dark.css, themeManager, utils, defaultThemes
├── styles/                 # tokens.css, enrollment-choose-plan.css, contribution-page-figma.css
├── data/                   # mockTransactions, usStates, enrollmentSummary, mockFunds, etc.
├── hooks/                  # useMediaQuery, useCanHover, useReducedMotion, useDemoUser, useTextToSpeech, useSpeechToText
├── utils/                  # voiceAgent, loanCalculator, retirementCalculations, projectionChartAxis, etc.
├── locales/                # en, es, fr, de, zh, ja, hi, ta (common, enrollment, dashboard, plans, voice)
└── index.css               # ~19,811 lines — global styles, BEM-like blocks
```

### 1.2 Pages

| Route / area        | Page / component              | Layout / guard                    |
|---------------------|-------------------------------|-----------------------------------|
| `/`                 | Login                         | —                                 |
| `/verify`, `/forgot`, `/signup`, etc. | VerifyCode, ForgotPassword, Signup, etc. | —                    |
| `/dashboard`        | PreEnrollment                 | ProtectedRoute                    |
| `/dashboard/classic` | Dashboard                     | ProtectedRoute                    |
| `/dashboard/post-enrollment` | PostEnrollmentDashboard | ProtectedRoute            |
| `/enrollment`       | EnrollmentManagement (index)  | ProtectedRoute, EnrollmentLayout  |
| `/enrollment/choose-plan` | ChoosePlan              | EnrollmentLayout, step layout     |
| `/enrollment/contribution` | Contribution            | EnrollmentLayout, step layout     |
| `/enrollment/auto-increase` | FutureContributions   | EnrollmentLayout, step layout     |
| `/enrollment/investments` | EnrollmentInvestmentsContent | EnrollmentInvestmentsGuard |
| `/enrollment/review` | EnrollmentReviewContent      | EnrollmentLayout, step layout     |
| `/investments`      | InvestmentsPage               | InvestmentProvider, InvestmentsLayout |
| `/profile`, `/settings`, `/transactions/*` | Profile, SettingsHub, TransactionApplicationRouter, etc. | ProtectedRoute |

### 1.3 Layouts

- **RootLayout:** Renders `<Outlet />`, `CoreAIFab`, `DemoSwitcher`, `SplashScreen`, `RouteErrorBoundary`. Wraps all routes.
- **EnrollmentLayout:** Wraps `/enrollment/*` with `EnrollmentProvider`. For step paths, renders `DashboardLayout` with `DashboardHeader` + `EnrollmentHeaderWithStepper` + `transparentBackground` + `<Outlet key={pathname} />`; for non-step paths, raw `<Outlet />`.
- **DashboardLayout:** Two modes — default (main with padding, max-w-7xl) and `transparentBackground` (no max-w; enrollment pages own full-bleed). Uses `HEADER_BASE`, responsive `h-14 lg:h-16`, `Footer`.

### 1.4 Context Providers (order in tree)

1. **main.tsx:** `I18nextProvider` → `RootWithLanguageKey` (NetworkProvider → AuthProvider → OtpProvider → ThemeProvider → AISettingsProvider → UserProvider → RouterProvider with `key={i18n.language}`).
2. **RootLayout:** `CoreAIModalProvider` wraps `Outlet`.
3. **Route:** `ProtectedRoute` wraps enrollment/investments/dashboard where needed.
4. **EnrollmentLayout:** `EnrollmentProvider` wraps step layout or outlet.
5. **Investments route:** `InvestmentProvider` wraps `InvestmentsLayout` and page.

### 1.5 Hooks

- **Enrollment:** `useEnrollment`, `useEnrollmentOptional` (EnrollmentContext), `useContributionStore` (enrollment/context).
- **Auth/theme:** `useAuth`, `useOtp`, `useTheme`, `useAISettings`, `useCoreAIModalOptional`.
- **UI:** `useMediaQuery`, `useCanHover`, `useReducedMotion`, `useDemoUser`.
- **Voice/AI:** `useSpeechToText`, `useTextToSpeech` (hooks), Core AI uses flow state in modal.

### 1.6 Services

- **coreAiService** — AI chat/voice.
- **companyBrandingService** — fetches company theme from Supabase.
- **enrollmentService** — Supabase `enrollments` table.
- **plansService** — Supabase `plans` table.
- **transactionService**, **loanCalculator**, **loanEligibility**, **withdrawalEligibility**, etc.

### 1.7 Supabase Integration

- **Client:** Single `createClient` in `lib/supabase.ts` (env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), with `timeoutFetch`.
- **Auth:** `AuthContext` — `getSession()`, `onAuthStateChange()`, `signInWithPassword`, `signUp`, `signOut`.
- **DB calls:** `UserContext` (profiles, companies), `Login` (companies), `Signup` (companies, profiles), `plansService` (plans), `companyBrandingService` (companies), `enrollmentService` (enrollments), `FeedbackModal` (feedback). **No real-time subscriptions** found.

### 1.8 AI-Related Files

- **Bella (voice/conversation):** `bella/BellaScreen.tsx`, `bella/agents/planEnrollmentAgent.ts`, `loanApplicationAgent.ts`, `vestingInfoAgent.ts`, `withdrawalInfoAgent.ts`, `bella/ui/*`.
- **Legacy agent:** `agent/AgentController.ts`, `agent/taskDefinitions.ts` (ENROLLMENT_STEPS: PLAN_SELECTION, CONTRIBUTION, INVESTMENTS, etc.), `agent/steps.ts`, `agent/intentClassifier.ts`, `agent/LLMEnhancer.ts`, `agent/participantState.ts`, `agent/resolveNextStep.ts`.
- **Core AI (modal):** `components/core-ai/CoreAssistantModal.tsx`, `flows/flowRouter.ts`, `flows/enrollmentFlow.tsx` (uses `bella/agents/planEnrollmentAgent`), `flows/loanFlow`, `flows/vestingFlow`, `flows/withdrawalFlow`, `intentDetector.ts`, `interactive/*`.
- **Services:** `services/coreAiService.ts`.

### 1.9 Business Logic Location

| Area           | Logic location                                                                 | UI location                    |
|----------------|---------------------------------------------------------------------------------|--------------------------------|
| Auth           | AuthContext, OtpContext                                                        | pages/auth, components/auth    |
| Enrollment     | EnrollmentContext, useContributionStore, enrollmentStepPaths, enrollmentDraftStore, enrollment/logic/* | pages/enrollment, components/enrollment |
| Contribution   | contributionCalculator, projectionCalculator, contributionInsightEngine, useContributionStore | Contribution.tsx, contribution/* |
| Investment     | sourceAllocationEngine, InvestmentContext, enrollment context optional          | components/investments         |
| Review         | useEnrollment, guards (hasPlan, hasContribution, etc.)                         | Review.tsx, EnrollmentReviewContent |
| Dashboard      | scenarios, data/*, useDashboardEngine                                          | pages/dashboard, components/dashboard |
| Voice/AI       | planEnrollmentAgent (state machine), taskDefinitions, flowRouter, enrollmentFlow | BellaScreen, CoreAssistantModal |

**Summary:** Logic is **mixed** — a lot lives in **hooks and services**, but **validation, step order, and draft shape** are also embedded in **pages and footer**. AI flows use **separate** step enums (planEnrollmentAgent vs taskDefinitions) but **mirror** the same conceptual flow.

---

## PHASE 2 — UI & LOGIC COUPLING AUDIT

| Feature       | UI handles business logic?      | Calculations in components?      | API calls in JSX?        | Validation in UI?        | AI tied to DOM?          | Risk      |
|---------------|---------------------------------|----------------------------------|---------------------------|---------------------------|---------------------------|-----------|
| **Auth**      | No; AuthContext/OtpContext     | No                               | Login/Signup call Supabase in handlers | Yes (form validation in pages) | No                        | **SAFE**  |
| **Enrollment** | Partially; footer drives Next via pathname; getDraftSnapshot per page | Some (e.g. Contribution page formatCurrency, presets) | No; services/handlers     | Guards in Review, EnrollmentInvestmentsGuard; validation in steps | AI uses step names, not DOM | **MODERATE** |
| **Contribution** | useContributionStore + EnrollmentContext; page builds getDraftSnapshot | Yes; projection, slider, percent in page and contribution/* | No                        | In components (allocation 100%, etc.) | Core AI flow has CONTRIBUTION step component | **MODERATE** |
| **Investment** | Allocation state in context + draft; ManualBuilder, FundAllocationSection | allocation helpers, sourceAllocationEngine | No                        | Allocation validation in UI | AI MANUAL_* steps         | **MODERATE** |
| **Review**    | useEnrollment; prerequisites; navigate to edit | Display only                     | No                        | hasPlan, hasContribution guards | No                        | **MODERATE** |
| **Dashboard** | Navigate to enrollment/transactions; scenario content | Some in cards                    | No (data from context/mock) | N/A                       | No                        | **SAFE**  |
| **VoiceAssistant** | BellaScreen holds enrollment/loan/vesting state; scripted flows | N/A                              | coreAiService            | In agent (planEnrollmentAgent) | **Yes** — step order and step names (INTENT, CONTRIBUTION, REVIEW, etc.) drive UI blocks | **HIGH**  |

**High-risk coupling zones:**

1. **EnrollmentFooter** — `window.location.href = nextPath` on Primary (Next) causes **full page reload**. Any refactor that assumes SPA navigation for steps must change this to `navigate(nextPath)` and verify no code depends on reload.
2. **BellaScreen** — Renders different blocks by `enrollmentState.step` (e.g. `MANUAL_RISK`, `MANUAL_FUNDS`, `REVIEW`). Step names come from `planEnrollmentAgent`. Changing step enum or order in the agent without updating BellaScreen will break voice enrollment.
3. **Core AI enrollmentFlow** — `buildStepComponent(step, ...)` switches on step string (PLAN_RECOMMENDATION, CONTRIBUTION, MONEY_HANDLING, etc.). Same dependency on planEnrollmentAgent step names.
4. **enrollmentStepPaths.ts** — Single source of truth for **URL paths** and **stepper order**. Layout and footer both use it. Changing path strings or order without updating all references (including hardcoded `/enrollment/contribution` in many files) will break navigation and guards.

---

## PHASE 3 — STATE MANAGEMENT AUDIT

### 3.1 Where Enrollment State Lives

- **In memory:** `EnrollmentContext` (EnrollmentProvider in EnrollmentLayout). State: selectedPlan, selectedPlanDbId, salary, contributionType, contributionAmount, sourceAllocation, autoIncrease, investmentProfile, etc.
- **Persistence:** `enrollmentDraftStore` (sessionStorage key `enrollment-draft`). Loaded once in `EnrollmentProvider` via `getInitialEnrollmentState()`; saved by pages/footer via `getDraftSnapshot` + `saveEnrollmentDraft`.
- **Contribution UI state:** `useContributionStore` (enrollment/context) — derives from EnrollmentContext and local UI (e.g. slider, presets).

### 3.2 Page Refresh

- **Does not break flow.** On load, EnrollmentProvider runs `getInitialEnrollmentState()` → `loadEnrollmentDraft()`. If user had saved a draft (Save & Exit or implicit save), state is rehydrated. URL still determines which step is shown.

### 3.3 State Depends on Component Mount

- **Yes.** Enrollment state exists only while **EnrollmentProvider** is mounted. Provider is mounted only under **EnrollmentLayout** (i.e. under `/enrollment/*`). Navigating away (e.g. to `/dashboard`) unmounts the provider and state is lost unless it was persisted to sessionStorage. So: **layout change that unmounts EnrollmentLayout** (e.g. moving enrollment routes under a different parent that doesn’t render EnrollmentProvider) **will reset state** unless draft save/load is preserved.

### 3.4 Layout Change Could Reset State

- **Yes**, if the refactor moves `/enrollment` routes outside `EnrollmentLayout` or removes `EnrollmentProvider` from the tree. Keeping the same route tree and provider placement preserves state.

### 3.5 Cross-Page Dependencies

- **ChoosePlan** → sets selectedPlan, selectedPlanDbId; Contribution and later steps depend on it.
- **Contribution** → redirects to `/enrollment/choose-plan` if `!selectedPlanId`; provides getDraftSnapshot for contribution + source allocation.
- **EnrollmentInvestmentsGuard** → redirects to choose-plan or contribution if draft missing plan or contribution.
- **Review** → redirects to choose-plan if !hasPlan, to contribution if !hasContribution; edit links navigate to contribution/investments.
- **FutureContributions, Investments, Review** — all read/write draft and context.

### 3.6 Context Provider Tree

```
I18nextProvider
  RootWithLanguageKey (key=language)
    NetworkProvider → AuthProvider → OtpProvider → ThemeProvider → AISettingsProvider → UserProvider
      RouterProvider
        RootLayout (CoreAIModalProvider, Outlet, CoreAIFab, DemoSwitcher)
          [route]
            ProtectedRoute (optional)
              EnrollmentLayout (EnrollmentProvider, EnrollmentStepLayout)
                DashboardLayout (for steps) or raw Outlet
                  Outlet → page
```

**Refactor risk:** Any change that **reorders or removes** Auth, Otp, Theme, or User above the router can break session, OTP gate, or branding. Any change that **removes or moves EnrollmentProvider** from the enrollment subtree will break enrollment state unless draft persistence is used elsewhere.

---

## PHASE 4 — SUPABASE IMPACT CHECK

### 4.1 Where Supabase Client Is Initialized

- **Single place:** `lib/supabase.ts`. `createClient(supabaseUrl, supabaseAnonKey, { global: { fetch: timeoutFetch } })`. No other client creation.

### 4.2 Auth Listeners

- **AuthContext:** `supabase.auth.onAuthStateChange` in a `useEffect`. Sets session and user. Unsubscribe on cleanup. **UI restructure that does not remove or re-mount AuthProvider** keeps auth session intact.

### 4.3 Real-Time Subscriptions

- **None** found. No `.channel()` or realtime usage.

### 4.4 Database Calls Inside Components

- **Login.tsx** — fetches companies in submit handler.
- **Signup.tsx** — companies, profiles, signOut in handlers.
- **UserContext** — profiles, companies in useEffect and handlers.
- **FeedbackModal** — `supabase.from("feedback").insert` in submit handler.

All are in **event handlers or useEffect**, not in render. Moving these components to different **files or route branches** without changing **provider hierarchy** (Auth, User) will not break auth or data fetch. Changing **when** AuthProvider/UserProvider mount (e.g. only on certain routes) could delay or skip session load and profile fetch.

### 4.5 API Wrappers

- **plansService** — `getPlans()`.
- **companyBrandingService** — company theme.
- **enrollmentService** — enrollment upsert.

Used by components or context; not called from inside JSX. **Conclusion:** UI restructure that keeps the same provider tree and import paths for these services will not break Supabase auth or data. Moving to a different route tree that unmounts Auth/User higher up could affect when session and profile load.

---

## PHASE 5 — i18n & THEME SAFETY

### 5.1 Translation Keys

- **useTranslation** / **t()** used in **170+** files across pages, components, layouts.
- **Namespaces:** common, enrollment, dashboard, plans, voice (e.g. `t("enrollment.stepperPlan")`).
- **enrollmentStepPaths:** `ENROLLMENT_STEP_LABEL_KEYS` maps paths to keys (`enrollment.stepperPlan`, etc.). Stepper and layout depend on these keys.

### 5.2 Hardcoded Strings

- **planEnrollmentAgent.ts** — messages like "You've selected...", "What percentage...".
- **agent/taskDefinitions.ts** — prompts and labels (e.g. "Plan Selection", "Contribution").
- **core-ai/flows/enrollmentFlow.tsx** — labels like "Choose your plan", "Set your contribution", "Investment approach".
- **BellaScreen** — suggested questions, greeting.
- Various components still have inline English; most UI uses `t()`.

If UI redesign **renames or restructures components** that pass translation keys (e.g. stepper labels), keep **key names** the same and only change where they are rendered. **Do not** change namespace or key names without updating all `t()` calls and locale JSON.

### 5.3 Dark/Light Mode Implementation

- **ThemeContext:** `mode` (light | dark | system), `effectiveMode`, `applyThemeClass(effective)` → `document.documentElement.classList.remove("light","dark")` + `classList.add(effective)` + `setAttribute("data-theme", effective)`.
- **main.tsx:** Before first paint, reads `localStorage.getItem("theme")` and sets `document.documentElement` class and `data-theme` to avoid flash.
- **applyThemeToDOM(currentColors):** Sets CSS variables on `document.documentElement.style` from company theme (light/dark).
- **CSS:** `theme/tokens.css`, `theme/light.css`, `theme/dark.css`, `theme/enrollment-dark.css`, `styles/tokens.css`, `index.css` — many selectors use **`.dark`** (and some `[data-theme="dark"]`). Tailwind: `darkMode: "class"` (assumed).

If redesign **changes class names** (e.g. BEM blocks in index.css or enrollment-dark.css), **all `.dark` overrides** that target those classes will stop working until updated. **Semantic tokens** (e.g. `var(--color-background)`) are safer than renaming classes.

### 5.4 Theme Toggle After Restructure

Theme toggle will still work **if**:
- ThemeProvider remains in the tree and `setMode` / `applyThemeClass` still run.
- `document.documentElement` still receives `light` / `dark` class.
- CSS that uses `.dark` or `[data-theme="dark"]` still targets the same root or the same component class names. Changing component structure but keeping the same **utility/token** usage (Tailwind + CSS vars) is safe; changing **class names** that are targeted by theme CSS requires updating those CSS files.

---

## PHASE 6 — RESPONSIVE SYSTEM

### 6.1 Breakpoints in Components

- **Tailwind** used widely: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` in layouts, dashboard, enrollment, auth, transactions (e.g. `px-4 sm:px-6 lg:px-8`, `grid-cols-1 sm:grid-cols-2`, `h-14 lg:h-16`).
- **useMediaQuery** (hooks) used in a few places (e.g. ActivityCommandPage, DashboardLayout, EnrollmentPageContent).
- **useCanHover** — used for hover-dependent UI.

### 6.2 Layouts Responsive via Tailwind

- **DashboardLayout** — responsive padding and header height.
- **Enrollment pages** — Tailwind breakpoints in PlanCard, contribution cards, stepper, footer.
- **Auth** — AuthLayout, AuthRightPanel use Tailwind responsive classes.

### 6.3 Mobile-Only Components

- No dedicated “mobile-only” component flag found; responsiveness is primarily via Tailwind and optional useMediaQuery.

### 6.4 VoiceAssistant on Mobile

- **BellaScreen** has a `variant` prop (e.g. fullpage); behavior can differ by viewport if styles or layout depend on breakpoints. No explicit “mobile-only” logic for voice was seen; any mobile-specific behavior would be in BellaScreen or its CSS. Restructuring layout or class names could affect mobile layout.

**Conclusion:** Responsive behavior is **tied to Tailwind and existing class names**. A refactor that **replaces** these with new class names or different breakpoint strategy must re-apply or re-test responsive behavior.

---

## PHASE 7 — AI FLOW INTEGRITY

### 7.1 VoiceAssistant Mirrors Full Enrollment Flow

- **BellaScreen** uses **planEnrollmentAgent** state machine: steps `INTENT`, `ELIGIBILITY`, `CURRENT_AGE`, `RETIREMENT_AGE`, `LOCATION`, `PLAN_RECOMMENDATION`, `CONTRIBUTION`, `MONEY_HANDLING`, `MANUAL_RISK`, `MANUAL_FUNDS`, `MANUAL_ALLOCATION`, `REVIEW`, `INELIGIBLE`, `CONFIRMED`.
- **Core AI** `enrollmentFlow.tsx` uses the **same** `planEnrollmentAgent` (`createInitialEnrollmentState`, `getEnrollmentResponse`) and builds **interactive components** by step name (`PLAN_RECOMMENDATION`, `CONTRIBUTION`, `MONEY_HANDLING`, etc.).
- **AgentController / taskDefinitions** use a **different** step set: `PLAN_SELECTION`, `CONTRIBUTION`, `INVESTMENTS`, `SUMMARY`, `CONFIRMATION` — used by the legacy agent path, not by Bella or Core AI enrollment flow.

### 7.2 Reliance on Field IDs / DOM Queries

- **BellaScreen:** No reliance on **DOM field IDs** for enrollment flow; uses **React state** (`enrollmentState`) and **step enum**.
- **OptOutModal:** `document.getElementById("opt-out-confirm")` for checkbox — one-off.
- **FundAllocationModal, SourceAccordion:** `document.querySelector` for input by name — **moderate risk** if input names or structure change.
- **ScrollIndicator:** `document.querySelector("[data-hero-section]")` — depends on attribute.
- **Profile.tsx:** `document.getElementById(id)` for scroll target.

AI enrollment flow does **not** depend on these; it depends on **step names and state**.

### 7.3 Step Order

- **planEnrollmentAgent** step order is **fixed in code** (switch on `state.step`). Not derived from URL or DOM. If you **reorder or rename** steps in the agent, you must update:
  - **BellaScreen** — every branch that checks `enrollmentState.step === 'REVIEW'` etc.
  - **core-ai/flows/enrollmentFlow.tsx** — `buildStepComponent(step, ...)` and any step-based branching.
- **Web wizard** step order is **enrollmentStepPaths** (URLs). It is **independent** of the agent step order, but the **conceptual** flow (plan → contribution → investments → review) is the same. Changing **only** the UI (e.g. swapping two pages) without changing **agent** step order is safe for AI; changing **agent** step order or names without updating Bella and Core AI will break AI flows.

### 7.4 Specific Component Names

- **BellaScreen** renders different **React components** by step (e.g. `EnrollmentReviewSummaryCard`, `ManualInvestmentBlock`). Component **names** are not queried from DOM; they are chosen in code by step. Renaming these components is safe as long as imports and usage in BellaScreen are updated.

**Risk areas for AI if UI is restructured:**

| Risk | Location | Mitigation |
|------|----------|------------|
| Step enum/order change | planEnrollmentAgent.ts | Do not change step names or order without updating BellaScreen and enrollmentFlow.tsx. |
| Different step set in Core AI | enrollmentFlow.tsx | Keep step names in sync with planEnrollmentAgent. |
| Legacy agent step IDs | taskDefinitions.ts | Only affects legacy agent; not used by Bella or Core AI enrollment flow. |
| DOM queries (inputs, hero) | FundAllocationModal, SourceAccordion, ScrollIndicator | Avoid changing `name` or `data-hero-section` without updating these. |

---

## FINAL OUTPUT

### 1. Full Risk Matrix

| Area | Low | Medium | High |
|------|-----|--------|------|
| **Auth** | ✅ Guards, context, Supabase in one place | — | — |
| **Routing** | — | ✅ Path strings hardcoded in many files; one source of truth (enrollmentStepPaths) | — |
| **Enrollment state** | — | ✅ Context + draft; layout-dependent | ✅ Footer uses window.location.href (reload) |
| **Contribution** | — | ✅ Logic in hooks + page; getDraftSnapshot contract | — |
| **Investment** | — | ✅ Allocation UI + draft snapshot | — |
| **Review** | — | ✅ Guards and edit navigation | — |
| **Dashboard** | ✅ Navigate + data | — | — |
| **Supabase** | ✅ Single client; no realtime | — | — |
| **i18n** | — | ✅ Keys in many files; some hardcoded in agent/flow | — |
| **Theme** | — | ✅ .dark and tokens in many files; dual token systems | ✅ index.css size and BEM coupling |
| **Responsive** | — | ✅ Tailwind + some hooks | — |
| **AI / Voice** | — | ✅ Step names in two systems (agent vs taskDefinitions) | ✅ BellaScreen + enrollmentFlow depend on planEnrollmentAgent step names/order |

### 2. Refactor Safety Score: **5/10**

- **5** = Refactor is **feasible** with strict boundaries and a phased plan; **high chance of regression** if those boundaries are ignored (footer reload, AI step names, theme class names, provider tree).

### 3. Files That MUST NOT Be Touched (Logic / Contracts)

Do **not** change **behavior, exports, or contracts** of:

- **src/enrollment/enrollmentStepPaths.ts** — Paths and step order for layout, footer, guards. Any change must be reflected everywhere that references these paths or labels.
- **src/enrollment/enrollmentDraftStore.ts** — Storage key, `EnrollmentDraft` shape, `loadEnrollmentDraft` / `saveEnrollmentDraft` / `clearEnrollmentDraft`. Callers depend on this contract.
- **src/enrollment/context/EnrollmentContext.tsx** — `EnrollmentState`, `EnrollmentContextValue`, `useEnrollment`, `useEnrollmentOptional`, and initial state from draft. All enrollment pages and footer depend on it.
- **src/enrollment/context/useContributionStore.ts** — Contract with EnrollmentContext and contribution UI; Contribution page and contribution components depend on it.
- **src/components/enrollment/EnrollmentFooter.tsx** — **Logic** of Next/Back/Save & Exit and **pathname → nextPath/prevPath**. Changing to `navigate()` instead of `window.location.href` is a **behavior change** (intended for SPA) but must be done deliberately and tested.
- **src/lib/supabase.ts** — Single Supabase client.
- **src/context/AuthContext.tsx**, **src/context/OtpContext.tsx** — Auth and OTP contracts; ProtectedRoute depends on them.
- **src/components/auth/ProtectedRoute.tsx** — Guard logic.
- **src/bella/agents/planEnrollmentAgent.ts** — Step enum and state machine. BellaScreen and Core AI enrollmentFlow depend on step names and order.
- **src/components/core-ai/flows/enrollmentFlow.tsx** — Step-to-component mapping; must stay in sync with planEnrollmentAgent.
- **src/context/ThemeContext.tsx** — Theme mode and `applyThemeClass` / `applyThemeToDOM`; theme toggle and company branding depend on it.
- **src/main.tsx** — Provider order and CSS import order (tokens, theme, index.css).

**Visual-only** changes (e.g. class names that are **not** referenced by theme CSS or by the footer/layout) can be made to the **same files**, provided the **exported** types and function signatures above are unchanged.

### 4. Files Safe for Visual-Only Refactor

- **components/ui/** — Button, Input, Modal, HelpSectionCard, SectionHeadingWithAccent, etc., as long as **props and usage** at call sites remain valid.
- **Tailwind-only** styling changes in pages that do **not** change: (1) structure passed to EnrollmentFooter (e.g. getDraftSnapshot), (2) enrollment context usage, (3) route paths or guards.
- **Theme tokens** — Adding or renaming **CSS variables** in theme/tokens.css or styles/tokens.css is safe if **consumers** are updated and **load order** in main.tsx is preserved. Changing **.dark** selectors in theme/enrollment-dark.css or index.css is **not** visual-only; it affects behavior in dark mode.
- **Locales** — Changing **value** of existing keys (e.g. copy) is safe; **adding** keys is safe; **renaming or removing** keys requires updating all `t()` calls.

### 5. Suggested Safe Refactor Strategy

1. **Freeze contracts:** Do not change enrollment step paths, draft shape, context API, footer navigation contract, or AI step enum until a single, agreed migration plan is in place.
2. **Replace `window.location.href` with `navigate()`** in EnrollmentFooter in a **dedicated** change, with full regression tests (enrollment flow, draft persistence, back/next, Save & Exit).
3. **Theme:** Prefer **semantic tokens** (CSS variables) and Tailwind for **new** UI; leave existing **.dark** and BEM classes in place until a **theme migration** phase that updates all selectors at once.
4. **i18n:** Keep **key names** stable; move any remaining hardcoded strings in agent/Core AI flows into locale files only when you are ready to add keys and wire `t()` in those modules.
5. **AI:** Do **not** rename or reorder steps in `planEnrollmentAgent` without a coordinated change in BellaScreen and `enrollmentFlow.tsx`. If the **web** wizard step order or names change (e.g. new step), decide whether the **voice** flow should mirror it and update the agent and Core AI flow together.
6. **Layout:** Do not move **EnrollmentProvider** or change the **route tree** for `/enrollment/*` without ensuring draft load/save and guard redirects still run in the same order.
7. **Supabase:** Keep Auth and User providers at the same level relative to the router so session and profile load unchanged. Do not put Supabase calls in render.

### 6. Suggested Migration Plan (Page-by-Page)

| Phase | Scope | Action |
|-------|--------|--------|
| **1** | **Design system** | Introduce new tokens/components in parallel; use only in **new** or **non-critical** screens (e.g. HelpCenter, DemoDashboard) to validate theme and responsiveness. |
| **2** | **Auth pages** | Visual refresh only; keep AuthContext, OtpContext, ProtectedRoute and all handlers unchanged. |
| **3** | **Dashboard (pre/post)** | Visual and layout only; keep navigate targets and data sources; do not change dashboard scenario routing or enrollment entry points. |
| **4** | **Enrollment: ChoosePlan** | Visual/layout only; keep getDraftSnapshot, saveEnrollmentDraft, setSelectedPlan, and redirect logic. |
| **5** | **Enrollment: Contribution** | Visual/layout only; keep useContributionStore, getDraftSnapshot, EnrollmentFooter contract, and redirect to choose-plan when no plan. |
| **6** | **Enrollment: FutureContributions** | Visual/layout only; keep draft save/load and footer. |
| **7** | **Enrollment: Investments** | Visual/layout only; keep guard, draft snapshot, and allocation persistence. |
| **8** | **Enrollment: Review** | Visual/layout only; keep prerequisites and edit navigation. |
| **9** | **EnrollmentFooter & stepper** | After all steps are stable, switch Next to `navigate(nextPath)` and remove `window.location.href`; run full flow and draft tests. |
| **10** | **Theme cleanup** | Once new UI uses tokens everywhere, plan a **single** pass to replace or remove legacy .dark/BEM blocks in index.css and enrollment-dark.css. |
| **11** | **Bella / Core AI** | Only after wizard and theme are stable; restrict to **copy** and **visual** changes in BellaScreen and Core AI modal; do **not** change planEnrollmentAgent step enum or order without a dedicated AI-flow task. |

---

**End of audit.** No code was modified; this document is analysis only.
