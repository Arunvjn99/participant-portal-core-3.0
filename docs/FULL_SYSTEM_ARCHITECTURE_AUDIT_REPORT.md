# Full System Architecture Audit Report

**Purpose:** Pre-rebuild analysis — understand how the system currently works.  
**Scope:** Entire repository. No code changes; analysis and documentation only.  
**Date:** March 6, 2025  

---

## 1️⃣ Project Overview

### What This Project Is

- **Name:** participant-portal-auth-clean  
- **Type:** SaaS participant portal for US retirement (401k, enrollment, investments, transactions).  
- **Stack:** Vite + React 19 + TypeScript, Supabase (auth + DB), optional Express server for Core AI (Gemini) and voice (STT/TTS).  
- **Deployment:** Netlify (static + serverless functions for voice/LLM); dev can run Vite + optional Node server.  
- **UI:** Mix of hand-built components, Tailwind, design tokens, and Figma-derived reference (figma-dump / Figma Make exports).  
- **i18n:** i18next with en/es (enrollment namespace merged); locale in localStorage.  
- **Auth:** Supabase Auth (email/password) + OTP verification gate (OtpContext); ProtectedRoute enforces both.

### High-Level Architecture

- **Single SPA:** One React app; routing via React Router v7 `createBrowserRouter`; root is `RootLayout` with `Outlet`.  
- **Dual enrollment flows:** Legacy `/enrollment/*` (EnrollmentLayout + step pages) and **Enrollment V2** `/enrollment-v2/*` (EnrollmentLayoutV2). Feature flag `VITE_USE_ENROLLMENT_V2` (default true) redirects step routes from v1 to v2.  
- **AI:** Core AI (Gemini) via `/api/core-ai` (JWT); CoreAIFab + CoreAssistantModal; separate full-page BellaScreen (voice) not in router.  
- **State:** React Context only (no Redux/Zustand): Auth, User, Theme, OTP, AI Settings, Core AI Modal, Network, Enrollment, Investment.  
- **Data:** Supabase client in browser for auth and DB (profiles, companies, plans, enrollments, feedback, etc.); server-side Supabase admin client only for Core AI auth and ai_logs.

---

## 2️⃣ Folder Structure Analysis

### Root-Level Folders

| Folder | Purpose | Classification |
|--------|---------|----------------|
| **src** | Main application (React app) | **Production** |
| **server** | Express API (Core AI, voice STT/TTS) | **Production** (run separately or via proxy) |
| **supabase** | SQL migrations (plans, enrollments, ai_logs, company branding, RLS) | **Production** |
| **netlify** | Serverless functions (voice-stt, voice-tts, llm-normalize, llm-polish), security/CORS utils | **Production** |
| **scripts** | fetch-stitch-screen.js, superdesign-demo.js, add-investment-portfolio-locales.js | **Tooling** |
| **docs** | 60+ markdown audits (enrollment, UI, auth, Figma, theme, etc.) | **Documentation** |
| **designs** | design/stitch artifacts (e.g. stitch-retirement-control-hub) | **Design reference** |
| **figma-analysis** | Flow maps, missing-features, screenshots for Figma Retirement Plan Selections App | **Figma pipeline** |
| **public** | Static assets (images, logos) | **Production** |
| **.vscode** | Editor config | **Config** |
| **core-ascend---retirement-command-center** | Standalone Vite app (transaction/loan/withdrawal/rollover/transfer UI + Gemini) | **Experimental / duplicate** |
| **intelligent-plan-selector** | Standalone app (Gemini) | **Experimental / duplicate** |
| **lumina-retirement** | Standalone app (components + geminiService) | **Experimental / duplicate** |
| **_isolated** | futurelaunch---retirement-activation-hub (isolated prototype) | **Prototype** |
| **dist** | Build output (generated) | **Build artifact** |

### src/ Structure (Summary)

