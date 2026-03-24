# V2 Architecture Blueprint — Retirement Participant Portal

**Purpose:** Scalable, modular, production-ready architecture for rebuilding the application from scratch.  
**Basis:** V1 Complete Audit Report findings.  
**Goals:** Clean and maintainable; AI-ready (search + voice + actions); white-label ready; multi-client scale; design system (Figma → code) integration.

---

## 1. FOLDER STRUCTURE (STRICT)

```
src/
├── app/                    # App shell: entry, router, providers, error boundary
│   ├── main.tsx
│   ├── router.tsx         # Single createBrowserRouter; no duplicate routes
│   ├── providers.tsx      # Compose Auth, Theme, Query, etc.
│   └── RootLayout.tsx     # Outlet, FAB, global UI (Splash, ErrorBoundary)
│
├── features/              # Feature modules: self-contained slices
│   ├── auth/              # Login, signup, verify, forgot, reset, help
│   │   ├── pages/
│   │   ├── components/
│   │   └── index.ts
│   ├── dashboard/         # Single dashboard: pre/post-enrollment, portfolio
│   │   ├── pages/
│   │   ├── components/
│   │   ├── config.ts      # Dashboard variants / entry logic
│   │   └── index.ts
│   ├── enrollment/        # Wizard: hub, choose-plan, contribution, auto-increase, investments, review
│   │   ├── pages/
│   │   ├── components/
│   │   ├── config/        # Step paths, step labels (single source)
│   │   ├── hooks/
│   │   └── index.ts
│   ├── transactions/      # List, detail, application flows (loan, withdrawal, rollover, transfer)
│   │   ├── pages/
│   │   ├── components/
│   │   ├── flows/         # Per-type flow (LoanFlow, WithdrawalFlow, etc.)
│   │   └── index.ts
│   ├── investments/       # Standalone + enrollment-embedded
│   │   ├── pages/
│   │   ├── components/
│   │   └── index.ts
│   ├── profile/
│   ├── settings/
│   └── feedback/
│
├── components/            # Shared UI only (no feature-specific)
│   ├── ui/                # Primitives: Button, Input, Modal, Stepper, etc.
│   ├── layout/            # DashboardLayout, EnrollmentLayout, etc.
│   └── design-system/     # DS documentation / Figma-connected primitives
│
├── ai/                    # AI layer: one place for Core AI + voice + agents
│   ├── client/            # coreAiService, API client
│   ├── flows/             # flowRouter, intentDetector, enrollment/loan/withdrawal/vesting flows
│   ├── agents/            # Migrated from bella: planEnrollment, loanApplication, withdrawal, vesting
│   ├── voice/             # useSpeechRecognition, useTextToSpeech (single impl)
│   ├── components/        # FAB, Modal, MessageList, MessageInput, MessageBubble, interactive
│   └── store/             # Optional: AI modal open state, last prompt (if not in UI store)
│
├── services/              # Data access only (Supabase + API calls)
│   ├── supabase.ts        # Single client; timeout fetch; env validation
│   ├── auth.ts            # signIn, signUp, signOut, getSession (no profile)
│   ├── profile.ts         # getProfile, upsertProfile (uses auth.getUser)
│   ├── company.ts         # getCompany, getCompanyBranding (by company_id)
│   ├── plans.ts           # getPlansByCompany
│   ├── enrollment.ts      # saveEnrollmentPlanId, getEnrollment
│   ├── transactions.ts    # list, get, create/update (transaction service)
│   └── feedback.ts        # submitFeedback
│
├── store/                 # Global client state (Zustand)
│   ├── auth.ts            # Session + user id (synced from Supabase; minimal)
│   ├── enrollment.ts      # Enrollment wizard state; selectors to avoid re-renders
│   ├── ui.ts              # Theme mode, modal open states, sidebar, etc.
│   └── ai.ts              # Optional: Core AI modal open, initial prompt
│
├── hooks/                 # Shared hooks (data, UI, media)
│   ├── useAuth.ts         # From store/auth or thin wrapper
│   ├── useProfile.ts      # React Query: profile + company
│   ├── usePlans.ts        # React Query: plans by company
│   ├── useEnrollment.ts   # From store/enrollment
│   ├── useMediaQuery.ts
│   ├── useReducedMotion.ts
│   └── ...
│
├── styles/                # Global styles only; tokens + base
│   ├── tokens.css         # CSS variables (light/dark from theme)
│   ├── theme-light.css    # Light defaults
│   ├── theme-dark.css     # Dark defaults
│   ├── base.css           # Reset, typography base, utility classes
│   └── index.css          # Imports only; no component-specific bloat
│
├── lib/                   # Pure utilities and infra
│   ├── queryClient.ts     # React Query client and defaults
│   ├── network/           # timeoutFetch, NetworkProvider
│   └── analytics/         # Clarity, etc.
│
├── types/                 # Shared TypeScript types
│   ├── auth.ts
│   ├── profile.ts
│   ├── enrollment.ts
│   ├── transaction.ts
│   ├── plan.ts
│   └── api.ts
│
├── config/                # App config (env, feature flags, routes)
│   ├── env.ts
│   └── routes.ts           # Path constants only (optional; router is source of truth)
│
├── locales/               # i18n: en, es
│   └── ...
│
└── theme/                 # White-label: apply theme to DOM from company branding
    ├── utils.ts           # applyThemeToDOM, clearThemeFromDOM
    ├── defaultThemes.ts   # Fallback theme (light/dark)
    └── types.ts
```

