# Retirement Participant Portal — Full Architecture Audit

**Audit type:** Structural and system-only (no code rewrites, no refactor execution, no UI tweaks).  
**Scope:** White-label SaaS — multi-company, light/dark, i18n, gradients, AI voice/search, responsive, enrollment wizard, dashboard/auth/profile.  
**Verdict:** Enterprise SaaS readiness is **partial**. Strong foundations (theme engine, enrollment step centralization, i18n) are undermined by a **20k-line global CSS blob**, **3.5k-line monolithic screen**, **dual token systems**, and **fragmented AI/voice**. White-label and dark mode work today but are brittle and will not scale without structural change.

---

## PART 1 — GLOBAL ARCHITECTURE MAP

### 1.1 Folder structure (high level)

```
src/
├── app/                    # Router, routes, investments layout/page
├── agent/                  # Legacy AgentController, intentClassifier, taskDefinitions, LLMEnhancer
├── bella/                  # BellaScreen (voice/conversation UI), agents/*, ui/*
├── components/
│   ├── ai/                 # CoreAIFab
│   ├── auth/               # Login/signup/OTP panels, ProtectedRoute
│   ├── brand/              # Logo, CoreProductBranding, CoreLogo
│   ├── core-ai/            # CoreAssistantModal, MessageInput, flows (loan, enrollment, etc.)
│   ├── dashboard/          # Header, cards, modules (activity, snapshot, hero, etc.)
│   ├── enrollment/         # Stepper, footer, PlanCard, contribution/*, PersonalizePlanModal, etc.
│   ├── investments/        # Allocation, ManualBuilder, FundSearchModal, etc.
│   ├── layout/             # Footer
│   ├── loan/               # Steps, AmortizationTable, etc.
│   ├── profile/            # ProfileCard, ContactInformationCard, etc.
│   ├── pre-enrollment/     # HeroSection, AdvisorSection, LearningSection
│   ├── system/             # NetworkBanner
│   ├── transactions/       # TransactionApplication, TransactionFlowFooter, etc.
│   ├── ui/                 # Button, Input, Modal, Switch, HelpSectionCard, FuturisticSearch
│   └── voice/              # VoiceControls
├── context/                # Theme, Auth, User, Otp, AISettings, CoreAIModal, Network
├── enrollment/             # context/EnrollmentContext, logic/*, enrollmentDraftStore, enrollmentStepPaths
├── features/               # transactions/, transaction-hub/
├── layouts/                # RootLayout, DashboardLayout, EnrollmentLayout
├── lib/                    # supabase, network, analytics
├── pages/                  # auth, dashboard, enrollment, profile, settings, transactions
├── services/               # coreAiService, companyBrandingService, enrollmentService, etc.
├── theme/                  # tokens.css, light.css, dark.css, enrollment-dark.css, utils, themeManager, defaultThemes
├── styles/                 # tokens.css, enrollment-choose-plan.css, contribution-page-figma.css
├── data/                   # mockTransactions, usStates, enrollmentSummary, etc.
├── hooks/
├── utils/
├── locales/                # en, es, fr, de, zh, ja, hi, ta (common, enrollment, dashboard, plans, voice)
└── index.css               # ~19,811 lines — global styles, BEM-like blocks, enrollment/transaction/choose-plan
```

### 1.2 Layout structure

- **RootLayout**: Wraps all routes; renders `Outlet`, `CoreAIFab`, `DemoSwitcher`, `SplashScreen`, `RouteErrorBoundary`. Does not render children under a single content wrapper.
- **EnrollmentLayout**: Wraps `/enrollment/*` with `EnrollmentProvider`. Renders either:
  - **Step routes** (choose-plan, contribution, auto-increase, investments, review): `DashboardLayout` with `DashboardHeader` + `EnrollmentHeaderWithStepper` + `transparentBackground` + `<Outlet key={pathname} />`.
  - **Non-step routes** (e.g. manage): raw `<Outlet />` (no DashboardLayout).
- **DashboardLayout**: Two modes:
  - **Default**: `main` with padding, inner `max-w-7xl` wrapper.
  - **transparentBackground**: no inner `max-w-7xl`; single `flex-1` div; enrollment pages own full-bleed and max-width.

Layout nesting: **RootLayout → (route element) → optionally EnrollmentLayout → EnrollmentStepLayout → DashboardLayout → Outlet (page)**.

### 1.3 Routing structure