| Path | Purpose |
|------|--------|
| **app** | router.tsx (createBrowserRouter), routes.tsx (legacy Routes — **unused**), investments layout/page |
| **components** | auth, ai, brand, dashboard, demo, enrollment, feedback, investment-portfolio, investments, layout, loan, pre-enrollment, profile, system, transactions, ui, voice, wizard |
| **context** | Auth, User, Theme, Otp, AISettings, CoreAIModal, Network, etc. |
| **enrollment** | context (EnrollmentContext, useContributionStore), logic (calculators, types), enrollmentDraftStore, enrollmentStepPaths |
| **enrollment-v2** | components (cards, stepper, contribution, investment summary, etc.), pages (ChoosePlanPage) — V2-specific UI |
| **features** | enrollment (contribution, plan, investment, readiness, review, layout, autoIncrease), investment (standalone InvestmentPage, allocation, funds), personalization (wizard, sliders, insights), transaction-hub, transactions |
| **figma-dump** | “Retirement Plan Selections App” — raw Figma export; INTEGRATION_RULES.md says use as **reference only** |
| **layouts** | RootLayout, DashboardLayout, EnrollmentLayout |
| **lib** | supabase.ts, analytics (clarity), network (timeoutFetch, connectivityMonitor, networkContext) |
| **locales** | en, es, de, fr, hi, ja, ta, zh — common.json + en enrollment.json |
| **pages** | auth, dashboard, enrollment, profile, settings, transactions |
| **services** | plansService, companyBrandingService, enrollmentService, coreAiService |
| **shared** | shared/ui (PlanBenefitChip, StepIndicatorV2) |
| **styles** | tokens.css, enrollment-choose-plan.css, contribution-page-figma.css |
| **theme** | tokens.css, light.css, dark.css, enrollment-dark.css, themeManager, utils, defaultThemes |
| **bella** | BellaScreen, agents, lib, ui — full-page voice AI (not routed) |
| **agent** | LLMEnhancer, geminiClient (frontend disabled; points to /api/core-ai) |
| **config** | featureFlags.ts (USE_ENROLLMENT_V2) |
| **data** | usStates, etc. |
| **hooks** | useDemoUser, etc. |
| **mock** | Mock data |
| **types** | Shared TS types |
| **utils** | uxtweakLoader, uxsniffLoader, personalizeCalculations, retirementCalculations, etc. |

### Unused / Duplicate / Experimental

- **Unused:** `src/app/routes.tsx` — legacy `<Routes>`; app uses only `router.tsx`.  
- **Duplicate systems:**  
  - Two enrollment flows: `/enrollment/*` (v1) vs `/enrollment-v2/*` (v2); shared EnrollmentProvider but different layouts and step configs.  
  - Multiple steppers: EnrollmentStepper, EnrollmentHeaderWithStepper, HeaderStepper, CustomStepper.  
  - Two AI surfaces: Core AI (modal) vs Bella (full page, not routed).  
- **Experimental / prototype folders (not main app):**  
  - core-ascend---retirement-command-center  
  - intelligent-plan-selector  
  - lumina-retirement  
  - _isolated/futurelaunch---retirement-activation-hub  
  These contain their own Vite configs, .env.local, and Gemini usage; they are separate mini-apps.

---

## 3️⃣ Technology Stack

