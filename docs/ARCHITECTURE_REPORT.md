# Architecture Documentation Report  
## US Retirement Participant Portal

**Purpose:** Onboarding and pre-refactor reference for new developers.  
**Scope:** Full repository audit — tech stack, structure, routing, state, Supabase, duplication, and refactoring priorities.  
**Classification:** Internal technical documentation.

---

## 1️⃣ PROJECT OVERVIEW

### Tech stack

| Layer | Technology |
|-------|------------|
| **UI** | React 19, TypeScript |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS, CSS variables (design tokens), theme layers (light/dark/enrollment-dark) |
| **Routing** | React Router v7 (createBrowserRouter) |
| **Backend / DB** | Supabase (auth, Postgres, RLS) |
| **AI / Voice** | Core AI service (backend proxy to Gemini), Google Cloud Speech-to-Text / Text-to-Speech (server + Netlify functions) |
| **i18n** | i18next, react-i18next (en, es) |
| **UI libraries** | Radix UI (dialog, checkbox, label, slot), Framer Motion, Recharts, MUI (partial), Lucide React |
| **Analytics / UX** | Microsoft Clarity, UXtweak, UXsniff (optional, env-driven) |

### Build system

- **Bundler:** Vite 7 with `@vitejs/plugin-react`.
- **Path alias:** `@` → `./src`.
- **Dev server:** Vite dev server; `/api` proxied to `http://localhost:3001` (Express server).
- **Output:** Static build in `dist/`; SPA with client-side routing.

### Architecture style

- **SPA:** Single HTML entry (`index.html` → `src/main.tsx`), no server-rendered routes.
- **Context-heavy:** No Redux/Zustand; React Context for auth, user, theme, AI settings, enrollment, investment, OTP, network.
- **Feature-sliced under `src/`:** `pages/`, `components/` (by feature), `layouts/`, `context/`, `services/`, `enrollment/` (context + logic), `features/` (transaction-hub, transactions), `agent/`, `bella/` (AI/voice).
- **Backend:** Supabase from client; optional Express server for Core AI, STT/TTS (dev); Netlify Functions for voice/LLM in production (no Core AI in Netlify currently).

### Main design patterns

- **Provider nesting:** Auth → OTP → Theme → AISettings → User → Router (and Network, CoreAIModal at root).
- **Layout composition:** RootLayout (Outlet) → route-specific layouts (EnrollmentLayout, DashboardLayout, InvestmentsLayout).
- **Protected routes:** `<ProtectedRoute>` wraps authenticated pages; redirects to `/` or `/verify` when not signed in or OTP not verified.
- **Service layer:** `coreAiService`, `plansService`, `enrollmentService`, `companyBrandingService`, etc.; Supabase client from `src/lib/supabase.ts`.
- **Enrollment:** URL-driven steps; `EnrollmentContext` + `enrollmentDraftStore` (sessionStorage); step order in `enrollmentStepPaths.ts` and duplicated in footer navigation.

---

## 2️⃣ COMPLETE FOLDER STRUCTURE

Repository tree (depth 4, excluding `node_modules`, `.git`, `dist`, `server/node_modules`):

