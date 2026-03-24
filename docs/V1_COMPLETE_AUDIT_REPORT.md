# V1 Complete Audit Report — Participant Portal

**Purpose:** Deep technical and product audit to guide a V2 rebuild.  
**Scope:** Full repository analysis — architecture, features, components, data, AI/voice, UX, tech debt, and migration strategy.  
**Classification:** Internal; actionable for production rebuild.

---

## 1. PROJECT OVERVIEW

### What This App Does

US retirement **participant portal** for 401(k) / retirement plans: participants sign in, see a pre- or post-enrollment dashboard, enroll in plans (choose plan → contribution → auto-increase → investments → review), manage investments, and run transactions (loans, withdrawals, rollovers, rebalance). A **Core AI assistant** (modal + optional voice) answers retirement questions and can run scripted flows (enrollment, loan, withdrawal, vesting). Company branding and multi-language (en, es) are supported.

### Key Modules / Features

| Module | Purpose | Entry |
|--------|--------|--------|
| **Auth** | Login, signup, OTP verify, forgot/reset password, help | `/`, `/verify`, `/signup`, `/forgot`, `/reset`, `/help` |
| **Dashboard** | Post-login home: pre-enrollment (default), classic, post-enrollment, investment portfolio | `/dashboard`, `/dashboard/classic`, `/dashboard/post-enrollment`, `/dashboard/investment-portfolio` |
| **Enrollment** | Wizard: management hub, choose plan, contribution, auto-increase, investments, review | `/enrollment/*` |
| **Transactions** | List, detail, application flows (loan, withdrawal, rollover, transfer) | `/transactions`, `/transactions/:transactionType/start`, `/transactions/:transactionId` |
| **Investments** | Standalone investments page (allocations, strategies) | `/investments` |
| **Profile** | User profile and documents | `/profile` |
| **Settings** | Theme and app settings | `/settings`, `/settings/theme` |
| **Core AI** | FAB + modal: chat with backend AI, voice in/out, scripted flows | Global FAB (hidden on `/`, `/dashboard`, `/test/pre-enrollment-dashboard`) |

**Tech stack (verified):** React 19, TypeScript, Vite 7, Tailwind CSS, React Router v7, Supabase (auth + Postgres), Express server (dev: Core AI + voice), Netlify Functions (prod: voice STT/TTS, LLM normalize/polish). No React Query/SWR; no Redux/Zustand.

---

## 2. ARCHITECTURE ANALYSIS

### Current Architecture Type

- **SPA** with a single root route and nested children; `createBrowserRouter` in `src/app/router.tsx`; root element `<RootLayout />`.
- **Context-heavy:** Auth → OTP → Theme → AISettings → User at root; EnrollmentProvider in EnrollmentLayout; InvestmentProvider in investments route and in enrollment investments/review; CoreAIModalProvider and NetworkProvider at root. No global store.
- **Feature-oriented folders:** `pages/`, `components/` (by feature: auth, dashboard, enrollment, core-ai, transactions, etc.), `layouts/`, `context/`, `services/`, `enrollment/` (context + logic + types), `features/` (transaction-hub, transactions), `agent/`, `bella/`.
- **Backend:** Supabase from client only; optional Express on port 3001 for `/api/core-ai` and `/api/voice/*` in dev; Netlify has no `/api/core-ai` — production Core AI requires a separate backend.

### Major Issues