| Layer | Technology | Notes |
|-------|------------|--------|
| **Build** | Vite 7 | ESM, `@` alias to `src` |
| **Framework** | React 19 | StrictMode |
| **Language** | TypeScript ~5.9 | |
| **Routing** | react-router-dom v7 | createBrowserRouter, RootLayout + Outlet |
| **State** | React Context | No Redux/Zustand; many providers (Auth, User, Theme, OTP, Enrollment, etc.) |
| **Styling** | Tailwind 3 + global CSS | tailwind.config.js extends theme with CSS variables; darkMode: "class" |
| **UI primitives** | Radix (checkbox, dialog, label, slot), MUI Material, Emotion, Lucide, clsx, tailwind-merge | Mixed |
| **Charts** | Recharts | |
| **Animations** | Framer Motion | |
| **i18n** | i18next, react-i18next, i18next-browser-languagedetector | en/es; enrollment namespace merged into translation |
| **Backend (client)** | @supabase/supabase-js | Single client in src/lib/supabase.ts; env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY |
| **Backend (server)** | Express (server/) | Core AI (Gemini), voice STT/TTS; Supabase admin for JWT + ai_logs |
| **Auth** | Supabase Auth | Email/password; session + OTP verification (OtpContext); ProtectedRoute |
| **API** | Supabase from client; /api/* proxied to Express (dev) or Netlify Functions (prod) | No React Query/SWR; each context/service fetches independently |
| **Env** | import.meta.env (Vite) | VITE_* in frontend; .env / server/.env for server |

### How They Work Together

- **Boot:** index.html → main.tsx → CSS imports (tokens, theme, index.css, feature CSS) → i18n → theme class on `<html>` → providers (Network, Auth, OTP, Theme, AISettings, User) → RouterProvider with router.  
- **Routing:** Single root route with RootLayout; children are flat (login, verify, dashboard, enrollment, enrollment-v2, transactions, settings, investments). Enrollment and enrollment-v2 have nested children.  
- **Auth:** AuthContext initializes session via supabase.auth.getSession() and onAuthStateChange; ProtectedRoute checks user + isOtpVerified and redirects to / or /verify.  
- **Theme:** ThemeContext + themeManager apply company branding and light/dark to document; Tailwind uses var(--…) from theme tokens.  
- **Data:** Services and contexts call supabase.from(…) directly; server uses getAdminClient() for Core AI verification and ai_logs.

---

## 4️⃣ Application Boot Flow

### 1. index.html

- Loads Montserrat/Open Sans from Google Fonts.  
- `<div id="root">` + `<script type="module" src="/src/main.tsx">`.

### 2. main.tsx

- **Order of execution:**  
  - Import i18n (side effect: init i18next, merge enrollment into en/es).  
  - Import theme/tokens, styles/tokens, enrollment/contribution CSS, theme/light, dark, enrollment-dark, index.css, personalization-wizard CSS.  
  - Import loadUXtweak, loadUXsniff, loadClarity (analytics).  
  - Read theme from localStorage; set document.documentElement class and data-theme before first paint.  
  - createRoot(#root).render(  
    I18nextProvider → StrictMode → RootWithLanguageKey  
  ).  
- **RootWithLanguageKey:** Wraps with NetworkProvider, NetworkBanner, AuthProvider, OtpProvider, ThemeProvider, AISettingsProvider, UserProvider; renders RouterProvider with `key={i18n.language}` and `router` from app/router.tsx.  
- **No App.tsx:** Router is the app shell; RootLayout is the root route element.

### 3. Router (app/router.tsx)

- **createBrowserRouter** with one root element: `<RootLayout />`.  
- **RootLayout:** Renders CoreAIModalProvider, SplashScreen, RouteErrorBoundary, Outlet, conditional CoreAIFab, DemoSwitcher.  
- **Children:** Flat list of routes: /, /verify, /forgot, /reset, /help, /signup, /dashboard, /demo, /dashboard/classic, /dashboard/post-enrollment, /dashboard/investment-portfolio, /profile, /enrollment (with nested index, manage/:planId, choose-plan, plans, contribution, auto-increase, future-contributions, investments, review), /enrollment-v2 (nested: choose-plan, contribution, auto-increase, investment, readiness, review), /transactions, /transactions/activity, /transactions/loan/*, /transactions/:transactionType/start|:transactionId, /transactions/:transactionId, /settings, /settings/theme, /investments.  
- **Guards:** ProtectedRoute wraps authenticated pages; EnrollmentRedirectWhenV2 wraps /enrollment and redirects step paths to /enrollment-v2 when USE_ENROLLMENT_V2 is true.  
- **Layouts:** Enrollment uses EnrollmentLayout (v1) or redirect; enrollment-v2 uses EnrollmentLayoutV2; both use DashboardLayout + EnrollmentHeaderWithStepper for step routes.

### 4. Supabase Initialization

- **Client:** In src/lib/supabase.ts. Imported by main.tsx only indirectly (via AuthProvider, etc.).  
- **Creation:** At module load: reads import.meta.env.VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY; throws if missing or placeholder; createClient(url, anonKey, { global: { fetch: timeoutFetch(10s) } }).  
- **No lazy init:** Single singleton used across the app.

---

## 5️⃣ Supabase Integration

### Where the Client Is Created

- **File:** `src/lib/supabase.ts`.  
- **Config:** VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY; placeholder check; custom fetch with 10s timeout.  
- **Export:** `export const supabase` — one instance.

### Where Authentication Happens

- **AuthContext:** getSession(), onAuthStateChange, signInWithPassword, signUp, signOut.  
- **Login/Signup/Verify:** pages/auth use supabase.auth and optionally supabase.from("companies") for domain-based logo.  
- **ProtectedRoute:** Uses AuthContext (user) + OtpContext (isOtpVerified); redirects if not logged in or OTP not verified.

### Where Database Queries Occur

- **UserContext:** profiles (select/upsert), companies (select).  
- **plansService:** from("plans") by company_id.  
- **enrollmentService:** from("enrollments") — get user, upsert plan_id/status.  
- **companyBrandingService:** from(companies table) for branding.  
- **Login:** from("companies") for logo by domain.  
- **Signup:** from("companies"), from("profiles") (upsert, verify).  
- **FeedbackModal:** from("feedback").insert(…).  
- **Server (supabaseAdmin.js):** getAdminClient() for auth.getUser(token), profiles (id, company_id), ai_logs insert.  
- **retirementService.js:** Uses getAdminClient() for server-side data for Core AI.

### Environment Variables

- **Frontend:** VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (required); VITE_USE_ENROLLMENT_V2, VITE_ENABLE_UX_SNIFF, VITE_ENABLE_CLARITY, VITE_LLM_* (optional).  
- **Server:** SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, GOOGLE_CLOUD_CREDENTIALS, PORT, FRONTEND_URL (server/.env.example).  
- **Netlify:** ALLOWED_ORIGINS, SITE_URL, STT_ENABLED, TTS_ENABLED, LLM_ENABLED, etc. in functions.

### Security Practices

- **Good:**  
  - Anon key in frontend (RLS required); service role only on server.  
  - Placeholder check for Supabase URL/key.  
  - Core AI: JWT verified server-side via getAdminClient().auth.getUser(token).  
  - RLS on enrollments (select/insert/update/delete own row).  
- **Risks:**  
  - **RLS assumed:** All tables used from client (profiles, companies, plans, enrollments, feedback) must have RLS policies; no audit of every table in this report.  
  - **Direct client queries:** No abstraction layer; any component can import supabase and query; risk of missing RLS or over-exposure.  
  - **.env:** .env and server/.env are in .gitignore; ensure they are never committed and no secrets in repo.

---

## 6️⃣ UI Architecture

### Global / Layout Components

- **RootLayout:** Outlet, CoreAIFab, DemoSwitcher, SplashScreen, RouteErrorBoundary.  
- **DashboardLayout:** Optional header/subHeader, main content, Footer; transparentBackground for enrollment steps.  
- **EnrollmentLayout / EnrollmentLayoutV2:** Wrap with EnrollmentProvider, step layout with DashboardLayout + EnrollmentHeaderWithStepper, Outlet.  
- **EnrollmentHeaderWithStepper:** Uses shared EnrollmentStepper (or equivalent) with step labels.  
- **Footer:** layout/Footer.

### Page Components

- **pages/auth:** Login, VerifyCode, ForgotPassword, ForgotPasswordVerify, ResetPassword, HelpCenter, Signup.  
- **pages/dashboard:** PreEnrollment, Dashboard, PostEnrollmentDashboard, DemoDashboard, InvestmentPortfolioPage.  
- **pages/enrollment:** EnrollmentManagement, PlanDetailManagement, ChoosePlan, PlansPage, Contribution, FutureContributions.  
- **pages/profile:** Profile.  
- **pages/settings:** SettingsHub, ThemeSettings.  
- **pages/transactions:** TransactionsPage, ActivityCommandPage, TransactionAnalysis, TransactionApplicationRouter.  
- **features/enrollment:** ChoosePlanPage (V2), ContributionPage, AutoIncreasePage, InvestmentPage (investment step), ReadinessPage, ReviewPage.  
- **enrollment-v2/pages:** ChoosePlanPage (re-exported in router).  
- **app/investments:** InvestmentsLayout, InvestmentsPage.

### Feature Modules

- **features/enrollment:** contribution, plan, investment, readiness, review, layout (EnrollmentLayoutV2, EnrollmentRedirectWhenV2), autoIncrease.  
- **features/investment:** AllocationRow, InvestmentPage (standalone), AllocationSummaryChart, FundSlider, etc.  
- **features/personalization:** Wizard steps, sliders, insights, icons.  
- **features/transaction-hub:** ContributionAdjuster, LoanSimulator, LoanGuidedFlow.  
- **features/transactions:** ActivityHero, useTransactionSummary.

### Duplicate / Inconsistent UI

- **Steppers:** EnrollmentStepper, EnrollmentHeaderWithStepper, HeaderStepper, CustomStepper — used in enrollment and transaction flows; no single ProgressStepper.  
- **Enrollment v1 vs v2:** Two sets of pages and layouts; shared EnrollmentProvider and DashboardLayout but different step configs and components (e.g. PlanCard vs PlanCardV2, Contribution vs ContributionPage).  
- **Buttons/Cards/Inputs:** figma-dump/INTEGRATION_RULES.md warns against duplicating Button, Card, Input, Modal; some feature-specific cards and modals exist alongside components/ui.  
- **Large components:** EnrollmentContext holds 20+ fields; heavy pages (Contribution, Review) can re-render on any enrollment state change. No design system doc in codebase; tokens and patterns spread across theme and styles.

---

## 7️⃣ Styling System

### Approach

- **Tailwind CSS** with content from index.html and src/**/*.{js,ts,jsx,tsx}.  
- **Global CSS:** index.css (Tailwind base/components/utilities + :root variables + utility classes like .glass-card, .elevation-1/2/3).  
- **Theme CSS:** theme/tokens.css (light/dark variables), theme/light.css, theme/dark.css, theme/enrollment-dark.css.  
- **Feature CSS:** styles/tokens.css, styles/enrollment-choose-plan.css, styles/contribution-page-figma.css, features/personalization/personalization-wizard.css.  
- **Inline styles:** Some components use style={{ color: "var(--enroll-text-primary)" }} or object styles (e.g. Review); preferred is Tailwind + tokens.