- Single **createBrowserRouter** in `app/router.tsx`; all routes under one `element: <RootLayout />`.
- **Flat routes**: `/`, `/verify`, `/forgot`, `/dashboard`, `/profile`, `/transactions`, `/settings`, etc.
- **Enrollment subtree**: `path: "/enrollment"`, `element: <ProtectedRoute><EnrollmentLayout /></ProtectedRoute>`, **children**: index → EnrollmentManagement; manage/:planId; choose-plan; plans; contribution; auto-increase; future-contributions → redirect; investments (guard); review.
- **Transaction subtree**: `/transactions`, `/transactions/:transactionType/start`, `:transactionType/:transactionId`, `/transactions/:transactionId` (analysis).
- **Investments**: `/investments` wrapped in `InvestmentProvider` + `InvestmentsLayout`.

No route-based tenant or brand resolution; no lazy loading visible at route level.

### 1.4 Feature modules

| Feature        | Location                    | Entry / boundary                         |
|----------------|-----------------------------|------------------------------------------|
| Auth           | pages/auth, components/auth  | Login, Signup, VerifyCode, ProtectedRoute|
| Dashboard      | pages/dashboard, components/dashboard | PreEnrollment, Dashboard, PostEnrollmentDashboard |
| Enrollment     | pages/enrollment, components/enrollment, enrollment/ | EnrollmentLayout, EnrollmentContext, enrollmentStepPaths |
| Transactions   | pages/transactions, features/transactions, transaction-hub | TransactionApplicationRouter, BaseApplication |
| Profile        | pages/profile, components/profile | Profile                                  |
| Settings       | pages/settings              | SettingsHub, ThemeSettings, theme-editor |
| AI / Voice     | bella/, agent/, core-ai/, services/coreAiService | CoreAIFab, BellaScreen, AgentController  |
| Investments    | app/investments, components/investments, context/InvestmentContext | InvestmentsLayout, InvestmentsPage       |

### 1.5 Shared components and utilities

- **Shared UI**: `components/ui` — Button, Input, Modal, Switch, Dropdown, HelpSectionCard, SectionHeadingWithAccent, ThemeToggle, etc. Also Radix primitives, MUI in places.
- **Utilities**: `utils/` (voiceAgent, loanCalculator, retirementCalculations, etc.), `lib/` (supabase, network, analytics).
- **Context providers**: Theme, Auth, User, Otp, AISettings, CoreAIModal, Network (in main.tsx); Enrollment (in EnrollmentLayout); Investment, InvestmentWizard (route/layout scoped).

### 1.6 State management

- **React Context only** — no Redux/Zustand/Jotai. Per-area: AuthContext, UserContext (profile, company), ThemeContext (mode, companyTheme, override), EnrollmentContext (full wizard state), InvestmentContext, AISettingsContext, CoreAIModalContext, OtpContext, NetworkContext.
- **Enrollment persistence**: `enrollmentDraftStore` (localStorage) + `EnrollmentContext` in memory; draft loaded once in EnrollmentProvider.
- **Contribution-specific**: `useContributionStore` (enrollment/context) for local contribution UI state.

### 1.7 Coupling between features

- **Enrollment** depends on: `enrollmentStepPaths`, `enrollmentDraftStore`, `EnrollmentContext`, `DashboardLayout`, `EnrollmentHeaderWithStepper`, `EnrollmentFooter` (pathname-driven). Steps import shared enrollment components and context.
- **Theme** affects: entire app via `applyThemeToDOM` and `.dark`/`:root` in CSS. UserContext triggers `setCompanyBranding` when company/profile loads.
- **AI**: CoreAIFab/CoreAssistantModal use `coreAiService` and `CoreAIModalContext`; BellaScreen uses same `sendCoreAIMessage` plus bella-specific agents. AgentController and voiceAgent are separate paths.
- **Dashboard/Post-enrollment** import dashboard components and sometimes enrollment or transaction types.

### 1.8 Circular dependencies

- No full static analysis run; import patterns are mostly **one-way** (pages → components → context/hooks). Risk: **theme/utils** and **themeManager** used by ThemeContext; **styles/tokens.css** and **theme/tokens.css** both referenced from main.tsx — potential for CSS and token dependency tangles, not necessarily JS cycles.

### 1.9 Large monolithic files

| File / asset       | Lines (approx) | Risk |
|--------------------|----------------|------|
| index.css          | 19,811         | Critical — single global stylesheet, 368+ hex colors, BEM-style blocks; hard to maintain and theme. |
| bella/BellaScreen.tsx | 3,471      | Critical — one component handles conversation UI, voice, routing, scripted flows, state. |
| agent/AgentController.ts | 857       | High — single class for all agent behavior. |
| pages/enrollment/FutureContributions.tsx | 1,113 | High — one page with heavy inline logic and UI. |
| bella/agents/loanApplicationAgent.ts | 988 | High — large agent module. |
| agent/LLMEnhancer.ts | 682 | Medium. |
| bella/agents/planEnrollmentAgent.ts | 661 | Medium. |
| components/enrollment/PersonalizePlanModal.tsx | 765 | Medium. |
| pages/auth/Signup.tsx | 608 | Medium. |
| pages/enrollment/Review.tsx | 600 | Medium. |