1. **No single source of truth for Core AI in production** — `netlify.toml` redirects only `/api/voice/*` and `/api/llm/*`; `/api/core-ai` is not implemented as a Netlify function. Production deployments must run Express (or equivalent) elsewhere and configure the frontend to call it.
2. **Two parallel AI surfaces** — Core AI modal (in use, routed) vs Bella full-page (`BellaScreen.tsx`, 3471 lines, **not in router**). Core AI flows (enrollment, loan, withdrawal, vesting) **import from `bella/agents`**, so Bella agent logic is reused by the modal but the Bella UI is dead for normal users.
3. **Duplicate pre-enrollment experiences** — `/dashboard` uses `components/pre-enrollment` (HeroSection, LearningSection, AdvisorSection); `/test/pre-enrollment-dashboard` uses `components/dashboard/pre-enrollment-test` (HeroSection, LearningSection, SupportSection). Two component sets and two routes; no single canonical implementation.
4. **Legacy route file** — `src/app/routes.tsx` defines `<Routes>` and is **not mounted** anywhere (entry is `main.tsx` → `RouterProvider` with `router` from `router.tsx`). Duplicate route definitions and confusion risk.
5. **EnrollmentContext is a single large context** — One context holds plan, contribution, assumptions, source allocation, auto-increase, investment profile, etc. Any state update re-renders all consumers; no selectors or slicing.
6. **Transaction feature split** — `features/transaction-hub` (e.g. `TransactionIntelligenceHub`) is **not used in the router**; `/transactions` renders `TransactionsPage` from `pages/transactions`. `features/transactions` has `ActivityHero`, `TransactionTimeline`, etc. Overlapping concepts (e.g. transaction timeline, action hub) and unclear ownership between hub vs page.
7. **Multiple stepper components** — `EnrollmentStepper`, `HeaderStepper`, `CustomStepper`, `TransactionStepper`, `LoanFlowStepper`; no single progress stepper with variants.
8. **Enrollment step navigation** — Footer uses `window.location.href = nextPath` for “Next” to force full page load; step order is correctly centralized in `enrollmentStepPaths.ts` and used by EnrollmentFooter, but navigation could be client-side for better UX.
9. **Monolithic CSS** — `src/index.css` is **~18,763 lines**; mix of Tailwind @layer, one-off component styles, and duplication. Theme token migration is partial (see `docs/THEME_TOKEN_AUDIT.md`); many components still use hardcoded Tailwind colors and `dark:` variants.
10. **Empty / stray artifacts** — `enrollment-v2/` is effectively empty; `src/figma-dump/retiresmart-pre-enrollment-portal` is a separate mini-app inside `src` (own Vite app); `src/App.tsx` (Vite default) is unused.

---

## 3. FEATURE & FLOW BREAKDOWN

### Auth Flow

- **Implementation:** `AuthContext` (session, signIn, signUp, signOut); `OtpContext` (isOtpVerified, setOtpVerified); `ProtectedRoute` requires both session and OTP, else redirect to `/` or `/verify?mode=login`. Pages: Login, VerifyCode, ForgotPassword, ForgotPasswordVerify, ResetPassword, HelpCenter, Signup.
- **Data:** Supabase Auth only; profile/company loaded in `UserContext` after auth.
- **Issues:** Signup and Login do direct Supabase `.from("companies")` / `.from("profiles")` in places (e.g. Login.tsx line 77, Signup.tsx 141/234/253); some logic could live in a shared auth/service layer. Signup.tsx is 608 lines — large single file.

### Dashboard Flow

- **Implementation:** Default `/dashboard` → `PreEnrollment` (pre-enrollment HeroSection, LearningSection, AdvisorSection). `/dashboard/classic` → `Dashboard` (classic hero, learning carousel, value props). `/dashboard/post-enrollment` → `PostEnrollmentDashboard`. `/dashboard/investment-portfolio` → `InvestmentPortfolioPage`. `/test/pre-enrollment-dashboard` → `PreEnrollmentDashboardTest` (test hero/learning/support).
- **Issues:** Two dashboard variants (pre-enrollment vs test) with different component sets; no single “main dashboard” contract. Demo dashboard at `/demo` is separate (DemoSwitcher).

### Enrollment Flow

- **Implementation:** `EnrollmentLayout` wraps with `EnrollmentProvider`. Steps: EnrollmentManagement (hub) → choose-plan → contribution → auto-increase → investments (EnrollmentInvestmentsGuard + EnrollmentInvestmentsContent with InvestmentProvider) → review (EnrollmentReviewContent with InvestmentProvider). Step order from `enrollmentStepPaths.ts`; footer uses same paths for Back/Next and Save & Exit (sessionStorage draft via `enrollmentDraftStore`).
- **Backend:** `enrollmentService.saveEnrollmentPlanId(planId)` upserts `enrollments` (user_id, plan_id, status). Draft is client-only (sessionStorage).
- **Issues:** Contribution.tsx (836 lines), FutureContributions.tsx (951 lines), Review.tsx (600 lines) — very large pages; logic and UI mixed. EnrollmentContext holds all wizard state; any change re-renders all consumers.

### Transactions Flow