### Design Tokens

- **theme/tokens.css:** :root and .dark — surface, text, border, brand, radius, spacing, shadows; legacy color-* and enroll-* in .dark.  
- **styles/tokens.css:** Semantic tokens (color-bg-primary, color-text-primary, gradients, space-*, radius-*, typography, layout max-widths); dark overrides.  
- **tailwind.config.js:** extend.colors map to var(--surface-primary), var(--text-primary), etc.; spacing (rhythm-*), borderRadius (card, button, input), fontFamily.  
- **ThemeContext/themeManager:** Apply company branding (branding_json) to document; override tokens at runtime.

### Typography / Color / Spacing

- **Typography:** Fonts from index.html (Montserrat, Open Sans); Tailwind fontFamily.sans, .display; token --font-size-* in styles/tokens.css.  
- **Colors:** Semantic vars (--color-primary, --color-text, --enroll-*, --brand-primary); Tailwind uses these.  
- **Spacing:** --spacing-* (theme), --space-* (styles), rhythm-* in Tailwind.  
- **Inconsistencies:** Two token files (theme vs styles); some hex in styles/tokens.css fallbacks; gradient tokens in styles/tokens.css; enrollment-dark.css adds another layer. Mixed use of class vs data-theme vs .dark.

---

## 8️⃣ Figma Integration (Figma → Code Pipeline)