---

### Architecture diagram (text)

```
                    [main.tsx]
                         │
         I18nextProvider │ ThemeProvider, AuthProvider, OtpProvider,
                         │ UserProvider, AISettingsProvider, NetworkProvider
                         ▼
                 [RouterProvider] ← router (createBrowserRouter)
                         │
                    [RootLayout]
                         │ Outlet + CoreAIFab + DemoSwitcher
         ┌────────────────┼────────────────────────────────────────┐
         │                │                                          │
    [Login] [Dashboard] [EnrollmentLayout]              [Profile] [Transactions] ...
         │                │
         │           EnrollmentProvider
         │                │
         │     ┌──────────┴──────────┐
         │     │                     │
         │  Step path?           Non-step
         │     │                     │
         │  DashboardLayout      <Outlet />
         │  (header+stepper,
         │   transparentBg)
         │     │
         │  <Outlet /> → ChoosePlan | Contribution | FutureContributions | ...
         │
         └─────────────────────────────────────────────────────────────

  Theme: documentElement.className = light|dark
         documentElement.style[*] = applyThemeToDOM(companyTheme.effective)
  CSS:   theme/tokens.css, styles/tokens.css, enrollment-choose-plan.css,
         contribution-page-figma.css, theme/light.css, dark.css, enrollment-dark.css, index.css
```

### Strengths

- **Centralized enrollment steps**: `ENROLLMENT_STEP_PATHS` and `enrollmentStepPaths` drive stepper and footer; no magic step numbers in components.
- **Theme engine**: ThemeManager + ThemeContext + applyThemeToDOM support DB-driven branding and dark generation; logo and font are configurable.
- **Single router**: One createBrowserRouter; layout nesting is clear.
- **i18n**: react-i18next with multiple locales and namespaced JSON (common, enrollment, dashboard, plans, voice).
- **Protected routes**: Auth and route structure support guarded screens.

### Architectural risks

1. **Single 20k-line CSS file** — high regression risk; hard to scope tokens and theme; blocks scalable white-label.
2. **Dual token systems** — `theme/tokens.css` and `styles/tokens.css` overlap (e.g. --color-*, --enroll-*); ordering in main.tsx determines precedence; confusion and drift.
3. **BellaScreen monolith** — 3.5k lines; voice, conversation, and flow logic in one component; hard to test and reuse.
4. **Enrollment navigation** — footer uses `window.location.href` for “Next”, causing full page reload; breaks SPA expectations and complicates state/analytics.
5. **Multiple AI/voice entry points** — Bella (SpeechRecognition inline), CoreAssistantModal (useSpeechRecognition), useSpeechToText (backend STT); no single voice service.
6. **Deep context nesting** — many providers in main.tsx; any theme/auth/user change can trigger broad re-renders.
7. **No tenant resolution at router** — brand/company comes from UserContext after auth; no route or subdomain-based tenant.
8. **Scattered theme application** — class on `<html>` plus inline styles from ThemeContext; CSS files also define .dark/:root; possible flash and override conflicts.

---

## PART 2 — STYLING SYSTEM AUDIT

### 2.1 Styling approach

- **Tailwind CSS**: Used throughout TSX (className with utilities). Config: `darkMode: "class"`, theme.extend with CSS variable references (e.g. `background: "var(--color-background)"`).
- **Global CSS**: `index.css` (massive), `theme/tokens.css`, `theme/light.css`, `theme/dark.css`, `theme/enrollment-dark.css`, `styles/tokens.css`, `styles/enrollment-choose-plan.css`, `styles/contribution-page-figma.css`. Load order in main.tsx: theme/tokens → styles/tokens → enrollment-choose-plan → contribution-page-figma → light → dark → enrollment-dark → index.
- **CSS Modules**: Not used.
- **Styled Components / Emotion**: `@emotion/react` and `@emotion/styled` in package.json; MUI uses Emotion; no project-wide styled-components pattern.
- **Inline styles**: Used for theme-driven values (e.g. `style={{ background: "var(--enroll-bg)" }}`) and in ThemeContext (applyThemeToDOM sets root.style).

### 2.2 Hardcoded colors and gradients

- **index.css**: 368+ hex color occurrences; many BEM-style blocks with fixed colors (e.g. `.choose-plan__*`, `.contribution-page__*`, `.enrollment-footer__*`).
- **styles/tokens.css**: Gradients and hex in :root (e.g. `--gradient-badge: linear-gradient(90deg, #155dfc 0%, #1447e6 100%)`, `--color-border-active: #155dfc`).
- **theme/tokens.css**: :root and .dark define many hex values (--enroll-*, --color-*, chart palette).
- **TSX**: Dozens of files use `#` or `rgb(`/`rgba(` in style or className (e.g. PlanCard, FutureContributions, dashboard scenarios, theme-editor).