- **Implementation:** `/transactions` → `TransactionsPage` (list, quick actions, active tracker, history). Start/continue applications → `TransactionApplicationRouter` (route params: transactionType, transactionId). Single transaction view → `TransactionAnalysis`. TransactionApplication uses type-specific flows (e.g. LoanFlow) and step components; data from `transactionService` and local state.
- **Issues:** `TransactionIntelligenceHub` (transaction-hub feature) is never mounted in router; docs (APP_FLOW_MAP.md) say `/transactions` uses it but code uses `TransactionsPage`. Duplicate concepts: `features/transactions` (ActivityHero, ActionHub, TransactionTimeline) vs `features/transaction-hub` (TransactionIntelligenceHub, TransactionTimeline, ActionCommandGrid, guided flows). Guided flows in transaction-hub use mock data.

### Investments Flow

- **Implementation:** `/investments` wrapped by `InvestmentProvider` and `InvestmentsLayout`; page is `InvestmentsPage` (ManualBuilder). InvestmentProvider is also used inside enrollment (investments step and review) with enrollment-derived props.
- **Issues:** InvestmentContext is large (324 lines); used in both standalone investments and enrollment, which is good, but still a single big context.

### Core AI / Voice Flow

- **Implementation:** Core AI: `CoreAIFab` → `CoreAIModalContext` → `CoreAssistantModal`. User types or uses browser speech (`useSpeechRecognition`); message sent to `POST /api/core-ai` via `coreAiService.sendCoreAIMessage` (JWT). Backend (Express) uses intentResolver + retirementService + coreAiController (Gemini); returns reply, type, ui_data, data_sources. Optional scripted flows: `flowRouter` + enrollmentFlow, loanFlow, withdrawalFlow, vestingFlow (these import from `bella/agents`). TTS: `useTextToSpeech` can call `/api/voice/tts` (Express dev; Netlify function prod).
- **Issues:** Core AI backend not in Netlify — production must deploy it separately. Bella full-page UI (BellaScreen) is not routed; only its agents are used by Core AI flows. Two voice hooks: `useTextToSpeech` in core-ai and in `hooks/useTextToSpeech.ts` (verify single implementation). No shared client-side AI state/cache.

---

## 4. COMPONENT AUDIT

### Reusable Components (Safe to Reuse with Minor Checks)

- **Auth:** `AuthLayout`, `AuthInput`, `AuthButton`, `AuthOTPInput`, `AuthPasswordInput`, `ProtectedRoute`, `AuthFooter`, `AuthFormShell` — used across auth pages; some still have hardcoded colors per THEME_TOKEN_AUDIT.
- **UI primitives:** `components/ui`: Button, Input, Modal, Switch, Dropdown, card, ThemeToggle, PasswordStrength, OTPInput, input-otp, etc. — used app-wide; partial token migration.
- **Dashboard shared:** `AnimatedNumber`, `MetricCard`, `ProgressBar`, `SectionHeader`, `StatusBadge` in `components/dashboard/shared` — good for reuse.
- **Layouts:** `RootLayout`, `DashboardLayout`, `EnrollmentLayout`, `InvestmentsLayout` — clear responsibilities.
- **Enrollment:** `EnrollmentFooter`, `EnrollmentInvestmentsGuard`, plan cards, contribution cards, PresetPills, MonthlySummary — used in enrollment flow; footer correctly uses `enrollmentStepPaths.ts`.

### Problematic Components

- **BellaScreen.tsx** (3471 lines) — Single giant component; not in router; only agent modules are used by Core AI. Should not be carried as-is; extract agent usage and drop or drastically shrink the UI.
- **EnrollmentStepper / HeaderStepper / CustomStepper / TransactionStepper / LoanFlowStepper** — Five different steppers; consolidate to one configurable stepper with variants.
- **Pre-enrollment HeroSection, LearningSection (two versions)** — `components/pre-enrollment` vs `components/dashboard/pre-enrollment-test`; different APIs (e.g. HeroSection with gridContainerClass in test). Unify or clearly designate one canonical set.
- **TransactionIntelligenceHub** — Not used in router; duplicates purpose of TransactionsPage. Either integrate into `/transactions` or remove.
- **Large pages with mixed concerns:** FutureContributions (951), Contribution (836), Review (600), Signup (608), PlanDetailManagement (516), FeedbackModal (566), InvestmentProfileWizard (540) — should be split into smaller components and/or hooks.

### Duplicates