### Current Pipeline

- **figma-dump:** Contains “Retirement Plan Selections App” — raw Figma/Make export (screens, components).  
- **figma-analysis:** flow-map.md (step hierarchy, flow order, key components, business logic), missing-features.md, screenshots.  
- **INTEGRATION_RULES.md (figma-dump):** Explicit rules: do **not** copy raw Figma components into production; use as reference only; replace hex with CSS variables; use existing layout wrappers and contexts; do not duplicate Button/Card/Input/Modal; preserve dark mode and white-label.

### How UI from Figma Enters the Codebase

- **Not direct import:** Figma export is not imported into app code.  
- **Reference:** Developers use flow-map and screenshots to reimplement screens with existing components and tokens.  
- **Feature CSS:** contribution-page-figma.css, enrollment-choose-plan.css suggest past design passes from Figma were translated into global/feature CSS and Tailwind.  
- **MCP / Cursor:** Design-to-code can use Figma MCP (get_design_context, etc.); output must be adapted to project tokens and components per INTEGRATION_RULES.

### Problems

- **Raw export not used as source of truth:** Good for consistency but requires discipline to avoid copy-paste.  
- **Unstructured reuse:** Some “Figma-like” components may exist in features/enrollment and enrollment-v2 without a single design-system layer.  
- **No Code Connect:** No evidence of Figma ↔ codebase component mapping in this repo; INTEGRATION_RULES serve as the contract.

---

## 9️⃣ Security Risks

### High / Critical