### 2.3 Design tokens

- **Exist**: Yes. Two layers:
  - **theme/tokens.css**: Base palette, spacing, radius, shadows, enrollment (--enroll-*), contribution (--contrib-*). Overridden by ThemeProvider via applyThemeToDOM (--color-primary, --enroll-brand, etc.).
  - **styles/tokens.css**: Semantic names (--color-bg-primary, --gradient-card-bg, --space-*, --radius-*, --font-size-*). Dark overrides via [data-theme="dark"] and .dark.
- **Gradients**: Some as tokens (--banner-gradient, --contrib-*), many hardcoded in styles/tokens.css and index.css. Theme utils generate banner-gradient from primary; enrollment gradients partly tokenized (--enroll-*).

### 2.4 Theme switching

- **Mechanism**: Class-based. `document.documentElement.classList` add/remove `light`/`dark`; `data-theme` set to `light`/`dark`. Tailwind `darkMode: "class"` so `.dark` triggers dark utilities.
- **Token application**: ThemeContext calls `applyThemeToDOM(currentColors)` which sets inline style on `document.documentElement` for ~50+ CSS variables (--color-primary, --enroll-brand, --logo-url, etc.). So: **class** drives which set of CSS rules apply (e.g. .dark in CSS files), and **inline vars** override from company theme (light or dark palette).

### 2.5 Gradients and white-label

- **Scalable**: Partially. ThemeColors (primary, accent, etc.) drive --banner-gradient and --enroll-brand/--enroll-accent; generateDarkTheme produces dark palette. Many gradients in styles/tokens.css and index.css are **fixed hex** and do not use brand tokens; enrollment-dark.css and theme/tokens.css add enrollment overrides. So: **core theme is gradient-ready; large parts of the app are not**.

### Output scores and risks

| Metric                     | Score | Notes |
|----------------------------|-------|--------|
| **Current styling model**  | Hybrid | Tailwind + global CSS + inline theme vars; two token files; BEM-like in index.css. |
| **Dark mode robustness**   | **5/10** | Token overrides exist for .dark and [data-theme="dark"]; 368 hex in index.css and hardcoded gradients in styles/tokens.css can ignore dark; risk of contrast and consistency. |
| **White-label readiness**  | **4/10** | Theme engine and applyThemeToDOM support multiple brands; logo and font configurable. Undermined by duplicate tokens, hardcoded hex/gradients in index and styles/tokens, and no single source of truth. |
| **Design system maturity** | **4/10** | Tokens and Tailwind theme exist; no single component design system (Button vs AuthButton, many Card variants); index.css is a 20k-line “kitchen sink”. |
| **Risks**                  | (1) Two token systems and load order sensitivity, (2) index.css unmaintainable and blocks theming, (3) Hardcoded colors in TSX and CSS, (4) Gradient system only partly tokenized. |

---

## PART 3 — THEME + WHITE-LABEL READINESS

### 3.1 Multiple brands without changing UI components?

- **Partially.** ThemeContext + themeManager + applyThemeToDOM allow switching palette, logo, and font by company. UI components that use `var(--color-primary)`, `var(--enroll-brand)`, etc., will follow. **But** many components or global CSS use hex, fixed gradients, or tokens that are not overridden by ThemeProvider (e.g. styles/tokens.css gradients, index.css blocks). So: **yes for token-driven components; no for the rest** without replacing hardcoded values.

### 3.2 Colors centralized?

- **Partially.** Central definition in theme/tokens.css and theme/utils (ThemeColors, generateDarkTheme). Overrides applied at runtime to root. Second set in styles/tokens.css and large amount of non-token color in index.css and TSX. So: **two centers** and significant leakage.

### 3.3 Logo dynamic?

- **Yes.** ThemeContext setCompanyBranding(companyName, dbJson, logoUrl); applyThemeToDOM sets `--logo-url: url(${colors.logo})`. Logo component(s) can consume this.

### 3.4 Typography configurable?

- **Yes.** ThemeColors.font; applyThemeToDOM sets `--font-family` on root. Tailwind theme also has fontFamily.sans/display (fixed).

### 3.5 Gradient system configurable?

- **Partially.** Banner and enroll-related gradients are derived from primary/accent in applyThemeToDOM. Many other gradients in styles/tokens.css and index.css are fixed; not configurable per tenant.

### 3.6 Spacing consistent?

- **Mixed.** theme/tokens.css has --spacing-* and --radius-*; styles/tokens.css has --space-* and --radius-*; Tailwind has default spacing and custom rhythm-*. No single spacing scale; risk of inconsistency.