- **Pre-enrollment:** Two HeroSections, two LearningSections; AdvisorSection vs SupportSection (different content).
- **Transaction timeline / action UI:** `features/transactions` (ActivityHero, ActionHub, TransactionTimeline) vs `features/transaction-hub` (TransactionTimeline, ActionCommandGrid, FinancialSnapshotStrip); two TransactionTimeline implementations.
- **Routes:** `app/router.tsx` (used) vs `app/routes.tsx` (unused).
- **useTextToSpeech:** Present in `components/core-ai/useTextToSpeech.ts` and `hooks/useTextToSpeech.ts` — confirm single source.

---

## 5. DATA & SUPABASE ANALYSIS

### Tables Used (from code and migrations)

| Table | Usage |
|------|--------|
| **auth.users** | Supabase Auth; AuthContext, UserContext (profile tied to user id). |
| **profiles** | UserContext: select by auth.uid(); upsert on first login if missing. Columns: id, name, company_id, location, role. |
| **companies** | UserContext: select by company_id from profile; Login, Signup also query companies. Columns: id, name, primary_color, secondary_color, branding_json, logo_url. |
| **plans** | plansService: by company; enrollment plan selection. Seed: company_id, name, description, match_info, benefits, sort_order. |
| **enrollments** | enrollmentService: upsert by user_id (plan_id, status, updated_at). One row per user. |
| **feedback** | FeedbackModal: insert feedback row. |
| **company_branding** | Migration exists; app uses `companies.branding_json` and does not reference company_branding table in code. |

### Query Patterns

- **Auth/session:** `supabase.auth.getSession()`, `onAuthStateChange`, `signInWithPassword`, `signUp`, `signOut`, `getUser()`.
- **Profile:** Single select/upsert by user id; then company by company_id.
- **Plans:** Load by company (plansService).
- **Enrollments:** Upsert by user_id (enrollmentService).
- **Feedback:** Single insert.

No React Query/SWR; all fetches are ad-hoc in useEffect with local state. No caching layer; repeated navigations can re-fetch.

### Issues

- **No data abstraction layer** — Components and contexts call Supabase directly or via thin services (enrollmentService, plansService, companyBrandingService). No shared cache, loading, or error boundaries for server state.
- **Login/Signup** — Direct `supabase.from("companies")` / `.from("profiles")` in pages; could be centralized in a small auth/profile service.
- **company_branding table** — Exists in migrations but app uses `companies.branding_json`; clarify schema vs usage.
- **Enrollment draft** — Only in sessionStorage; no server-side persistence of partial enrollment (only plan_id in enrollments when user continues).

---

## 6. AI / VOICE SYSTEM ANALYSIS

### Current Implementation

- **Entry:** Core AI: `CoreAIFab` (RootLayout) → `CoreAIModalProvider` → `CoreAssistantModal`. Bella: `BellaScreen` not in router; entry would be manual import and render.
- **Frontend Core AI:** `CoreAssistantModal` — message list, input, optional voice (useSpeechRecognition → send transcript as message). Replies from `sendCoreAIMessage`; optional TTS via `useTextToSpeech`. Scripted flows: `flowRouter` + intentDetector + enrollmentFlow, loanFlow, withdrawalFlow, vestingFlow; flows import from `bella/agents` (planEnrollmentAgent, loanApplicationAgent, withdrawalInfoAgent, vestingInfoAgent).
- **Backend:** Express: `/api/core-ai` (JWT), `/api/voice/stt`, `/api/voice/tts`. coreAiController uses Gemini; intentResolver + retirementService fetch data; response includes reply, type, spoken_text, ui_data, data_sources. Netlify: voice-stt, voice-tts, llm-normalize, llm-polish; **no core-ai**.
- **Agent (legacy):** `agent/AgentController.ts`, `LLMEnhancer.ts`, `taskDefinitions.ts`, `geminiClient.ts` — deprecated in favor of `/api/core-ai`; still in repo.

### Problems