### Why each exists

| Folder | Why |
|--------|-----|
| **app/** | Single place for bootstrap: router, provider tree, root layout. No feature logic; only composition. |
| **features/** | Feature slices own their pages, components, and feature-specific hooks/config. Clear boundaries; no cross-feature imports except via shared layers. |
| **components/** | Shared UI and layout only. Primitives in `ui/`; layout shells in `layout/`. Design-system for Figma-connected components. |
| **ai/** | One AI surface: client, flows, agents (no bella), voice hooks, UI components, optional store. No AI logic in features except calling ai/client and rendering ai/components. |
| **services/** | All Supabase and API access. No React; only functions. Used by React Query and store. |
| **store/** | Global client state with Zustand. Auth (minimal), enrollment (with selectors), UI, optional AI. Avoids Context re-render issues. |
| **hooks/** | Shared hooks for data (wrapping React Query or store) and UI (media, motion). Feature-specific hooks live in features/*/hooks. |
| **styles/** | Global tokens and base only. Component styles via Tailwind + tokens in components; no 18k-line index.css. |
| **lib/** | Query client, network, analytics. No business logic. |
| **types/** | Shared domain types. Features can re-export or extend. |
| **config/** | Env and route constants. Keeps env usage in one place. |
| **theme/** | White-label: read company branding, apply CSS variables to document. |

---

## 2. STATE MANAGEMENT STRATEGY

### Principle

- **Server state** → React Query (profile, company, plans, enrollment server record, transactions). Caching, loading, errors in one place.
- **Global client state** → Zustand (auth session ref, enrollment wizard, UI, optional AI modal). Use selectors so only subscribers to a slice re-render.
- **Local state** → useState/useReducer in components for form inputs, toggles, ephemeral UI (e.g. dropdown open). No Context for wizard or large trees.

### By domain

| Domain | Where | Tool | Notes |
|--------|--------|------|--------|
| **Auth** | `store/auth.ts` | Zustand | Store: `session`, `userId`, `loading`. Actions: `setSession`, `signOut`. Synced from Supabase `onAuthStateChange` in a single subscription (e.g. in `app/providers.tsx`). No profile/company here. |
| **Profile + Company** | Server | React Query | `useProfile()` = useQuery profile + company (or two queries). Cache key: `['profile', userId]`, `['company', companyId]`. Invalidate on profile update. |
| **Plans** | Server | React Query | `usePlans(companyId)` = useQuery. Cache key: `['plans', companyId]`. |
| **Enrollment (wizard)** | `store/enrollment.ts` | Zustand | Single store: plan, contribution, assumptions, source allocation, auto-increase, investment profile. **Selectors:** `useEnrollmentPlan()`, `useEnrollmentContribution()`, etc., so only components that need a slice subscribe. Persist draft to sessionStorage in a middleware or on key actions (Save & Exit, step change). |
| **Enrollment (server)** | Server | React Query + services | `useEnrollment()` = useQuery enrollments for user; mutation `saveEnrollmentPlanId`. |
| **Transactions** | Server | React Query | `useTransactions()`, `useTransaction(id)`; mutations for create/update. List/detail stay in React Query. |
| **Investments (standalone)** | Local or store | Zustand or local | If shared with enrollment: small Zustand slice (e.g. allocation edit state). If only for investments page: local state in feature. |
| **AI** | Optional `store/ai.ts` + component state | Zustand + useState | Store: `isModalOpen`, `initialPrompt` (for “Ask AI about this plan”). Messages and flow state can stay in Core AI component state or a small store if needed for persistence. |
| **UI** | `store/ui.ts` | Zustand | Theme mode (light/dark/system), sidebar open, modal stack or “which modal is open,” toasts. |

### What uses local state only

- Form fields (contribution amount, loan amount, etc.) until committed to store or server.
- Dropdown/popover open state.
- Stepper “current step” is derived from URL in enrollment/transactions, not stored in state.
- Per-page ephemeral state (e.g. “success message visible”).

### Summary table

| State type | Tool | Example |
|------------|------|--------|
| Session / user id | Zustand (auth) | `useAuthStore(s => s.session)` |
| Profile, company, plans, enrollments, transactions | React Query | `useProfile()`, `usePlans(companyId)` |
| Enrollment wizard (plan, contribution, …) | Zustand (enrollment) + selectors | `useEnrollmentPlan()`, `useEnrollmentContribution()` |
| Theme mode, modals, sidebar | Zustand (ui) | `useUIStore(s => s.themeMode)` |
| AI modal open, initial prompt | Zustand (ai) or local | `useAIStore(s => s.isOpen)` |
| Form inputs before submit | useState | In feature components |

---

## 3. DATA LAYER DESIGN

### Access pattern

- **UI never imports Supabase directly.** UI uses:
  - **React Query hooks** for read: `useProfile()`, `usePlans(companyId)`, `useEnrollment()`, `useTransactions()`, etc.
  - **Mutation functions** that call **services**: `profileService.upsert()`, `enrollmentService.savePlanId()`, etc.
- **services/** expose plain async functions that use the single `supabase` client from `services/supabase.ts`. They return raw data or throw; no React.

### Service layout (concrete)

```
services/
  supabase.ts       # createClient; timeout fetch; throw if env missing
  auth.ts           # getSession, onAuthStateChange callback, signIn, signUp, signOut
  profile.ts        # getProfile(userId), upsertProfile(userId, data)
  company.ts        # getCompany(companyId), getCompanyBranding(companyId) → branding_json + logo
  plans.ts          # getPlansByCompany(companyId)
  enrollment.ts     # getEnrollment(userId), saveEnrollmentPlanId(userId, planId)
  transactions.ts   # listTransactions(userId), getTransaction(id), create/update as needed
  feedback.ts       # submitFeedback(data)
```

### Query/mutation structure

- **React Query:** One `QueryClient` in `lib/queryClient.ts`; provider in `app/providers.tsx`.
- **Query keys:** Consistent and hierarchical, e.g. `['profile', userId]`, `['company', companyId]`, `['plans', companyId]`, `['enrollment', userId]`, `['transactions', userId]`, `['transaction', id]`.
- **Mutations:** Call service then `queryClient.invalidateQueries(...)` so reads refetch. Example: after `enrollmentService.saveEnrollmentPlanId()`, invalidate `['enrollment', userId]` and optionally `['profile', userId]` if profile reflects enrollment status.

### Caching strategy

- **profile:** staleTime 5 min; refetch on window focus if stale. Invalidate on profile update mutation.
- **company:** staleTime 10 min (branding changes rarely). Invalidate when company is updated (admin flow).
- **plans:** staleTime 10 min. Invalidate when plans are updated (admin).
- **enrollment:** staleTime 1 min or 0; enrollment is critical path. Invalidate after save mutation.
- **transactions:** staleTime 2 min; invalidate after create/update.

### Separation summary

| Layer | Responsibility |
|-------|----------------|
| **UI / features** | useQuery, useMutation, render; never call Supabase. |
| **hooks/** | useProfile, usePlans, useEnrollment (server), useTransactions — wrap useQuery/useMutation with correct keys and services. |
| **services/** | Supabase calls only; used by React Query mutations and by auth store sync. |

---

## 4. AI ARCHITECTURE (VERY IMPORTANT)

### Principles

- **One AI surface:** Core AI only (FAB + modal). No Bella UI; no second voice/AI surface.
- **Agents live in the app** in `ai/agents/` (migrated from bella). Backend only does intent + data fetch + LLM call; scripted flow logic stays in frontend.
- **Voice:** Single implementation of speech recognition and TTS in `ai/voice/`; used only by Core AI modal.
- **Modular:** UI (FAB, modal, messages) can be swapped; client and flows/agents stay stable.

### Layout

```
ai/
  client/           # API client only
    coreAi.ts        # sendMessage(message, context?, accessToken?) → reply, type, ui_data, data_sources
    types.ts         # CoreAIRequest, CoreAIResponse
  flows/            # Scripted flow orchestration (no Bella import)
    flowRouter.ts   # routeMessage(input, activeFlow, respond) → messages + next flow state
    intentDetector.ts
    enrollmentFlow.tsx
    loanFlow.tsx
    withdrawalFlow.tsx
    vestingFlow.tsx
  agents/           # Logic moved from bella/agents; no UI
    planEnrollment.ts
    loanApplication.ts
    withdrawalInfo.ts
    vestingInfo.ts
  voice/
    useSpeechRecognition.ts   # Single impl; callback(transcript)
    useTextToSpeech.ts        # Single impl; speak(text), stop()
  components/
    CoreAIFab.tsx
    CoreAssistantModal.tsx   # Compose: MessageList, MessageInput, flow UI
    MessageList.tsx
    MessageInput.tsx
    MessageBubble.tsx
    interactive/             # Chips, cards, sliders for flows
  store/
    aiStore.ts       # Optional: isOpen, initialPrompt (set by “Ask AI about this plan”)
```

### How frontend interacts with AI

1. **User types or speaks** → MessageInput (and voice hook) sends text to Core AI handler.
2. **Handler** calls `flowRouter.routeMessage(text, activeFlow, respond)`.
   - If a scripted flow handles it: flow returns messages + updated flow state; optional interactive UI (chips, cards) rendered inside MessageBubble or below.
   - If not: handler calls `coreAi.sendMessage(text, context, accessToken)` and appends reply to messages.
3. **Context** passed to backend: e.g. `{ isEnrolled, currentRoute, selectedPlanId }` from store/hooks (no direct enrollment context import); backend uses it for intent + data fetch.
4. **Backend** (existing contract): POST `/api/core-ai` with JWT; returns `reply`, `type`, `spoken_text`, `ui_data`, `data_sources`. Optional TTS: frontend calls `/api/voice/tts` with `spoken_text` and plays audio via `useTextToSpeech`.

### Where agents/flows live

- **Frontend:** `ai/agents/*` — pure logic (steps, validation, next step); used by `ai/flows/*.tsx`. No UI in agents.
- **Frontend:** `ai/flows/*` — React components for flow steps (e.g. amount slider, confirmation); call agents for state transitions and call `respond(text)` to inject messages.
- **Backend:** Intent resolution, data fetch (retirement accounts, plan rules), Gemini call, structured response. No scripted flow state; that stays in frontend.

### Voice integration

- **Input:** `useSpeechRecognition` in `ai/voice/`. On final transcript, call the same handler as text input (so flowRouter or sendMessage gets it).
- **Output:** After receiving `spoken_text` from Core AI, optionally call `useTextToSpeech().speak(spoken_text)`. TTS can hit `/api/voice/tts` (Netlify or backend) or browser TTS; single abstraction in `useTextToSpeech`.

### Bella removal

- **Delete:** All of `bella/` UI (BellaScreen, BellaScreenLayout, ManualInvestmentUI, EnrollmentDecisionUI).
- **Migrate:** `bella/agents/*` → `ai/agents/` with same exported functions/types. Update `ai/flows/*` to import from `ai/agents/` instead of `@/bella/agents`.
- **No dependency:** No file in V2 should import from `bella/`.

---

## 5. COMPONENT ARCHITECTURE

### Layers

1. **Design system layer** (`components/ui/` + `components/design-system/`)
   - **ui/:** Primitives: Button, Input, Modal, Card, Stepper, Switch, Dropdown, etc. All use design tokens (CSS variables). No feature logic; no direct Supabase.
   - **design-system/:** Same primitives plus documentation and, if used, Figma Code Connect mappings. Figma-generated code lands here or in `ui/` after review; must use tokens and shared props.

2. **Layout components** (`components/layout/`)
   - DashboardLayout, EnrollmentLayout, InvestmentsLayout, AuthLayout. They compose slots (header, children, footer) and use tokens. No business logic; receive content as children or render props.

3. **Feature components** (inside `features/*/components/`)
   - Feature-specific: PlanCard, ContributionCard, LoanFlowStepper (if not unified), ActivityHero, etc. They may use store, React Query, and ai client; they import from `components/ui` and `components/layout`, not from other features.

### Rules

- **Shared components** (`components/`) do not import from `features/` or `ai/` (except possibly a minimal ai hook for “Ask AI” that only opens the modal). They do not use React Query or enrollment/transaction store directly; they receive data via props.
- **Feature components** may use hooks (useProfile, useEnrollment from store, etc.) and pass data down to shared components.
- **One Stepper:** A single `Stepper` (or `ProgressStepper`) in `components/ui/` with props for steps and active index; variants for “enrollment” vs “transaction” are styling or step shape, not different components.

### Figma integration

- **Figma → code:** New or updated components from Figma are implemented (or adjusted) in `components/ui/` or `components/design-system/` using:
  - Design tokens only (no hardcoded hex/slate/blue).
  - Same API as existing primitives where applicable (e.g. Button variant, size).
- **Code Connect (optional):** Map Figma components to these code components so future Figma changes are tied to the same files. Keep mappings in `components/design-system/` or a dedicated config.
- **Safety:** Figma-generated code is treated as a draft: run through token replacement and API alignment before merging. No 18k-line CSS; keep styles in Tailwind + tokens + small component-scoped files if needed.

---

## 6. ROUTING STRUCTURE

### Route hierarchy (single router in `app/router.tsx`)

```
/                           → Login (public)
/verify                     → VerifyCode (public)
/signup                     → Signup (public)
/forgot                     → ForgotPassword (public)
/forgot/verify              → ForgotPasswordVerify (public)
/reset                      → ResetPassword (public)
/help                       → HelpCenter (public)