- **Secrets in repo:** .env and server/.env are in .gitignore. **Action:** Ensure no .env or real keys are ever committed; run secrets scan (e.g. git history). If server/.env was ever committed with GEMINI_API_KEY, rotate key and purge from history.  
- **RLS coverage:** Client hits profiles, companies, plans, enrollments, feedback. **Action:** Audit every table for RLS; ensure no table is readable/writable by anon or other users beyond intended policy.  
- **Core AI auth:** Server verifies JWT and uses service role for ai_logs. **Action:** Ensure Core AI endpoint is only reachable with valid Supabase JWT and rate-limit/validate input.

### Medium

- **OTP persistence in sessionStorage:** OtpContext “verified” survives tab close. **Action:** Align with product (session vs device); ensure logout clears OTP state.  
- **CORS / Netlify:** netlify/functions/utils/security.js uses ALLOWED_ORIGINS, SITE_URL; dev fallback includes localhost. **Action:** In production set ALLOWED_ORIGINS and SITE_URL; avoid wildcard.  
- **Unprotected /demo:** Route has no ProtectedRoute; demo state can mix with real auth. **Action:** Document or restrict demo (e.g. feature flag, separate subdomain).

### Low

- **Console logs:** Many logs behind import.meta.env.DEV; some unconditional (e.g. companyBrandingService, RouteErrorBoundary). **Action:** Gate all logs or use a logger; no PII in logs.  
- **CSP:** security.js sets strict CSP but 'unsafe-inline' / 'unsafe-eval' for scripts; consider tightening for production.

---

## 🔟 Architecture Issues

- **Tight coupling:** EnrollmentFooter and step order depend on hardcoded paths and step index; adding/removing steps requires edits in multiple places (EnrollmentLayout, footer, stepConfig for V2).  
- **Feature duplication:** Two full enrollment flows (v1 and v2); two AI surfaces (Core AI modal vs Bella); multiple stepper components.  
- **Unclear ownership:** Enrollment state in one large EnrollmentContext; draft in enrollmentDraftStore; step eligibility and “can proceed” logic spread across pages.  
- **Mixed responsibilities:** Business logic (e.g. formatCurrency, risk colors) inside page components; should live in enrollment/logic or lib.  
- **Dead/legacy code:** app/routes.tsx unused; Bella not routed; optional app/routes.tsx and duplicate route definitions.  
- **Prototype code in repo:** core-ascend---retirement-command-center, intelligent-plan-selector, lumina-retirement, _isolated are standalone apps; they share repo but not build with main app — can cause confusion and dependency drift.

---

## 11️⃣ Environment Management

### Supported Environments