- **Production Core AI:** Not deployed on Netlify; must run Express (or equivalent) and configure frontend API base.
- **Bella UI dead, Bella agents alive:** Core AI flows depend on `bella/agents`; BellaScreen is 3471 lines and unused in routing — maintenance burden and confusion.
- **Two voice stacks:** Core Assistant uses browser Speech Recognition + optional backend TTS; Bella has its own voice pipeline. Core AI is the single surface that should be kept; Bella voice code is redundant for the current product.
- **Legacy agent code:** `agent/` folder (e.g. AgentController, LLMEnhancer) is deprecated; dead for normal flows; should be removed or clearly marked legacy.
- **Tight coupling:** Core AI modal imports enrollment context optionally (require + try/catch); flow scripts depend on bella agents — for V2, agents should be moved to a dedicated domain (e.g. `core-ai/agents` or `services/ai`) and Core AI should not depend on Bella UI.

### What Can Be Reused in V2

- **coreAiService** — Thin client for POST /api/core-ai; keep interface (message, context, accessToken).
- **flowRouter + intentDetector + flow scripts** — Logic for scripted flows (enrollment, loan, withdrawal, vesting); move agent logic out of `bella/agents` into a single AI/agents module and keep flow orchestration.
- **useSpeechRecognition, useTextToSpeech** — Consolidate to one implementation; reuse for voice in/out in Core AI.
- **CoreAssistantModal, MessageList, MessageInput, MessageBubble, interactive components** — Refactor to smaller components and token-based styling; keep UX pattern (modal, suggestions, flows).
- **Backend contract** — Intent resolution + data fetch + Gemini reply + structured response (reply, type, spoken_text, ui_data, data_sources); replicate in V2 backend.

---

## 7. UX & PRODUCT ISSUES

- **Navigation / discoverability:** Multiple dashboard entry points (/dashboard, /dashboard/classic, /dashboard/post-enrollment) and test route (/test/pre-enrollment-dashboard) without clear naming or navigation; users may not know which dashboard is “home.” Core AI FAB hidden on `/dashboard` and test route — so the main landing has no AI entry.
- **Cognitive overload:** Enrollment wizard has many steps and dense pages (Contribution, FutureContributions, Review); large forms and many options without progressive disclosure. Transaction flows (loan, withdrawal, etc.) are multi-step with separate UIs; hub vs page split adds conceptual noise.
- **Consistency:** Two pre-enrollment UIs (main vs test); two transaction experiences (TransactionsPage vs TransactionIntelligenceHub unused); multiple steppers. Inconsistent patterns for “back,” “next,” and “save and exit.”
- **Feedback and errors:** Auth errors mapped in AuthContext; other surfaces (enrollment, transactions) use local state and toasts; no global error boundary strategy for API failures. FeedbackModal submits to Supabase but success/error UX is local.
- **Accessibility:** Some components use theme tokens; THEME_TOKEN_AUDIT lists many files still with hardcoded colors. Reduced motion used in some places (e.g. TransactionsPage, ActivityHero); not audited app-wide.
- **i18n:** en/es; keys used across the app; some copy may be missing or duplicated (e.g. transactionHub.* vs transactions.*).

---

## 8. TECH DEBT & RISKS

### Critical

- **Core AI not in production** — Netlify has no `/api/core-ai`; production must run and secure a separate backend; frontend must use correct API base.
- **BellaScreen not routed and huge** — 3471-line component and duplicate voice/AI surface; agents used by Core AI but UI is dead code. Risk of accidental edits and regression.
- **EnrollmentContext re-renders** — Single large context; every update re-renders all consumers; can hurt performance as enrollment tree grows.
- **Duplicate pre-enrollment and transaction surfaces** — Two pre-enrollment component sets and two transaction “hubs”; increases maintenance and inconsistency.

### Medium

- **No server-state layer** — No React Query/SWR; duplicate fetches, ad-hoc loading/error handling, no cache invalidation strategy.
- **Monolithic CSS (index.css ~18k lines)** — Hard to maintain; partial token migration; many components still with hardcoded colors and dark:.
- **Large files** — BellaScreen, AgentController, FutureContributions, Contribution, Review, Signup, FeedbackModal, InvestmentProfileWizard, PlanDetailManagement; mixed UI and logic; harder to test and refactor.
- **Legacy routes and entry** — routes.tsx unused; App.tsx (root) unused; figma-dump and enrollment-v2 in repo; confusing for new devs.
- **Enrollment “Next” uses full page navigation** — `window.location.href = nextPath` in EnrollmentFooter; works but loses client-side smoothness and state unless draft is rehydrated.

### Low