### 3.7 Inject brand config per tenant?

- **Yes, at runtime.** UserContext loads profile/company; ThemeContext setCompanyBranding(companyName, dbJson, logoUrl) is called with DB payload; themeManager.getTheme(companyName, dbJson) returns CompanyTheme; applyThemeToDOM applies it. **No** route/subdomain/tenant resolution; tenant is “current user’s company”.

### Output

- **White-label architecture maturity**: **5/10** — Engine (themeManager, ThemeContext, applyThemeToDOM) is data-driven and supports DB branding; logo and typography are configurable. **Blocks scaling**: (1) Duplicate and hardcoded tokens/gradients in CSS and TSX, (2) index.css too large and non-token, (3) No tenant resolution at bootstrap (e.g. by subdomain or route), (4) Spacing and gradient systems only partly tokenized.
- **What must be restructured**: (1) Single token layer and remove duplication, (2) Replace or modularize index.css so all visual decisions go through tokens, (3) Define tenant resolution (e.g. once at app init) and pass brand config down, (4) Gradient and spacing scales as first-class token sets.

---

## PART 4 — DARK / LIGHT MODE

### 4.1 Implementation

- **Class-based**: `document.documentElement.classList` holds `light` or `dark`; set before first paint from localStorage (and system preference if mode is "system"). Tailwind uses `darkMode: "class"`.
- **Token-driven**: CSS files define `.dark` and `[data-theme="dark"]` overrides for variables. ThemeContext passes `effectiveMode` and applies `currentColors` (activeTheme.light or activeTheme.dark) via applyThemeToDOM, so root inline vars switch with mode.

### 4.2 Token-driven vs class-based

- **Both.** Class drives which CSS selectors apply (.dark). Inline vars from ThemeContext override with the correct light/dark palette. So components using `var(--color-*)` or `var(--enroll-*)` follow theme; components or CSS using hex or non-overridden tokens may not.

### 4.3 Hardcoded light-only values

- **Yes.** index.css and styles/tokens.css contain many hex and rgba values that do not change in .dark (e.g. gradients, borders, backgrounds in BEM blocks). Any component using fixed colors in style or Tailwind arbitrary values will stay light-only unless explicitly overridden in .dark.

### 4.4 Icons

- **Lucide React** used; stroke-based. No explicit theme variant in codebase; they inherit color (e.g. text or stroke from parent). If parent uses a token, icons adapt; if parent uses hex, they do not.

### 4.5 Gradients theme-aware?

- **Partially.** Theme utils generate dark theme; applyThemeToDOM sets --banner-gradient from primary. enrollment-dark.css and dark.css override some --enroll-* and gradients. Many other gradients in styles/tokens.css and index.css are fixed.

### 4.6 Components breaking in dark mode?

- **Likely.** Without a full sweep: any block in index.css or styles/tokens.css that uses only :root (light) values and has no .dark override can break (contrast, visibility). Enrollment and contribution have dedicated dark overrides; older or one-off components may not.

### Output

- **Dark mode stability rating**: **5/10** — Mechanism (class + token override) is correct; ThemeContext and enrollment/contribution tokens support dark. Stability is undermined by **368 hex in index.css**, hardcoded gradients, and unknown number of components not using tokens.
- **Required structural changes**: (1) Audit all index.css and styles/tokens.css for .dark equivalents or conversion to tokens, (2) Remove or replace hardcoded hex/gradients with variables, (3) Single source of truth for light/dark so no “half tokenized” files.

---

## PART 5 — RESPONSIVE SYSTEM

### 5.1 Breakpoints

- **Tailwind default**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px). No custom breakpoints in tailwind.config.js. Consistent across app for Tailwind usage.

### 5.2 Mobile-first

- **Assumed** where Tailwind responsive prefixes are used (e.g. base first, then sm:, md:, lg:). No audit of every layout; many components use responsive classes. No single “mobile-first” policy document.

### 5.3 Fixed widths

- **Layout**: max-w-7xl (1280px) in DashboardLayout (when not transparent) and in EnrollmentPageContent. --layout-content-max, --layout-container-max in styles/tokens.css (1144px, 1200px). Risk of multiple “max content” concepts.

### 5.4 Desktop-only assumptions

- **Not audited in depth.** Enrollment wizard and contribution use grids (e.g. lg:grid-cols-3); some modals and panels may assume minimum width. No explicit “desktop-only” routes.

### 5.5 Enrollment wizard on small screens

- **Adapts** via Tailwind (e.g. stacking, padding). EnrollmentHeaderWithStepper and EnrollmentFooter are used; layout is responsive. Full-bleed enrollment background and min-height are applied in EnrollmentPageContent.

