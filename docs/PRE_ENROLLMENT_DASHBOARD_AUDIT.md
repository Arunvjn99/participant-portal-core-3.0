# Pre-Enrollment Dashboard — UI & Routing Audit

## STEP 1 — Audit Findings

### Global Header
- **File:** `src/components/dashboard/DashboardHeader.tsx`
- **Usage:** Passed as `header={<DashboardHeader />}` to `DashboardLayout` from PreEnrollment, DemoDashboard, EnrollmentManagement, etc.
- **Layout:** `DashboardLayout` (`src/layouts/DashboardLayout.tsx`) renders `header` in a sticky bar; main content below.

### Logo rendering
- **Location:** DashboardHeader.tsx lines 143–163.
- **Logic:** When `isAuthenticated`, left section shows:
  1. Tenant logo: `currentColors?.logo` from `useTheme()` → `<img src={tenantLogo} alt="Company Logo" className="h-8 w-auto max-w-[160px] object-contain" />`
  2. Pipe separator: `<span className="text-[var(--color-border)]">|</span>`
  3. CORE logo: `<img src="/image/core-logo.png" alt="CORE" className="h-8 w-auto object-contain" />`
- **No fallback** when tenant logo is missing (all three are inside one conditional).

### Navigation configuration
- **Location:** DashboardHeader.tsx; `getNavLinks(isDemoMode)` returns array of `{ to, labelKey }`.
- **Current order:** Dashboard → Enrollment → Profile → Transactions → Investment Portfolio.
- **Current keys:** `nav.dashboard`, `nav.enrollment`, `nav.profile`, `nav.transactions`, `nav.investmentPortfolio`.
- **Active state:** `isActive(to)` handles `/dashboard`, `/demo`, `/enrollment`, `/transactions`, `/dashboard/investment-portfolio`, `/profile`.

### Language switcher
- **Component:** `src/components/common/LanguageSwitcher.tsx`
- **Config:** `SUPPORTED_LANGS` from `src/constants/locales.ts` (en, es, fr, ta, zh, ja, de, hi).
- **i18n:** `src/i18n.ts` — `resources` and `supportedLngs` include all 8 languages; `normalizeLng` and `normalizeLanguage` use these lists.

### Notification icon
- **Location:** DashboardHeader.tsx lines 210–217.
- **Implementation:** `<button>` with `BellIcon`, `aria-label={t("nav.notifications")}`, red dot badge; `hidden lg:flex`. No click handler; no panel.

### Hero section greeting & CTA
- **Component:** `src/components/pre-enrollment/HeroSection.tsx`
- **Greeting:** Single line `t("dashboard.greeting", { name: displayName })` in an `h2` (e.g. "Good Morning, Rose").
- **Title:** `heroTitlePart1` + `heroTitlePart2` (gradient) in `h1`.
- **Primary CTA:** Button "Start My Enrollment" (`dashboard.startEnrollment`) opens PersonalizePlanModal.
- **Secondary CTA:** Button "Explore My Options" (`dashboard.exploreOptions`); no navigation, outline style.
- **User name:** `profile?.name || "there"` from `useUser()`.

### i18n config
- **Main:** `src/i18n.ts` — resources from `locales/{en,es,fr,ta,zh,ja,de,hi}/common.json`; `supportedLngs` = all 8.
- **Labels:** `src/constants/locales.ts` — `SUPPORTED_LANGS` with `code` and `labelKey` (e.g. `common.english`).
- **Dashboard keys:** `locales/en/common.json` under `dashboard` (greeting, startEnrollment, exploreOptions, etc.); `locales/en/dashboard.json` has overlapping keys.

### Route order (router)
- **File:** `src/app/router.tsx` — `createBrowserRouter` with RootLayout; `/dashboard` → PreEnrollment; `/profile`, `/enrollment`, `/dashboard/investment-portfolio`, etc. Order of route definitions does not affect nav order; nav order is defined in DashboardHeader `getNavLinks`.

### CTA component
- Hero CTAs are inline in HeroSection (motion.button), not a shared CTA component. Primary uses `bg-primary`, secondary uses `border-2 border-[var(--color-border)]`.

---

## Implementation Summary

### 1. Global header brand
- **Option A applied:** CORE logo and pipe removed. Only client (tenant) logo shown; fallback "Dashboard" text when no tenant logo. File: `DashboardHeader.tsx`.

### 2. Language switcher
- **Restricted to English + Spanish.** `constants/locales.ts`: `SUPPORTED_LANGS` = en, es only. `i18n.ts`: `resources` and `supportedLngs` = en, es only. Other locale files no longer loaded; existing en/es translations unchanged. Dropdown and i18n routing still work.

### 3. Notification panel
- **New:** `src/components/dashboard/NotificationPanel.tsx` — right-side slide-over, portal-rendered, 360px width, 200ms ease, close on backdrop click and ESC, focus trap. Header bell button opens it; default empty state "You're all caught up."

### 4. Navigation
- **Order:** Dashboard → Retirement Plan (enrollment) → Transactions → Investment Portfolio → Account (profile).
- **Labels:** New keys `nav.retirementPlan` ("Retirement Plan"), `nav.account` ("Account"). User dropdown Profile link shows "Account". Routes unchanged (`/enrollment`, `/profile`).

### 5. Hero greeting
- **Layout:** Line 1 (small): time-based greeting only. Line 2 (large): full user name. Then hero title (Part1 + Part2), subtitle, CTAs.
- **Time-based greeting:** Keys `dashboard.greetingMorning`, `greetingAfternoon`, `greetingEvening`, `greetingWelcomeBack`. Logic: 5–12 Morning, 12–17 Afternoon, 17–21 Evening, else Welcome Back. No external libs.

### 6. Time chip
- **Under primary CTA:** Chip with clock icon + "Takes 3 minutes" (`dashboard.takesMinutes`). Rounded-full, small text, soft neutral background, does not compete with CTA.

### 7. Secondary CTA
- **Label:** "Explore My Options" → "Learn about your plan" (`dashboard.exploreOptions`) in en and es (common + dashboard.json where used).

### Edge cases
- No tenant logo: header shows "Dashboard" text so layout doesn’t collapse.
- User with no profile name: "there" fallback kept.
- Language previously set to fr/ta/zh/ja/de/hi: `normalizeLng` falls back to "en" (no longer in supportedLngs).
- Notification panel: body scroll locked when open; focus restored on close.