```
participant-portal-auth-clean (repo-root)
├── .env.example
├── .env.development
├── .env.production
├── .env.staging
├── .gitignore
├── .vscode
├── index.html
├── netlify.toml
├── package.json
├── package-lock.json
├── public
│   ├── image
│   │   ├── avatars
│   │   ├── icons
│   │   ├── learning
│   │   └── hero-illustration.svg
│   ├── logos
│   └── HERO-BANNER-README.txt
├── server
│   ├── index.js
│   ├── coreAiController.js
│   ├── intentResolver.js
│   ├── supabaseAdmin.js
│   └── services
│       └── retirementService.js
├── netlify
│   └── functions
│       ├── voice-stt.js
│       ├── voice-tts.js
│       ├── llm-normalize.js
│       ├── llm-polish.js
│       ├── package.json
│       └── utils
├── scripts
├── src
│   ├── main.tsx
│   ├── App.tsx                    # Unused (Vite default)
│   ├── index.css
│   ├── i18n.ts
│   ├── app
│   │   ├── router.tsx            # Canonical router (createBrowserRouter)
│   │   ├── routes.tsx             # Legacy <Routes> (unused)
│   │   ├── App.tsx                # Wraps AppRoutes (unused in main flow)
│   │   └── investments
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── agent                      # LLM/intent (deprecated: use /api/core-ai)
│   │   ├── AgentController.ts
│   │   ├── LLMEnhancer.ts
│   │   ├── geminiClient.ts
│   │   ├── intentClassifier.ts
│   │   ├── taskDefinitions.ts
│   │   └── ...
│   ├── assets
│   │   ├── avatars
│   │   ├── dashboard
│   │   └── learning
│   ├── bella                     # Full-page voice/AI (not in router)
│   │   ├── BellaScreen.tsx
│   │   ├── agents
│   │   ├── lib
│   │   └── ui
│   ├── components
│   │   ├── ai
│   │   │   └── CoreAIFab.tsx
│   │   ├── auth
│   │   ├── brand
│   │   ├── common
│   │   ├── core-ai
│   │   │   ├── CoreAssistantModal.tsx
│   │   │   ├── flows
│   │   │   ├── interactive
│   │   │   ├── useSpeechRecognition.ts
│   │   │   └── useTextToSpeech.ts
│   │   ├── dashboard
│   │   │   ├── core
│   │   │   ├── modules
│   │   │   ├── pre-enrollment-test
│   │   │   └── shared
│   │   ├── demo
│   │   ├── enrollment
│   │   │   └── steps
│   │   ├── feedback
│   │   ├── investment-portfolio
│   │   ├── investments
│   │   ├── layout
│   │   ├── loan
│   │   ├── pre-enrollment
│   │   ├── profile
│   │   ├── system
│   │   ├── transactions
│   │   ├── ui
│   │   ├── voice
│   │   └── wizard
│   ├── config
│   ├── constants
│   ├── context
│   ├── data
│   ├── enrollment
│   │   ├── context
│   │   ├── logic
│   │   └── types
│   ├── enrollment-v2            # Sparse (e.g. .DS_Store)
│   ├── features
│   │   ├── transaction-hub
│   │   │   ├── components
│   │   │   ├── data
│   │   │   ├── hooks
│   │   │   └── utils
│   │   └── transactions
│   │       ├── components
│   │       ├── hooks
│   │       └── types
│   ├── figma-dump
│   │   └── retiresmart-pre-enrollment-portal
│   ├── hooks
│   ├── layouts
│   │   ├── DashboardLayout.tsx
│   │   ├── EnrollmentLayout.tsx
│   │   └── RootLayout.tsx
│   ├── lib
│   │   ├── analytics
│   │   ├── network
│   │   └── supabase.ts
│   ├── locales
│   │   ├── en
│   │   ├── es
│   │   └── ...
│   ├── mock
│   ├── pages
│   │   ├── auth
│   │   ├── dashboard
│   │   │   └── scenarios
│   │   ├── enrollment
│   │   ├── profile
│   │   ├── settings
│   │   │   └── theme-editor
│   │   ├── transactions
│   │   │   ├── applications
│   │   │   │   ├── loan
│   │   │   │   ├── rollover
│   │   │   │   ├── transfer
│   │   │   │   └── withdrawal
│   │   │   ├── components
│   │   │   └── flows
│   │   └── PreEnrollmentDashboardTest.tsx
│   ├── services
│   ├── theme
│   ├── types
│   ├── ui
│   └── utils
├── supabase
│   └── migrations
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 3️⃣ ENTRY POINT ANALYSIS

### Bootstrap flow

1. **HTML:** `index.html` loads `<script type="module" src="/src/main.tsx">` and mounts into `<div id="root">`.
2. **main.tsx** (entry):
   - Imports i18n, theme CSS (tokens, light, dark, enrollment-dark), `index.css`.
   - Loads optional third-party scripts: UXtweak, UXsniff, Clarity (env-driven).
   - Reads `localStorage.theme` and applies `light`/`dark` to `document.documentElement` before paint to avoid flash.
   - Renders:
     - `I18nextProvider` (i18n)
     - `StrictMode`
     - `RootWithLanguageKey` (key = current language so router remounts on locale change)
   - **RootWithLanguageKey** wraps: `NetworkProvider` → `NetworkBanner` → `AuthProvider` → `OtpProvider` → `ThemeProvider` → `AISettingsProvider` → `UserProvider` → `RouterProvider` with `router` from `./app/router.tsx`.
3. **Router:** `createBrowserRouter` in `src/app/router.tsx`; root element is `<RootLayout />`; all routes are children of that single root. There is **no** `App.tsx` in the render tree; `src/App.tsx` is the default Vite template and is unused. `src/app/App.tsx` (which renders `AppRoutes` from `routes.tsx`) is also not used in main.tsx.

### Summary

- **Entry:** `index.html` → `src/main.tsx`.
- **No `App.tsx` in bootstrap;** routing is `RouterProvider` + `router` from `src/app/router.tsx`.
- **Root layout:** `RootLayout` wraps all routes and renders `Outlet`, `CoreAIFab` (when enabled and path not hidden), `DemoSwitcher`, `SplashScreen`, `RouteErrorBoundary`.

---

## 4️⃣ ROUTING SYSTEM

### Definition

- **File:** `src/app/router.tsx`.
- **API:** `createBrowserRouter` from `react-router-dom`; single root route with `element: <RootLayout />` and nested `children`.

### Route → page mapping

| Path | Page / element | Protected |
|------|----------------|-----------|
| `/` | Login | No |
| `/verify` | VerifyCode | No |
| `/forgot` | ForgotPassword | No |
| `/forgot/verify` | ForgotPasswordVerify | No |
| `/reset` | ResetPassword | No |
| `/help` | HelpCenter | No |
| `/signup` | Signup | No |
| `/dashboard` | PreEnrollment | Yes |
| `/demo` | DemoDashboard | No |
| `/test/pre-enrollment-dashboard` | PreEnrollmentDashboardTest | No |
| `/dashboard/classic` | Dashboard | Yes |
| `/dashboard/post-enrollment` | PostEnrollmentDashboard | Yes |
| `/dashboard/investment-portfolio` | InvestmentPortfolioPage | Yes |
| `/profile` | Profile | Yes |
| `/enrollment` | EnrollmentLayout (Outlet) | Yes |
| `/enrollment` (index) | EnrollmentManagement | Yes |
| `/enrollment/manage/:planId` | PlanDetailManagement | Yes |
| `/enrollment/choose-plan` | ChoosePlan | Yes |
| `/enrollment/plans` | PlansPage | Yes |
| `/enrollment/contribution` | Contribution | Yes |
| `/enrollment/auto-increase` | FutureContributions | Yes |
| `/enrollment/future-contributions` | Redirect → `/enrollment/auto-increase` | Yes |
| `/enrollment/investments` | EnrollmentInvestmentsContent (guard) | Yes |
| `/enrollment/review` | EnrollmentReviewContent | Yes |
| `/transactions` | TransactionsPage | Yes |
| `/transactions/loan/new` | Redirect → `/transactions/loan/start` | Yes |
| `/transactions/:transactionType/start` | TransactionApplicationRouter | Yes |
| `/transactions/:transactionType/:transactionId` | TransactionApplicationRouter | Yes |
| `/transactions/:transactionId` | TransactionAnalysis | Yes |
| `/settings` | SettingsHub | Yes |
| `/settings/theme` | ThemeSettings | Yes |
| `/investments` | InvestmentsLayout + InvestmentsPage (InvestmentProvider) | Yes |

### Layout structure

- **RootLayout:** Outlet, CoreAIFab (conditional), DemoSwitcher, SplashScreen, RouteErrorBoundary. Core AI FAB hidden on `/`, `/dashboard`, `/test/pre-enrollment-dashboard`.
- **EnrollmentLayout:** Wraps enrollment tree in `EnrollmentProvider`. For step paths (choose-plan, contribution, auto-increase, investments, review) renders `DashboardLayout` + `DashboardHeader` + `EnrollmentHeaderWithStepper` and `Outlet`; otherwise bare `Outlet`.
- **DashboardLayout:** Optional header/subHeader, main content area (max-w-7xl container unless `fullWidthChildren`), optional Footer. Used by dashboard and enrollment step pages.
- **InvestmentsLayout:** Wraps `/investments` page content (used with InvestmentProvider).

---

## 5️⃣ PAGE ARCHITECTURE

All pages under `src/pages` and their roles:

| Page | Responsibility | Major components |
|------|----------------|------------------|
| **auth/Login** | Email/password sign-in, redirect to verify or dashboard | AuthLayout, AuthInput, AuthButton, LeftPanelCarousel |
| **auth/VerifyCode** | OTP verification (login/signup); sets OtpContext | AuthLayout, AuthOTPInput |
| **auth/ForgotPassword** | Request password reset email | AuthLayout, AuthInput |
| **auth/ForgotPasswordVerify** | Verify code for reset flow | AuthLayout |
| **auth/ResetPassword** | Set new password after reset | AuthLayout, AuthPasswordInput |
| **auth/HelpCenter** | Help/FAQ | AuthLayout |
| **auth/Signup** | Registration with metadata | AuthLayout, AuthInput |
| **dashboard/PreEnrollment** | Main post-login dashboard (hero, learning, advisor); uses pre-enrollment components | DashboardLayout, DashboardHeader, HeroSection, LearningSection, AdvisorSection (from pre-enrollment) |
| **dashboard/Dashboard** | “Classic” dashboard: hero card, learning carousel, value props, advisors | DashboardLayout, DashboardHeader, HeroEnrollmentCard, DashboardSection, LearningResourcesCarousel, ValuePropGrid, AdvisorList |
| **dashboard/DemoDashboard** | Demo scenario switcher | DashboardLayout, DemoSwitcher |
| **dashboard/PostEnrollmentDashboard** | Post-enrollment view: greeting, progress, goals, transactions | DashboardLayout, DashboardHeader, RecentTransactionsCard, GoalSimulatorCard, ProgressBar |
| **dashboard/InvestmentPortfolioPage** | Portfolio summary and charts | DashboardLayout, PortfolioHeroSummary, PerformanceChart, etc. |
| **dashboard/scenarios/** | Scenario-specific shells (AtRisk, MidCareer, PreEnrollment, Retired, YoungAccumulator) | ScenarioShell, various cards |
| **PreEnrollmentDashboardTest** | Test/preview pre-enrollment UI (Figma Make–style); hero + learning + support | DashboardLayout (hideFooter, fullWidthChildren), pre-enrollment-test HeroSection, LearningSection, SupportSection |
| **enrollment/EnrollmentManagement** | Enrollment hub / entry | Uses enrollment components |
| **enrollment/PlanDetailManagement** | Manage a single plan by ID | Plan details, contribution UI |
| **enrollment/ChoosePlan** | Plan selection step | PlanCard, PlanRail, ChoosePlanRightPanel |
| **enrollment/PlansPage** | List plans (API) | Plan list, plansService |
| **enrollment/Contribution** | Contribution amount/source step | ContributionHero, ContributionCard, PresetPills, enrollment logic |
| **enrollment/FutureContributions** | Auto-increase step | Large form, projection logic |
| **enrollment/Review** | Review before submit | Summary cards, EnrollmentFooter |
| **profile/Profile** | User profile and documents | Profile sections, DocumentsTableCard |
| **settings/SettingsHub** | Settings landing | Links to theme, etc. |
| **settings/ThemeSettings** | Theme editor | Theme-editor sections, LivePreviewPanel |
| **transactions/TransactionsPage** | Transaction hub / list | TransactionTimeline, ActionHub, ActivityHero, etc. |
| **transactions/TransactionAnalysis** | Single transaction detail | StatusTracker, ImpactPanel, etc. |
| **transactions/applications/TransactionApplicationRouter** | Start or continue loan/withdrawal/rollover/transfer | BaseApplication, type-specific flows (LoanFlow, etc.) and step components |

---

## 6️⃣ COMPONENT SYSTEM

### Structure

- **src/components:** Feature-oriented folders: `ai`, `auth`, `brand`, `core-ai`, `dashboard`, `enrollment`, `investment-portfolio`, `investments`, `loan`, `pre-enrollment`, `transactions`, `ui`, `voice`, `wizard`, etc.
- **Design system / reusable:** Many primitives live under `components/ui` (Button, Input, Card, Dropdown, Switch, ThemeToggle, etc.) and `components/dashboard/shared` (AnimatedNumber, MetricCard, ProgressBar, SectionHeader). Auth uses `components/auth/*` (AuthInput, AuthLayout, ProtectedRoute, etc.).
- **Dashboard:** `components/dashboard` includes core (DashboardShell, DashboardSlot, useDashboardEngine), modules (activity, contributions, hero, insights, investments, loans, snapshot), and **pre-enrollment-test** (HeroSection, LearningSection, SupportSection — used only by PreEnrollmentDashboardTest).

### Large components (>500 lines) — consider splitting

| File | Approx. lines | Notes |
|------|----------------|--------|
| `src/bella/BellaScreen.tsx` | ~3471 | Full-page voice/AI screen; not routed; huge single component. |
| `src/bella/agents/loanApplicationAgent.ts` | ~988 | Loan flow agent logic. |
| `src/pages/enrollment/FutureContributions.tsx` | ~951 | Auto-increase step; form + projections. |
| `src/agent/AgentController.ts` | ~857 | Legacy agent controller. |
| `src/pages/enrollment/Contribution.tsx` | ~836 | Contribution step. |
| `src/agent/LLMEnhancer.ts` | ~682 | LLM enhancement (deprecated path). |
| `src/bella/agents/planEnrollmentAgent.ts` | ~661 | Plan enrollment agent. |
| `src/pages/auth/Signup.tsx` | ~608 | Sign-up form and logic. |
| `src/pages/enrollment/Review.tsx` | ~600 | Review step. |
| `src/components/feedback/FeedbackModal.tsx` | ~566 | Feedback form and submit. |
| `src/components/enrollment/InvestmentProfileWizard.tsx` | ~540 | Multi-step wizard. |
| `src/pages/enrollment/PlanDetailManagement.tsx` | ~516 | Plan detail and actions. |

### Duplication / split candidates

- **Pre-enrollment:** Two variants — `components/pre-enrollment` (HeroSection, LearningSection, AdvisorSection) used by `PreEnrollment` at `/dashboard`, and `components/dashboard/pre-enrollment-test` (HeroSection, LearningSection, SupportSection) used by `PreEnrollmentDashboardTest` at `/test/pre-enrollment-dashboard`. Different hero/learning/support implementations; should be unified or clearly designated “canonical” vs “test”.
- **Steppers:** EnrollmentHeaderWithStepper, EnrollmentStepper, HeaderStepper, CustomStepper — consolidate to a single progress stepper with variants.
- **Transaction flows:** Both `features/transaction-hub` and `pages/transactions` (and applications) contain overlapping concepts (e.g. ActivityHero in both); align or document which is canonical.

---

## 7️⃣ SUPABASE ARCHITECTURE

### Client initialization

- **File:** `src/lib/supabase.ts`.
- **Behavior:** `createClient(supabaseUrl, supabaseAnonKey)` with:
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from env (required; throws if missing or placeholder).
  - Custom `fetch` wrapper via `timeoutFetch` (10s timeout).
- **Export:** Single `supabase` instance used across the app.

### Where Supabase is used

| File | Usage |
|------|--------|
| `src/context/AuthContext.tsx` | `getSession`, `onAuthStateChange`, `signInWithPassword`, `signUp`, `signOut` |
| `src/context/UserContext.tsx` | `from("profiles").select()`, `from("companies").select()` for profile + company after auth |
| `src/pages/auth/Login.tsx` | Supabase import (e.g. for auth or helpers) |
| `src/pages/auth/Signup.tsx` | `signOut` after signup flow |
| `src/services/plansService.ts` | Plans from DB (e.g. by company) |
| `src/services/enrollmentService.ts` | Enrollment operations; uses `supabase.auth.getUser()` |
| `src/services/companyBrandingService.ts` | Company/branding data |
| `src/components/feedback/FeedbackModal.tsx` | `from("feedback").insert()` |

Authentication is centralized in **AuthContext** (session, signIn, signUp, signOut). **UserContext** depends on AuthContext and loads profile and company from `profiles` and `companies`; applies company branding via ThemeContext.

---

## 8️⃣ STATE MANAGEMENT

- **No global store:** No Redux, Zustand, or Jotai.
- **React Context:**  
  AuthContext, UserContext, OtpContext, ThemeContext, AISettingsContext, CoreAIModalContext, NetworkProvider (lib/network), EnrollmentContext (enrollment/context), InvestmentContext, InvestmentWizardContext.
- **Enrollment:**  
  `EnrollmentContext` holds enrollment state (plan, contribution, assumptions, etc.); `enrollmentDraftStore` in `src/enrollment/enrollmentDraftStore.ts` is sessionStorage read/write helpers; draft is seeded when entering enrollment and on “Save & Exit”.
- **Custom hooks:**  
  useAuth, useUser, useTheme, useEnrollment, useAISettings, useCoreAIModal, useDashboardEngine, useMediaQuery, useReducedMotion, useSpeechRecognition (core-ai), useTextToSpeech (core-ai and hooks/), useSpeechToText, useDemoUser, etc.
- **Data flow:**  
  Auth → User (profile/company) → theme branding. Protected routes read Auth + Otp. Enrollment steps read/write EnrollmentContext; footer/layout use same context for back/next/save. Core AI modal uses CoreAIModalContext and sends messages via `coreAiService` to backend; no shared client-side AI store.

---

## 9️⃣ ENVIRONMENT STRUCTURE

- **Env files (repo):**  
  `.env.example` (template), `.env.development`, `.env.production`, `.env.staging` (likely for build-time or deployment; not committed in standard setups).
- **Frontend (Vite):**  
  Only variables prefixed with `VITE_` are exposed. Used in app:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (required in `src/lib/supabase.ts`)
  - Optional: `VITE_ENABLE_UX_SNIFF`, `VITE_ENABLE_CLARITY`, `VITE_LLM_API_ENDPOINT`, `VITE_LLM_ENABLED` (legacy)
- **Backend (server):**  
  `server/.env` (see `server/.env.example`): Supabase URL, Supabase service role key, Google Cloud credentials for STT/TTS, etc. Used by Express for Core AI and voice.
- **Netlify:**  
  Build command `npm run build`, publish `dist`. No env files in repo for Netlify; configure in Netlify UI (or link to env source).  
  **Testing vs production:**  
  Typically separate Netlify sites or branches with different env (e.g. different `VITE_SUPABASE_*` and backend env). No in-repo “testing” vs “production” switch beyond env vars and deployment target.

---

## 10️⃣ VERSION DUPLICATION

- **Pre-enrollment dashboard:**
  - **Primary:** `/dashboard` → `PreEnrollment` using `components/pre-enrollment` (HeroSection, LearningSection, AdvisorSection).
  - **Test/prototype:** `/test/pre-enrollment-dashboard` → `PreEnrollmentDashboardTest` using `components/dashboard/pre-enrollment-test` (HeroSection, LearningSection, SupportSection). Different layout (e.g. SupportSection vs AdvisorSection, different hero).
- **Dashboard variants:**
  - `/dashboard` → PreEnrollment (default post-login).
  - `/dashboard/classic` → Dashboard (classic hero + learning + value props).
  - `/dashboard/post-enrollment` → PostEnrollmentDashboard.
- **Routes:**  
  `app/router.tsx` is the single source of truth. `app/routes.tsx` is legacy `<Routes>` and is not mounted anywhere; duplicate route definitions.
- **Figma dump:**  
  `src/figma-dump/retiresmart-pre-enrollment-portal` is a separate mini-app (own App, main, vite config); not part of the main app bundle.
- **enrollment-v2:**  
  Folder exists but is effectively empty (e.g. only .DS_Store); no second enrollment implementation in use.

---

## 11️⃣ LARGE FILES / TECH DEBT

Files with substantial line counts (approx.) that often indicate refactor targets:

| File | Approx. lines | Purpose |
|------|----------------|---------|
| `src/bella/BellaScreen.tsx` | 3471 | Full-page voice/AI UI; not in router |
| `src/bella/agents/loanApplicationAgent.ts` | 988 | Loan application agent |
| `src/pages/enrollment/FutureContributions.tsx` | 951 | Auto-increase step |
| `src/agent/AgentController.ts` | 857 | Legacy agent controller |
| `src/pages/enrollment/Contribution.tsx` | 836 | Contribution step |
| `src/agent/LLMEnhancer.ts` | 682 | LLM enhancement (deprecated) |
| `src/bella/agents/planEnrollmentAgent.ts` | 661 | Plan enrollment agent |
| `src/pages/auth/Signup.tsx` | 608 | Sign-up page |
| `src/pages/enrollment/Review.tsx` | 600 | Enrollment review |
| `src/components/feedback/FeedbackModal.tsx` | 566 | Feedback modal |
| `src/components/enrollment/InvestmentProfileWizard.tsx` | 540 | Investment profile wizard |
| `src/pages/enrollment/PlanDetailManagement.tsx` | 516 | Plan detail management |
| `src/bella/ui/ManualInvestmentUI.tsx` | 485 | Manual investment UI |
| `src/agent/taskDefinitions.ts` | 481 | Task definitions |
| `src/bella/ui/EnrollmentDecisionUI.tsx` | 446 | Enrollment decision UI |
| `src/components/enrollment/PersonalizePlanModal.tsx` | 419 | Personalize plan modal |

---

## 12️⃣ FEATURE MODULES

| Module | Purpose | Key files / areas |
|--------|--------|--------------------|
| **Authentication** | Login, signup, OTP, forgot/reset password | `pages/auth/*`, `context/AuthContext`, `context/OtpContext`, `components/auth/*`, `lib/supabase` |
| **User & profile** | Profile and company loading, branding | `context/UserContext`, `pages/profile/Profile`, `services/companyBrandingService` |
| **Dashboard** | Post-login home and variants | `pages/dashboard/*`, `layouts/DashboardLayout`, `components/dashboard/*`, `components/pre-enrollment`, `components/dashboard/pre-enrollment-test` |
| **Enrollment** | Plan choice, contribution, auto-increase, investments, review | `pages/enrollment/*`, `enrollment/context`, `enrollment/logic`, `components/enrollment/*`, `layouts/EnrollmentLayout`, `services/enrollmentService` |
| **Transactions** | List, detail, application flows (loan, withdrawal, rollover, transfer) | `pages/transactions/*`, `features/transactions`, `features/transaction-hub`, `services/transactionService` |
| **Investments** | Standalone investments page | `app/investments/*`, `context/InvestmentContext`, `components/investments/*` |
| **Investment portfolio** | Portfolio view from dashboard | `pages/dashboard/InvestmentPortfolioPage`, `components/investment-portfolio/*` |
| **Core AI / voice** | FAB, modal, STT/TTS, backend AI | `components/ai/CoreAIFab`, `components/core-ai/*`, `context/AISettingsContext`, `context/CoreAIModalContext`, `services/coreAiService`, `server` (Core AI + voice), `netlify/functions` (voice, LLM polish/normalize) |
| **Bella / agent** | Full-page voice UI and legacy agent (unused in router) | `bella/*`, `agent/*` |
| **Settings** | Theme and app settings | `pages/settings/*`, `context/ThemeContext`, `theme/*` |
| **Plans** | Plan data and API | `services/plansService`, enrollment plan selection and plan display components |

---

## 13️⃣ VOICE ASSISTANT SYSTEM

- **Entry points:**  
  - **Core AI (modal):** CoreAIFab → CoreAIModalContext → CoreAssistantModal. User can type or use voice in the modal.  
  - **Bella:** BellaScreen is a full-page voice UI not mounted in the router (dead code for normal users).
- **Voice input:**  
  - **Core Assistant Modal:** Uses `useSpeechRecognition` (in `components/core-ai`) for browser Speech Recognition; final transcript is sent as a message.  
  - **Bella:** Uses its own voice pipeline and agents (e.g. planEnrollmentAgent, loanApplicationAgent).
- **Voice output:**  
  `useTextToSpeech` (in `components/core-ai` and `hooks/useTextToSpeech.ts`) can call backend TTS. Backend: Express `POST /api/voice/tts` (dev) and Netlify Function `voice-tts` (production).
- **STT backend:**  
  Express `POST /api/voice/stt` (dev) and Netlify Function `voice-stt` (production); Google Cloud Speech-to-Text.
- **AI actions:**  
  Core AI modal sends messages to `POST /api/core-ai` (with JWT). Server (e.g. `server/index.js` + `coreAiController.js`, `intentResolver.js`, `retirementService.js`) resolves intent, can load data, and returns reply; optional scripted flows in `components/core-ai/flows` (enrollment, loan, withdrawal, vesting). Bella uses agents that also call the same Core AI backend (e.g. `POST /api/core-ai`) but from a different UI surface.

---

## 14️⃣ BUILD AND DEPLOYMENT

- **Vite:**  
  `vite.config.ts` uses `@vitejs/plugin-react`, alias `@` → `./src`, and dev server proxy `/api` → `http://localhost:3001`.
- **Build:**  
  `npm run build` → `vite build`; output in `dist/` (static assets + `index.html`). TypeScript checked via `tsc -b` when using `npm run build:check`.
- **Deployment:**  
  Netlify: build command `npm run build`, publish `dist`. Client-side routing: `/*` → `/index.html` (in `netlify.toml`).  
  **Note:** `/api/core-ai` is not in `netlify.toml` redirects; production Core AI must be provided by a separate backend (e.g. hosted Express or a Netlify function) and frontend configured to call that URL.
- **Netlify Functions:**  
  Used for voice and LLM: `voice-stt`, `voice-tts`, `llm-normalize`, `llm-polish`. Core AI is not implemented as a Netlify function in the repo.

---

## 15️⃣ ARCHITECTURE PROBLEMS

1. **Duplicate pre-enrollment UIs:** Two component sets (pre-enrollment vs pre-enrollment-test) and two routes (/dashboard vs /test/pre-enrollment-dashboard); unclear canonical version.
2. **Two AI surfaces:** Core AI modal (in use) vs Bella full-page (not routed); duplicated voice/AI logic and maintenance.
3. **Legacy route file:** `app/routes.tsx` duplicates routing and is unused; can cause confusion.
4. **Enrollment state and step order:** Step order and paths defined in both `enrollmentStepPaths.ts` and EnrollmentFooter/layout; easy to desync when changing steps.
5. **EnrollmentContext size:** Large context with many fields; any update re-renders all consumers; no selectors or slicing.
6. **Heavy files:** BellaScreen, AgentController, FutureContributions, Contribution, Signup, Review, FeedbackModal, etc. (see §11); logic and UI mixed.
7. **Multiple steppers:** EnrollmentStepper, EnrollmentHeaderWithStepper, HeaderStepper, CustomStepper; should be one stepper with variants.
8. **Transaction feature split:** `features/transaction-hub` and `features/transactions` plus `pages/transactions` and applications; overlapping components (e.g. ActivityHero) and unclear ownership.
9. **Core AI in production:** No Netlify function for `/api/core-ai`; production must use another backend or add a function.
10. **Agent/LLM code:** `agent/` and frontend Gemini usage deprecated in favor of `/api/core-ai`; dead or legacy code still present.
11. **Figma dump in src:** Standalone app under `src/figma-dump` is not part of the main app; could be moved out of `src` or removed from build.
12. **enrollment-v2:** Empty or near-empty folder; remove or implement.

---

## 16️⃣ REFACTORING PRIORITY LIST

1. **Unify pre-enrollment and routing**  
   Choose one canonical pre-enrollment experience (e.g. current `/dashboard` or test variant); merge or remove the other; single set of components and one route for “main dashboard”.

2. **Consolidate AI/voice surface**  
   Either route Bella and make it the primary voice experience or remove Bella and rely on Core AI modal only; avoid maintaining two full AI UIs.

3. **Single source of truth for enrollment steps**  
   Define step order and paths once (e.g. in `enrollmentStepPaths.ts` or a small config); have EnrollmentLayout and EnrollmentFooter consume it; remove hardcoded path lists from footer.

4. **Reduce EnrollmentContext scope**  
   Split into smaller contexts (e.g. plan selection, contribution, assumptions) or move to Zustand (or similar) with selectors to limit re-renders and clarify ownership.

5. **Remove or document dead code**  
   Delete or clearly mark as legacy: `app/routes.tsx`, `src/App.tsx`, `agent/` frontend LLM usage, and optionally Bella if not going to be routed; consider moving or excluding `figma-dump` from main app.

6. **Add Core AI to production**  
   Implement `/api/core-ai` in production (Netlify function or separate service) and configure frontend so Core AI works in all environments.

7. **Single progress stepper**  
   Introduce one `<ProgressStepper />` (or similar) with variants for enrollment vs transactions; replace EnrollmentStepper, EnrollmentHeaderWithStepper, HeaderStepper, CustomStepper.

8. **Break up largest components**  
   Split BellaScreen, FutureContributions, Contribution, Signup, Review, FeedbackModal, InvestmentProfileWizard into smaller components or hooks; separate business logic from UI where possible.

9. **Clarify transaction feature ownership**  
   Decide canonical home for transaction hub and activity (e.g. `features/transaction-hub` vs `features/transactions`); deduplicate ActivityHero and similar components; align `pages/transactions` with chosen feature set.

10. **Data layer and deduplication**  
    Introduce a thin data/cache layer (e.g. React Query or SWR) for profile, company, and plans to avoid duplicate fetches and ad-hoc loading states.

11. **Enrollment draft and API**  
    Define a single EnrollmentDraft schema and one place that reads/writes it (context or store); ensure “Save & Exit” and step transitions persist the same snapshot; extend backend to persist enrollment progress where required.

12. **Clean up env and deployment docs**  
    Document which env vars are required per environment (dev, staging, prod); document how Core AI and voice backends are deployed and how frontend discovers API base URLs in production.

---

*End of architecture report.*