### Output

- **Responsive maturity score**: **6/10** — Tailwind and responsive utilities are used; breakpoints are consistent. No single layout primitive or documented breakpoint strategy; fixed max-widths appear in several places.
- **Structural improvements**: (1) Document breakpoint and mobile-first policy, (2) Unify content width (single max-width token and usage), (3) Audit enrollment and transaction flows on narrow viewports.

---

## PART 6 — AI ARCHITECTURE AUDIT

### 6.1 AI logic separated from UI?

- **Partially.** Backend: `/api/core-ai` and coreAiService.sendCoreAIMessage. Client: **BellaScreen** holds conversation state, voice handling, and scripted flow orchestration in one 3.5k-line component. **bella/agents** (planEnrollmentAgent, loanApplicationAgent, withdrawalInfoAgent, vestingInfoAgent) contain flow logic but are invoked from BellaScreen. **CoreAssistantModal** uses flowRouter and flow handlers (loan, enrollment, etc.) and sendCoreAIMessage for “general” replies. **AgentController** and intentClassifier are a separate legacy path. So: **API and some agents are separate; UI and flow orchestration are tightly coupled in Bella and Core AI modal**.

### 6.2 VoiceAssistant modular?

- **No.** Three separate implementations: (1) **BellaScreen** — inline SpeechRecognition/webkitSpeechRecognition, startVoiceInput and handlers in the same file. (2) **CoreAssistantModal** — useSpeechRecognition hook (final transcript only). (3) **useSpeechToText** — MediaRecorder + POST /api/voice/stt. No shared voice service or single entry point.

### 6.3 Business logic mixed with UI?

- **Yes in Bella.** checkLoanIntent regex, handleUserInput, flow selection, and conversation state all live in BellaScreen. Agents return structured data but orchestration and “what to show when” are in the screen. Core AI flows (flowRouter, continueFlow, startFlow) are in components/core-ai/flows; better separation but still UI-adjacent.

### 6.4 AI reusable?

- **Partially.** sendCoreAIMessage is reused by CoreAssistantModal and BellaScreen. Flow types (loan, enrollment, withdrawal, vesting) are shared. **Not reusable**: voice (three implementations), intent/routing (Bella vs flowRouter vs AgentController), and conversation state (each surface owns its own).

### 6.5 Search system decoupled?

- **FuturisticSearch** exists (components/ui); takes onVoiceTrigger and isDashboard. No single “AI search” or global search service found; Core AI is conversational, not a dedicated search API. Decoupling is at component level, not at “search backend” level.

### 6.6 Service layer abstraction?

- **Thin.** coreAiService.sendCoreAIMessage is the only clear API abstraction for “AI”. Voice has no shared service; agent logic is in bella/agents and agent/ (AgentController, intentClassifier). No unified “AI gateway” or “intent → action” layer that both UI and voice could call.

### Output

- **AI architecture maturity score**: **4/10** — One shared API for Core AI and a clear flowRouter for scripted flows. **Risks**: (1) BellaScreen monolith, (2) Three voice paths, (3) Duplicate intent/flow logic (Bella vs Core AI vs AgentController), (4) No single conversation/state machine abstraction.
- **Refactor recommendations (high level)**: (1) Extract a single **voice service** (STT + optional TTS) used by both Bella and Core AI. (2) Move **conversation and flow orchestration** out of BellaScreen into a dedicated layer (e.g. hooks + small screens). (3) **Unify intent/routing**: one pipeline (e.g. flowRouter + backend) and deprecate AgentController or fold into same pipeline. (4) **Service layer**: single “AI client” that handles message send, optional voice, and optional scripted flow handoff.

---

## PART 7 — ENROLLMENT FLOW STRUCTURE

### 7.1 Steps centralized?

- **Yes.** `enrollmentStepPaths.ts`: ENROLLMENT_STEP_PATHS, ENROLLMENT_STEP_LABEL_KEYS, getStepIndex, isEnrollmentStepPath. Single source of truth for order and labels; stepper and footer consume it.

### 7.2 State global or per page?

- **Global within enrollment.** EnrollmentContext holds full wizard state (plan, contribution, assumptions, auto-increase, profile, etc.). Draft in localStorage (enrollmentDraftStore) is merged when EnrollmentProvider mounts. useContributionStore is additional local state for contribution UI. So: **global context + draft persistence + optional local state per step**.

### 7.3 Routing fragile?

- **Partially.** Step order is fixed and path-driven; Back/Next use ENROLLMENT_STEP_PATHS. **Fragility**: EnrollmentFooter uses **window.location.href** for Next (full page reload). That was likely added to force a clean load of the next step but breaks SPA behavior and complicates state/analytics. Route definitions and guards (e.g. EnrollmentInvestmentsGuard) are clear; the href is the main structural risk.