- **Development:** Vite dev server (npm run dev); optional Express server (npm run dev:server); proxy /api → localhost:3001.  
- **Staging:** Not explicitly differentiated; same build (npm run build); env would differ via Netlify env or .env per environment.  
- **Production:** Netlify build (npm run build), publish dist; /api/voice/* and /api/llm/* go to Netlify Functions; Core AI and voice can also run on Express (not Netlify) if configured.

### Configuration

- **.env (root):** VITE_* for frontend; documented in .env.example.  
- **server/.env:** SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, GOOGLE_CLOUD_CREDENTIALS, PORT, FRONTEND_URL; server/.env.example.  
- **Netlify:** Environment variables in Netlify UI; netlify.toml for build command, publish dir, functions dir, redirects.  
- **No per-env config files:** No config/dev.config.ts or env.development/env.production; single build, env injected at build time (Vite) or runtime (server/Netlify).

### Gaps

- No explicit staging vs production Supabase projects or env names (e.g. VITE_SUPABASE_URL_STAGING).  
- Feature flags (e.g. VITE_USE_ENROLLMENT_V2) are build-time; no runtime feature service.  
- Netlify redirects do not include /api/core-ai (Core AI is assumed to be on Express or a separate backend in production).

---

## 12️⃣ Performance Risks

- **Large components / re-renders:** EnrollmentContext has 20+ fields; any update re-renders all consumers; no selectors or slice-based context.  
- **No route-level lazy loading:** Router uses static imports for all pages; only dashboard modules (DashboardRegistry) use React.lazy + Suspense.  
- **Duplicate API calls:** No React Query/SWR; UserContext, plansService, companyBrandingService can be called from multiple places; risk of duplicate fetches for same data.  
- **Heavy CSS:** Many global and feature CSS files imported up front in main.tsx; no obvious code-split by route.  
- **Image loading:** Some images use loading="lazy" and decoding="async"; not audited app-wide.

---

## 13️⃣ Recommended Architecture (Clean Rebuild)

### Goals

- Single enrollment flow (deprecate v1 or merge best of v1/v2 into one).  
- One AI entry point (Core AI modal vs Bella: choose one or route Bella and sync state).  
- Single stepper component and single source of truth for step order (config array).  
- Design system: one token file (or clear hierarchy), one set of primitives (Button, Card, Input, Modal), documented in Storybook or docs.  
- Data layer: React Query or SWR for auth-scoped data (profile, company, plans); Supabase client behind services; no direct from() in arbitrary components.  
- Env: explicit dev/staging/prod env files or naming (e.g. .env.development, .env.production, or VITE_APP_ENV).  
- Figma: keep “reference only” and INTEGRATION_RULES; add Code Connect or a component map for Figma → codebase.  
- Security: RLS on every table; no service role on client; secrets only in env; audit logs for sensitive actions.

### Recommended Folder Structure (High Level)

```
src/
  app/                    # router, env config, root layout
  core/                   # auth, theme, i18n, supabase client
  design-system/         # tokens (single source), primitives (Button, Card, Input, Modal)
  features/              # enrollment (single flow), investments, transactions, personalization, settings
  layouts/               # Root, Dashboard, Enrollment (one)
  pages/                 # thin pages that compose features
  shared/                # hooks, utils, types, shared UI
  services/              # api/supabase wrappers, no direct from() in features
  locales/
  lib/                    # network, analytics, etc.
```

- **features/enrollment:** One engine (step config, canProceed, getNext/Prev); one layout; one set of step pages; draft from server or single draft store.  
- **design-system:** theme/tokens + components/ui consolidated; document tokens and components.  
- **core:** Auth, User, Theme, OTP providers; Supabase client init.  
- **services:** plans, enrollment, companyBranding, feedback; optionally React Query hooks that call these.

### Optional Additions

- **Figma:** Code Connect or design-docs mapping Figma components to design-system components.  
- **AI:** Single entry (e.g. Core AI only), or route /voice and sync Bella with enrollment/transaction state.  
- **Lazy routes:** React.lazy for heavy route trees (enrollment, transactions, settings).  
- **Env:** VITE_APP_ENV and per-env Supabase URLs/keys for staging vs prod.

---

## 14️⃣ Migration Plan

### Phase 1 — No Behavior Change

- Add recommended folder structure (e.g. core/, design-system/) and move files incrementally; fix imports.  
- Introduce a single step config (array of path, labelKey, order) and refactor EnrollmentLayout and footer to use it.  
- Consolidate token files into one hierarchy (e.g. design-system/tokens.css) and re-export in theme for backward compatibility.  
- Add React Query or SWR for profile and company; keep existing contexts but feed from query cache.  
- Document RLS for every table used from client; fix any missing policies.

### Phase 2 — Single Enrollment and AI

- Choose v1 or v2 (or merge); single EnrollmentLayout and step set; remove EnrollmentRedirectWhenV2 and feature flag; delete or archive the other flow.  
- Consolidate steppers into one ProgressStepper with variants.  
- Decide Core AI vs Bella; if Bella: add route, sync state with enrollment/context; if Core AI only: remove or stub Bella.

### Phase 3 — Data and Env

- Move all Supabase reads/writes behind services; use React Query where appropriate; remove direct supabase.from() from components.  
- Introduce env strategy (e.g. .env.development, .env.production, or VITE_APP_ENV) and document for dev/staging/prod.  
- Add runtime feature flags if needed (e.g. from profile or env).

### Phase 4 — Performance and Polish

- Lazy-load route trees for enrollment, transactions, settings.  
- Split EnrollmentContext into smaller contexts or Zustand slices with selectors to reduce re-renders.  
- Remove dead code (app/routes.tsx, unused components); move or remove experimental folders (core-ascend-*, intelligent-plan-selector, lumina-retirement, _isolated) to separate repos or archive.

### Safety

- One PR per logical change; feature flags for big switches (e.g. “use new enrollment engine”).  
- E2E or critical path tests before removing v1 or changing auth.  
- Keep INTEGRATION_RULES and Figma reference-only workflow; add design-system docs for new components.

---

**End of report.** Use this as the baseline understanding for a clean rebuild; no code was modified during this audit.