/dashboard                  → PreEnrollment dashboard (protected) — single “home”
/dashboard/post-enrollment  → PostEnrollment dashboard (protected)
/dashboard/portfolio        → Investment portfolio view (protected)

/enrollment                 → EnrollmentLayout (protected)
  index                     → Enrollment hub
  choose-plan               → Choose plan step
  contribution              → Contribution step
  auto-increase             → Auto-increase step
  investments               → Investments step (with InvestmentProvider)
  review                    → Review step

/transactions               → Transactions list (protected)
/transactions/:type/start   → Start new transaction (protected)
/transactions/:type/:id     → Continue transaction (protected)
/transactions/:id          → Transaction detail (protected)

/investments                → InvestmentsLayout + Investments page (protected)

/profile                    → Profile (protected)
/settings                   → Settings hub (protected)
/settings/theme             → Theme settings (protected)
```

### Dashboard entry logic (no duplicates)

- **Single “home” dashboard:** `/dashboard` always renders one component (e.g. `PreEnrollmentDashboard`). No `/dashboard/classic` or `/test/pre-enrollment-dashboard` in V2. One set of dashboard components (hero, learning, advisor/support) in `features/dashboard/components/`.
- **Entry logic:** If product needs “pre vs post enrollment” view, do it inside the same route: e.g. `useEnrollment()` (server) and/or enrollment store; render PreEnrollment view or PostEnrollment view in one page. No duplicate routes for the same concept.

### Enrollment routing

- **Step order** defined once in `features/enrollment/config/steps.ts` (paths + labels). Layout and footer read from this; no hardcoded path arrays in footer.
- **Navigation:** Client-side only. `navigate(nextPath)` on Next; Back with `navigate(prevPath)`. Draft persisted to sessionStorage on Save & Exit and on step change; rehydrate store when entering enrollment.

### Transaction routing

- **List:** `/transactions` → single Transactions page (one implementation; no TransactionIntelligenceHub duplicate).
- **Start:** `/transactions/loan/start`, `/transactions/withdrawal/start`, etc. → same `TransactionApplicationRouter` that reads `type` from params and renders LoanFlow, WithdrawalFlow, etc.
- **Continue:** `/transactions/loan/:id` → same router, load draft or server state by `id`.
- **Detail:** `/transactions/:id` (no type prefix) → transaction detail page (e.g. TransactionAnalysis).

---

## 7. DESIGN SYSTEM STRATEGY

### Tokens

- **Single source:** `styles/tokens.css` (and/or theme utils) define CSS variables for:
  - Surfaces: `--surface-1`, `--surface-2`, `--surface-primary`, …
  - Text: `--text-primary`, `--text-secondary`
  - Border: `--border-subtle`
  - Brand: `--brand-primary`, `--brand-hover`, `--brand-active`
  - Semantic: `--danger`, `--success`, `--warning`
  - Radius, spacing, shadows: `--radius-sm`, `--spacing-2`, `--shadow-lg`, etc.
- **Themes:** `theme-light.css` and `theme-dark.css` set those variables for light/dark. Default (no company) uses these.

### White-label

- **Company branding:** From `companies.branding_json` (and logo_url, primary_color, secondary_color). When profile/company load, call `applyThemeToDOM(companyTheme)` in `theme/utils.ts` to override the same CSS variables (and optionally set logo, favicon).
- **No hardcoded colors in components.** Use `var(--brand-primary)`, `var(--text-primary)`, etc. in Tailwind: `bg-[var(--surface-1)]`, `text-[var(--text-primary)]`. No `text-slate-700` or `dark:text-slate-300`; theme switch is done by swapping variables (e.g. class `light` / `dark` on `<html>` and/or company overrides).

### Avoiding hardcoded styles

- **Lint/rule:** Disallow hex/slate/gray/blue in component files; allow only `var(--*)` or Tailwind token references (if configured). Optional stylelint rule.
- **Component audit:** New or Figma-sourced components must use tokens before merge.
- **Base styles:** `styles/base.css` for reset and typography; no feature-specific or one-off component CSS in global files. Component-specific styles stay in the component (Tailwind + optional small CSS module) or in a single shared “component overrides” file that uses tokens.

---

## 8. MIGRATION STRATEGY (FROM V1 → V2)

### Move first (reuse and adapt)

| Item | Action |
|------|--------|
| Supabase client | Copy `lib/supabase.ts` → `services/supabase.ts`; keep env validation and timeout. |
| Auth flow | Implement `store/auth.ts` (Zustand) synced from Supabase; keep auth pages and ProtectedRoute; move Supabase auth calls to `services/auth.ts`. |
| Theme | Copy `theme/utils.ts`, `theme/defaultThemes.ts`, `styles/tokens.css` (and light/dark); keep `applyThemeToDOM` from company branding. |
| Router shape | Keep route list and layout structure from `app/router.tsx`; drop duplicate routes and test dashboard; single dashboard route. |
| Enrollment step config | Move `enrollmentStepPaths.ts` → `features/enrollment/config/steps.ts`; keep single source. |
| Enrollment draft | Keep sessionStorage draft shape; reimplement read/write in enrollment store (Zustand) with optional persist middleware or manual save. |
| coreAiService | Copy to `ai/client/coreAi.ts`; same interface; configurable base URL. |
| flowRouter + intentDetector + flows | Move to `ai/flows/`; replace bella/agents imports with `ai/agents/`. |
| Bella agents | Move `bella/agents/*` → `ai/agents/` (rename to planEnrollment, loanApplication, etc.); remove UI. |
| useSpeechRecognition, useTextToSpeech | Keep one implementation in `ai/voice/`; delete duplicate. |
| UI primitives | Migrate Button, Input, Modal, etc. to token-only; put in `components/ui/`. |
| Layouts | Copy RootLayout, DashboardLayout, EnrollmentLayout, InvestmentsLayout to `app/` and `components/layout/`; strip any feature logic. |

### Rebuild (do not copy as-is)

| Item | Action |
|------|--------|
| Enrollment state | Rebuild with Zustand + selectors; no single EnrollmentContext. |
| Profile/company/plans loading | Rebuild with React Query + `services/profile.ts`, `company.ts`, `plans.ts`; remove UserContext profile fetch, keep theme application on company load. |
| Dashboard | One dashboard page and one component set (pre + post logic inside if needed). |
| Transactions | One list/detail/application implementation; one Stepper; one set of flows. |
| Core AI modal | Rebuild modal with smaller components (MessageList, MessageInput, etc.); use ai store or local state; token-based styles. |
| Large pages | Contribution, FutureContributions, Review, Signup: split into smaller components and hooks; wire to enrollment store and services. |
| Stepper | Build single `Stepper` in `components/ui/`; replace all five V1 steppers. |

### Completely ignore (do not migrate)

| Item | Reason |
|------|--------|
| BellaScreen and all Bella UI | Dead code; only agents are reused (moved to ai/agents). |
| `app/routes.tsx` | Unused duplicate router. |
| Root `App.tsx` (Vite default) | Not in tree. |
| `agent/` (AgentController, LLMEnhancer, etc.) | Deprecated; backend handles AI. |
| TransactionIntelligenceHub | Duplicate of transactions page; merge ideas into one page or drop. |
| Pre-enrollment-test (second HeroSection, etc.) | One canonical pre-enrollment only. |
| enrollment-v2/ | Empty. |
| figma-dump in src | Move out of src or remove from build. |
| Legacy Context for enrollment | Replaced by Zustand + selectors. |

### Suggested build order (for dev team)

1. **Repo and foundation** — New V2 folder structure; `app/main.tsx`, `app/router.tsx`, `app/providers.tsx`, `app/RootLayout.tsx`; add Zustand, React Query; `services/supabase.ts` and `lib/queryClient.ts`.
2. **Auth and theme** — `store/auth.ts`, `services/auth.ts`, auth pages, ProtectedRoute; theme utils and tokens; apply theme from company when available.
3. **Data layer** — `services/profile.ts`, `company.ts`, `plans.ts`, `enrollment.ts`; React Query hooks (useProfile, usePlans, useEnrollment server); use profile/company for theme and for conditional dashboard.
4. **Dashboard** — Single dashboard route and one set of components (hero, learning, advisor).
5. **Enrollment** — `store/enrollment.ts` with selectors; step config; draft persist; enrollment layout and steps; single Stepper.
6. **AI** — `ai/client`, `ai/agents` (migrated), `ai/flows`, `ai/voice`, `ai/components` (FAB, modal); backend `/api/core-ai` deployable (e.g. Netlify function or separate service).
7. **Transactions** — Services and React Query; single transactions page and TransactionApplicationRouter; flow components.
8. **Investments, profile, settings, feedback** — Features and pages; shared UI only.
9. **Polish** — Token pass on all components; i18n; a11y; performance (selectors, lazy routes).

This blueprint is directly buildable: folder structure, state boundaries, data flow, AI layout, and migration list are all specified for this retirement participant portal.

---

*End of V2 Architecture Blueprint.*