### 7.4 Validation reusable?

- **Not centralized.** Validation appears in page components or in enrollment logic (e.g. contribution validation). No single “enrollment step validation” layer or schema visible.

### 7.5 AI mirror of manual flow?

- **Partially.** Bella and Core AI can run enrollment-related flows (planEnrollmentAgent, enrollmentFlow in core-ai/flows). They do not share the same state machine as the manual wizard; they have their own state and steps. So: **AI can mirror concepts but not a single “enrollment state machine”** shared with the UI.

### Output

- **Enrollment system maturity score**: **6/10** — Centralized steps and labels; global context and draft store. **Structural concerns**: (1) Next-step navigation via full reload (window.location.href), (2) No shared validation layer, (3) AI flows not driven by same state/definition as manual wizard.

---

## PART 8 — GLOBAL COMPONENT SYSTEM

### 8.1 Buttons standardized?

- **No.** At least **Button** (components/ui/Button) and **AuthButton** (components/auth/AuthButton); enrollment and transaction footers use Button with custom classes. No single primary/secondary/danger API used everywhere; visual and API drift.

### 8.2 Cards reusable?

- **Partially.** Many *Card components (PlanCard, PlanSelectionCard, HeroEnrollmentCard, DashboardCard, ResourceCard, etc.). Some use tokens; some use BEM classes from index.css. No single Card base component or variant system.

### 8.3 Form inputs unified?

- **No.** Input, AuthInput, AuthPasswordInput, PasswordInput, SegmentedToggle, input-otp, etc. Radix and MUI also used. No single Input primitive with theme and accessibility contract.

### 8.4 UI foundation layer?

- **Partial.** components/ui has Button, Input, Modal, Switch, Dropdown, HelpSectionCard, etc. Overlaps with auth-specific and feature-specific components. No single “design system” package or documented foundation.

### 8.5 Visual abstraction layer?

- **Partial.** Tokens (--color-*, --enroll-*) provide abstraction; Tailwind theme references them. Large parts of index.css and styles/tokens.css are concrete (hex, fixed gradients), so abstraction is inconsistent.

### Output

- **Design system maturity**: **4/10** — Building blocks exist; tokens and Tailwind are used. **Component duplication**: Multiple buttons, many card variants, multiple inputs and modals; no single source of truth for primitives or variants.

---

## PART 9 — TECHNICAL DEBT REPORT

### Top 10 architectural risks

1. **index.css ~20k lines and 368+ hex** — Single global stylesheet and hardcoded colors block theme and white-label scaling; high regression risk.
2. **BellaScreen 3.5k lines** — One component for conversation, voice, and flows; hard to test, reuse, or replace.
3. **Dual token systems** (theme/tokens.css vs styles/tokens.css) — Overlap and load-order sensitivity; confusion and drift.
4. **EnrollmentFooter uses window.location.href for Next** — Full reload; breaks SPA model and complicates state and analytics.
5. **Three voice implementations** (Bella inline, useSpeechRecognition, useSpeechToText) — No single voice service; maintenance and behavior drift.
6. **Theme application split** (class + inline root styles + multiple CSS files) — Flash and override risks; no single “theme apply” contract.
7. **No tenant/brand resolution at router or bootstrap** — Brand comes from user context after auth; no subdomain or route-based tenant.
8. **Duplicate Button/Card/Input patterns** — No single primitive set; visual and API inconsistency.
9. **AgentController vs Bella vs Core AI flows** — Multiple intent/routing paths; no single AI pipeline.
10. **applyThemeToDOM overwrites many vars** — CSS file defaults can be overridden correctly but also hide missing token coverage.

### Top 10 scalability risks

1. **Monolithic CSS** — Adding features or tenants forces touching a huge file; no domain or component-scoped CSS strategy.
2. **Monolithic BellaScreen** — Any change to voice or one flow risks the whole screen; no composition or feature boundaries.
3. **Enrollment state not serializable for AI** — No single state machine or schema shared by UI and AI; duplication and drift.
4. **No feature flags or gradual rollout** — Hard to ship AI or enrollment changes behind flags.
5. **Router flat and large** — Single router with many routes; no lazy loading or domain-based splitting visible.
6. **Many contexts** — Deep provider tree; any theme/auth/user change can trigger broad re-renders.
7. **Duplicate token definitions** — Adding a new token requires touching multiple files; risk of inconsistency.
8. **Hardcoded company themes in defaultThemes** — New tenants require code change unless DB-only path is used everywhere.
9. **No API layer abstraction** — fetch and service calls scattered; no single HTTP client or error/retry strategy.
10. **Mixed state** (context + localStorage + local state) — No clear “source of truth” pattern for wizard or profile.