- **Multiple steppers** — Five stepper components; consolidation improves consistency and bundle size.
- **company_branding table unused** — Migrations define it; app uses companies.branding_json; schema/docs mismatch.
- **useTextToSpeech in two places** — Ensure one canonical implementation.
- **Docs vs code** — APP_FLOW_MAP says TransactionIntelligenceHub for /transactions; code uses TransactionsPage.

---

## 9. KEEP / REFACTOR / DELETE MATRIX

### ✅ Keep (safe to reuse as-is or with minimal changes)

| Item | Notes |
|------|--------|
| **Router** (`app/router.tsx`) | Single source of truth; structure is clear. Remove duplicate routes.tsx. |
| **AuthContext, OtpContext, ProtectedRoute** | Auth flow works; error mapping is good. |
| **UserContext, ThemeContext** | Profile + company + branding; applyThemeToDOM pattern. |
| **Enrollment step paths** (`enrollmentStepPaths.ts`) | Single source for step order; used by footer and layout. |
| **EnrollmentDraftStore** | sessionStorage draft; clear API. |
| **enrollmentService, plansService, companyBrandingService** | Thin Supabase wrappers; keep and optionally extend. |
| **coreAiService** | Keep interface; backend URL configurable. |
| **Supabase client** (`lib/supabase.ts`) | Timeout fetch; env validation. |
| **Layouts** (Root, Dashboard, Enrollment, Investments) | Clear responsibilities. |
| **UI primitives** (Button, Input, Modal, etc.) | Migrate remaining tokens; keep. |
| **Dashboard shared** (AnimatedNumber, MetricCard, ProgressBar, SectionHeader) | Reuse. |
| **EnrollmentFooter, EnrollmentInvestmentsGuard** | Path-driven; correct use of step paths. |
| **flowRouter, intentDetector, Core AI flow scripts** | Reuse flow logic; move bella/agents into core-ai or services. |
| **useSpeechRecognition, useTextToSpeech** | Unify to one; keep for Core AI. |
| **Theme tokens** (`theme/tokens.css`, `theme/utils.ts`, `theme/defaultThemes.ts`) | Keep token system; finish migration in components. |
| **i18n setup** | Keep; fix missing keys as needed. |
| **Supabase migrations** (enrollments, plans, profiles, companies, RLS) | Keep; align company_branding usage or docs. |

### ⚠️ Refactor (needs improvement before or during V2)

| Item | Notes |
|------|--------|
| **EnrollmentContext** | Split into smaller contexts or move to Zustand (or similar) with selectors to limit re-renders. |
| **CoreAssistantModal** | Break into smaller components; use tokens; optional prompt and flow state in a small store. |
| **Pre-enrollment** | Choose one canonical set (e.g. pre-enrollment or pre-enrollment-test); single route and component set; remove or clearly label the other. |
| **Transactions** | Decide canonical surface (TransactionsPage vs TransactionIntelligenceHub); merge or remove duplicate; single ActivityHero / timeline / action UI. |
| **Steppers** | Single ProgressStepper (or Stepper) with variants for enrollment, transaction, loan. |
| **Contribution, FutureContributions, Review, Signup** | Split into smaller components and hooks; separate business logic from UI. |
| **InvestmentContext** | Consider splitting or selectors if re-renders become an issue. |
| **Data fetching** | Introduce a data/cache layer (e.g. React Query) for profile, company, plans; consistent loading/error handling. |
| **index.css** | Prune and group; move component-specific styles to modules or Tailwind; complete token migration. |
| **Bella agents** (planEnrollmentAgent, loanApplicationAgent, etc.) | Move to `core-ai/agents` or `services/ai`; remove dependency on Bella UI. |
| **Login, Signup** | Extract Supabase calls to a small auth/profile service; reduce page size. |

### ❌ Delete (do not carry forward as-is)