### Top 10 refactor priorities (ordered)

1. **Consolidate token system** — Single token layer (e.g. theme/tokens.css as source); remove or re-export styles/tokens.css; document override order (theme vs .dark vs inline).
2. **Break up index.css** — Replace with design tokens + scoped or component-level CSS; remove or convert 368 hex to variables.
3. **Split BellaScreen** — Extract conversation UI, voice hook/service, and flow orchestration into smaller components and hooks; keep BellaScreen as a thin composition.
4. **Single voice service** — One STT (and optional TTS) abstraction used by Bella and CoreAssistantModal; deprecate duplicate implementations.
5. **Enrollment Next without full reload** — Use navigate() and route-driven step rendering; remove window.location.href; fix any state/scroll issues that motivated reload.
6. **Unify theme application** — Single place that applies “effective theme” (class + vars); avoid duplicate .dark definitions and inline overwrites where possible.
7. **Single Button/Card/Input foundation** — One set of primitives with variants (primary, secondary, danger, etc.); migrate AuthButton and key cards to use them.
8. **AI service layer** — One “AI client” for send message, optional voice, and scripted flow handoff; align Bella and Core AI on same pipeline.
9. **Tenant/brand resolution at bootstrap** — Resolve tenant (e.g. from subdomain or config) before or with auth; apply brand once and pass down.
10. **Reduce context nesting / consider store** — Evaluate moving theme or auth to a store (e.g. Zustand) or splitting providers to reduce re-render scope; keep API clear.

---

## FINAL OUTPUT

### 1. Executive summary

The Retirement Participant Portal has **working** multi-tenant theming, centralized enrollment steps, and i18n, but **structural debt** is high: a **~20k-line global CSS file**, a **3.5k-line AI/voice screen**, **two token systems**, and **three voice paths**. White-label and dark mode **work today** but are **brittle** and will not scale without consolidating tokens, modularizing CSS and BellaScreen, and unifying AI/voice and enrollment navigation. This is **not yet** production-ready for enterprise multi-tenant SaaS at scale without the refactor roadmap below.

### 2. System maturity rating: **5/10**

- **Strengths**: Theme engine, enrollment step centralization, routing and layouts, i18n.
- **Weaknesses**: Monolithic CSS and BellaScreen, duplicate tokens and voice/AI paths, enrollment Next via full reload, no single component or design system contract.

### 3. White-label readiness rating: **5/10**

- **Ready**: Logo, font, and palette injection; themeManager and DB-driven branding.
- **Not ready**: Single token layer, no hardcoded hex/gradients in global CSS, no tenant resolution at bootstrap, and gradient/spacing fully tokenized.

### 4. Dark mode stability rating: **5/10**

- **Stable**: Class-based switch and token overrides for enrollment/contribution and theme.
- **Unstable**: Large amount of hex and fixed gradients in index.css and styles/tokens.css; unknown components not using tokens.

### 5. AI modularity rating: **4/10**

- **Modular**: Core AI API and flowRouter; bella/agents for scripted flows.
- **Not modular**: Single 3.5k-line screen, three voice implementations, and multiple intent/routing paths without one pipeline.

### 6. Scalability rating: **4/10**

- **Scalable**: Theme and enrollment step design; router and layout structure.
- **Not scalable**: Monolithic CSS and BellaScreen, duplicate tokens and components, full reload on enrollment Next, and no clear API or tenant strategy.

### 7. Refactor roadmap

**Phase 1 — Foundations (no UI behavior change)**  
- Consolidate tokens: single source (theme/tokens.css), remove or alias styles/tokens.css; document order.  
- Unify theme application: one place that sets class + root vars; reduce duplicate .dark blocks.  
- Add tenant/brand resolution at app bootstrap (e.g. from config or subdomain); pass brand into ThemeContext.  
- Extract voice into one service (STT entry point); keep existing call sites but delegate to service.

**Phase 2 — Structure and enrollment**  
- Break index.css into tokens + domain/component-scoped files; replace hex with variables.  
- Enrollment: switch Next to navigate(); remove window.location.href; fix state/scroll if needed.  
- Split BellaScreen: conversation UI, voice hook, flow orchestration (hooks + small components).  
- Single Button/Card/Input primitives and migrate at least auth and enrollment to them.

**Phase 3 — AI and scale**  
- Single AI client layer (message send, voice, flow handoff); align Bella and Core AI.  
- Deprecate or merge AgentController into one intent/routing pipeline.  
- Feature flags for AI and enrollment changes.  
- Consider store (e.g. Zustand) for theme or auth to reduce context re-renders; lazy routes and domain-based code splitting.

---

*End of audit. No code was rewritten; no refactors were performed. Recommendations are structural and prioritised for enterprise SaaS.*