| Item | Notes |
|------|--------|
| **BellaScreen.tsx** | Not in router; 3471 lines; only agents used. Delete UI; keep agent logic elsewhere. |
| **app/routes.tsx** | Unused; duplicate of router. Delete. |
| **src/App.tsx** (root) | Vite default; not in render tree. Delete. |
| **agent/** (AgentController, LLMEnhancer, frontend geminiClient, etc.) | Deprecated; Core AI uses backend. Remove or move to a /legacy or delete. |
| **TransactionIntelligenceHub** (if not integrated) | Unused in router; duplicate of TransactionsPage. Remove or merge into one transaction page. |
| **Pre-enrollment-test** (if canonical is pre-enrollment) | Remove duplicate HeroSection, LearningSection, SupportSection and route, or vice versa. |
| **enrollment-v2/** | Empty or near-empty; remove. |
| **figma-dump inside src/** | Move out of src (e.g. to `/tools` or separate repo) or remove from main app build. |
| **CustomStepper, duplicate steppers** | After introducing single stepper, remove duplicates. |
| **Duplicate useTextToSpeech** | Keep one; remove the other. |

---

## 10. V2 MIGRATION STRATEGY

### What to Move First

1. **Auth and user** — AuthContext, OtpContext, UserContext, ProtectedRoute, Supabase client, auth pages. Minimal changes; ensure env and Supabase URLs are configurable.
2. **Routing and layouts** — Single router (current router.tsx); RootLayout, DashboardLayout, EnrollmentLayout, InvestmentsLayout. Remove routes.tsx and unused App.tsx.
3. **Theme and design tokens** — tokens.css, utils, defaultThemes, ThemeContext; complete token migration for shared components and one canonical set of primitives.
4. **Enrollment core** — enrollmentStepPaths, EnrollmentDraftStore, enrollmentService, EnrollmentProvider (refactored to smaller contexts or store with selectors). One canonical pre-enrollment dashboard and one component set.
5. **Core AI** — coreAiService, flowRouter, intentDetector, flow scripts; move bella/agents into a dedicated module; CoreAssistantModal refactored; single useSpeechRecognition/useTextToSpeech. Deploy Core AI backend (Netlify function or separate service) and configure frontend.
6. **Data layer** — Introduce React Query (or SWR) for profile, company, plans; use in UserContext and enrollment/plans pages. Keep enrollmentService, plansService, companyBrandingService as mutation/query functions.
7. **Transactions** — Single transaction page and flow (either TransactionsPage or merged with TransactionIntelligenceHub); one ActivityHero, one timeline, one set of action components; TransactionApplicationRouter and type-specific flows.
8. **Investments** — InvestmentContext (optionally refactored); investments layout and page; reuse in enrollment investments/review.

### What NOT to Migrate

- **BellaScreen** — Do not migrate the UI; migrate only the agent logic (already used by Core AI).
- **agent/** — Do not migrate; backend handles AI; remove or archive.
- **Duplicate pre-enrollment UI** — Migrate one; drop the other.
- **TransactionIntelligenceHub as separate page** — Either merge into TransactionsPage or drop.
- **Legacy routes (routes.tsx), root App.tsx, enrollment-v2** — Do not migrate; delete.
- **figma-dump** — Do not bundle in main app; move or remove.

### Suggested Order of Rebuilding

1. **Foundation** — Repo cleanup: delete routes.tsx, root App.tsx, enrollment-v2; move or exclude figma-dump; delete or archive agent/; remove BellaScreen UI (keep agents in new module).
2. **Auth + user + theme** — Auth, OTP, User, Theme, Supabase client, ProtectedRoute; token-based auth pages and shared UI.
3. **Routing + layouts** — Single router; RootLayout, DashboardLayout, EnrollmentLayout, InvestmentsLayout; one canonical dashboard (pre-enrollment or classic) and one route.
4. **Data layer** — React Query (or SWR) for profile, company, plans; refactor UserContext and plans loading to use it.
5. **Enrollment** — Refactored EnrollmentContext (or store); step paths and draft store; one pre-enrollment component set; Contribution, FutureContributions, Review split into smaller pieces; single stepper.
6. **Core AI** — Backend for /api/core-ai in production; frontend: coreAiService, flowRouter, flows, agents (moved from bella); CoreAssistantModal refactored; voice hooks unified.
7. **Transactions** — Single transaction list/detail/application surface; one stepper; guided flows if kept, with real data hooks.
8. **Investments** — Standalone and enrollment-embedded; refactor InvestmentContext if needed.
9. **Profile, settings, feedback** — Migrate with token-based UI and shared components.
10. **Polish** — Consolidate steppers; prune index.css; i18n and a11y pass; performance (re-renders, lazy loading).

This order keeps auth and identity first, then layout and data, then the heaviest flows (enrollment, AI, transactions), then the rest. Each step should be shippable so V2 can replace V1 incrementally if needed.

---

*End of V1 Complete Audit Report.*
