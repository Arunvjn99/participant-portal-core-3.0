# Pre-Enrollment Dashboard Design Reference — Analysis

**Design reference:** `src/figma-dump/retireready-dashboard (1)/`  
**Purpose:** Extract UI structure for a new **PreEnrollmentDashboard** page and align with production dashboard, layout, and design system.  
**Production code:** `src/pages/dashboard`, `src/features`, `src/components/ui`, `src/layouts/DashboardLayout`.  
**No production code was modified.**

---

## 1. Layout hierarchy (design reference)

### Root structure (App.tsx)

```
div.min-h-screen.bg-gray-50/50
├── Navbar (sticky, border-b)
├── main.mx-auto.max-w-7xl.px-4.sm:px-6.lg:px-8.py-6
│   ├── Hero
│   └── div.mt-6.space-y-8
│       ├── InsightCards
│       ├── EnrollmentSteps
│       ├── LearningSection
│       ├── SupportSection
│       └── FAQSection
└── footer (brand, copyright, Privacy/Terms/Security)
```

- **Page background:** `bg-gray-50/50`, `font-sans`, `text-gray-900`.
- **Main container:** `max-w-7xl`, horizontal padding `px-4 sm:px-6 lg:px-8`, vertical `py-6`.
- **Section spacing:** Single wrapper with `space-y-8` (32px) between sections.
- **Navbar:** Sticky, full width; reference uses its own Navbar (logo, nav items, Start Enrollment, user). Production uses `DashboardLayout` + `DashboardHeader`, so the reference Navbar maps to production header, not a new global nav.

---

## 2. Section structure (by section)

### Hero

- **Layout:** CSS Grid `grid-cols-1 lg:grid-cols-12`, `gap-12`, `py-12`, `items-center`.
- **Left (lg:col-span-6):**
  - Badge: “Enrollment open until Oct 31” — `rounded-full`, `border-emerald-100`, `bg-emerald-50`, `text-emerald-700`, pill + dot.
  - Greeting: “Welcome back,” + first name — `text-xl` / `text-5xl sm:text-6xl font-bold text-gray-900`.
  - Subheadline: “Start building your retirement today.” — `text-2xl sm:text-3xl font-medium text-gray-400`.
  - Body: Short copy + “Enrollment takes about 4 minutes.” — `text-lg text-gray-600 max-w-xl`.
  - CTAs: Primary “Start Enrollment” (accent) + secondary “How the plan works” (outline), `flex-col sm:flex-row gap-4`.
  - Footnote: “Most employees complete enrollment in under 4 minutes.” with icon.
- **Right (lg:col-span-6):** Illustration area `h-[500px]` (reference uses Gemini-generated image; production can use placeholder or existing hero asset).
- **Motion:** Framer Motion for fade-up and scale; optional for production.

### InsightCards

- **Layout:** Grid `grid-cols-1 md:grid-cols-2 gap-6`.
- **Cards:** Two cards (Employer Match, Compound Growth).
- **Per card:**
  - `Card` (reference uses local `Card`, `CardHeader`, `CardContent`).
  - Header: icon in colored box (`bg-emerald-100` / `bg-blue-100`) + label (e.g. “Free Money”, “Compound Growth”) + `CardTitle` + `CardDescription`.
  - Content: Charts (Recharts BarChart) + short copy and numbers (e.g. “+$2,500”, “Potential free money…”).
- **Interaction:** `hover:shadow-md transition-shadow`.
- **Motion:** `whileInView` fade-up, `viewport={{ once: true }}`.

### EnrollmentSteps

- **Layout:** Section with title row + horizontal step strip + footnote.
- **Title row:** “Enrollment takes 4 quick steps” (`text-2xl font-bold`) + “Approx. 4 minutes” (`text-sm text-gray-500`), `justify-between`.
- **Steps:** Grid `grid-cols-1 md:grid-cols-4 gap-4`; connecting line `absolute top-1/2 h-0.5 bg-gray-200` (desktop only).
- **Per step:** White card `rounded-xl border border-gray-200 shadow-sm`, icon circle (emerald when “current”, gray when “upcoming”), title + short description, optional “Start” pill on current step (mobile).
- **States:** `current` (emerald-600 icon, “Start” badge) vs `upcoming` (gray-100 icon, hover emerald-50).
- **Footnote:** “You can change these settings anytime later.” with CheckCircle2 icon, centered.

### LearningSection

- **Layout:** Single full-width card (no grid).
- **Card:** Dark gradient `from-gray-900 to-gray-800`, `text-white`, decorative blur circle top-right.
- **Content:** “Featured Guide” pill, heading “Understanding your retirement plan”, body copy, CTA “Explore Learning Center” (outline, light on dark).
- **Structure:** `flex flex-col md:flex-row` with `justify-between`, `gap-8`, `p-8`.

### SupportSection

- **Layout:** Section title + grid `grid-cols-1 md:grid-cols-2 gap-6`.
- **Title:** “Need help deciding?” (`text-2xl font-bold`).
- **Cards:** Two cards — AI Assistant (purple left border), Retirement Specialist (blue left border).
- **Per card:** Icon in tinted box (`bg-purple-50` / `bg-blue-50`), title, description, button (“Ask AI Assistant” / “Schedule Call” with icon).
- **Pattern:** `border-l-4 border-l-{color}`, `CardContent p-6 flex items-start gap-4`.

### FAQSection

- **Layout:** `max-w-3xl mx-auto`, centered heading + list.
- **Header:** “Frequently asked questions” + “Everything you need to know about enrollment” (`text-center mb-6`).
- **Items:** Accordion-style; each item is `border border-gray-200 rounded-xl bg-white`; button row (question + ChevronDown/Up), expandable answer with `border-t border-gray-100`, motion for height/opacity.
- **Interaction:** Single open index (openIndex state), AnimatePresence for expand/collapse.

---

## 3. Card patterns (design reference)

| Pattern | Usage | Structure |
|--------|--------|-----------|
| **Insight card** | InsightCards | Card > CardHeader (icon + label + CardTitle + CardDescription) + CardContent (chart + copy). |
| **Step card** | EnrollmentSteps | Not reference Card component; custom `bg-white p-4 rounded-xl border shadow-sm` with icon circle + title + description. |
| **Feature card (dark)** | LearningSection | Card with gradient, CardContent only; pill + heading + body + CTA. |
| **Support card** | SupportSection | Card with `border-l-4`; CardContent with icon box + title + description + Button. |
| **FAQ item** | FAQSection | Custom bordered div, button + AnimatePresence content. |

Reference `Card` (ui/Card.tsx): `rounded-2xl border border-border bg-surface shadow-sm`; subcomponents use `p-6`, `space-y-1.5`, `text-lg font-semibold`, `text-sm text-gray-500`.

---

## 4. Typography hierarchy

| Role | Reference classes | Notes |
|------|-------------------|--------|
| Page title (hero name) | `text-5xl sm:text-6xl font-bold tracking-tight text-gray-900` | Hero primary |
| Hero subheadline | `text-2xl sm:text-3xl font-medium text-gray-400` | Hero secondary |
| Section heading | `text-2xl font-bold text-gray-900` | e.g. EnrollmentSteps, SupportSection, FAQSection |
| Card title | `text-lg font-semibold` (CardTitle) or `font-semibold text-lg text-gray-900` | Cards |
| Body / description | `text-lg text-gray-600`, `text-base`, `text-sm text-gray-500` | CardDescription, body copy |
| Labels / badges | `text-sm font-semibold uppercase tracking-wide`, `text-xs font-bold uppercase` | Pills, step labels |
| Supporting | `text-sm text-gray-400`, `text-gray-500` | Footnotes, captions |

Reference uses Inter via `@theme` (`--font-sans: "Inter"`). Production uses theme tokens (e.g. `--color-text`, `--color-textSecondary`); same hierarchy can be expressed with tokens.

---

## 5. Grid usage

- **Main content:** Single column; max width `max-w-7xl` (same as production DashboardLayout main).
- **Hero:** 12-column grid on lg; 6+6 split.
- **InsightCards:** 2 columns on md, 1 on small.
- **EnrollmentSteps:** 4 columns on md, 1 on small.
- **SupportSection:** 2 columns on md, 1 on small.
- **FAQSection:** Single column, `max-w-3xl` for readability.

Gaps: `gap-4`, `gap-6`, `gap-8`, `gap-12` (16–48px). Production already uses `gap-4` / `gap-6` in layout; same scale can be used.

---

## 6. Spacing patterns

| Context | Reference | Production alignment |
|---------|-----------|----------------------|
| Main vertical | `py-6` | DashboardLayout uses `py-6 pb-24 md:py-8` |
| Main horizontal | `px-4 sm:px-6 lg:px-8` | Same in DashboardLayout |
| Between sections | `space-y-8` (32px) | Can use `gap-6`/`gap-8` in a flex column |
| Section internal | `gap-4`, `gap-6`, `gap-8`, `p-4`–`p-8` | Map to --spacing-* where useful |
| Card padding | `p-6`, `p-8` | Production card uses `py-4 sm:py-6` and padding utilities |

---

## 7. Interaction elements

- **Buttons:** Reference `Button` variants: `default`, `accent` (emerald), `outline`, `secondary`, `ghost`, `link`; sizes `default`, `sm`, `lg`, `icon`. Primary CTA “Start Enrollment” uses `variant="accent"` (emerald).
- **Links:** Footer “Privacy”, “Terms”, “Security” — `hover:text-gray-900`.
- **Nav:** Nav items as buttons; “Start Enrollment” in header and mobile menu.
- **FAQ:** Accordion button (full width, flex justify-between), no separate link styling.
- **Step cards:** Clickable (cursor-pointer, hover border change); no explicit link/button in reference.

Production already has `src/components/ui/Button.tsx` and other primitives; reference patterns can be implemented with existing Button + optional new variants (e.g. accent) or tokens.

---

## 8. Sections as reusable components

Recommended mapping for a **PreEnrollmentDashboard** page:

| Reference section | Reusable component (suggested) | Location (suggested) | Notes |
|-------------------|--------------------------------|------------------------|------|
| Hero | PreEnrollmentHero or extend HeroSection | `src/components/pre-enrollment/` | Align with existing HeroSection; optional 2-column grid + badge + dual CTA. |
| InsightCards | InsightCards or EmployerMatchCard + GrowthImpactCard | `src/components/pre-enrollment/` or `src/components/dashboard/` | Reusable cards with optional chart; data-driven (match %, growth data). |
| EnrollmentSteps | EnrollmentStepsStrip or reuse EnrollmentStepper concept | `src/components/pre-enrollment/` | Reusable step strip (4 steps, status, connector line); can back with same step config as enrollment flow. |
| LearningSection | LearningBanner or LearningSection (rename if exists) | `src/components/pre-enrollment/` | Single dark CTA card; production already has LearningSection — align naming and layout. |
| SupportSection | SupportSection or AdvisorSupportCards | `src/components/pre-enrollment/` | Two cards (AI + Human); production has AdvisorSection — can merge or coexist. |
| FAQSection | FAQSection or FAQAccordion | `src/components/pre-enrollment/` or `src/components/ui/` | Reusable accordion; data-driven (array of { question, answer }). |

Navbar in the reference is a full app nav; production uses DashboardLayout + DashboardHeader. So “Navbar” does not become a new reusable section; the PreEnrollmentDashboard page should use DashboardLayout + header and render the sections above inside the existing main area.

---

## 9. Reuse of existing design system components

| Element | Reference | Production component / token | Reuse |
|---------|-----------|-----------------------------|--------|
| Card container | Card, CardHeader, CardTitle, CardDescription, CardContent | `src/components/ui/card.tsx` (Card, CardHeader, CardTitle, CardDescription, CardContent) | Use production Card; map reference’s `border`, `rounded-2xl` to production’s `rounded-xl` and border tokens. |
| Buttons | Button (accent, outline, secondary, lg) | `src/components/ui/Button.tsx` (or shared Button) | Use production Button; add or map “accent” (emerald) to brand primary or a new variant. |
| Section wrapper | Section + title row | `src/components/dashboard/DashboardSection.tsx` (title + action + children) | Use DashboardSection for any section that has a title and optional action. |
| Layout container | main max-w-7xl px-* py-* | DashboardLayout’s main (`max-w-7xl`, padding) | No new layout; PreEnrollmentDashboard lives inside existing layout. |
| Typography | Tailwind text-* font-* | Theme tokens (--color-text, --color-textSecondary, etc.) | Prefer tokens for color and size where possible. |
| Icons | lucide-react | Same in production | Keep using lucide-react. |
| Motion | motion/react (Framer Motion) | Production uses framer-motion | Use same library; reference uses `motion` from `motion/react` — align import with project. |

Reference uses a local `Card` with `border-border`, `bg-surface`, `text-primary`; production card uses `bg-surface-secondary`, `border-border-subtle`, `text-foreground-primary`. These are close; prefer production tokens and class names for new PreEnrollmentDashboard components.

---

## 10. Styles to convert to enrollment / theme tokens

Recommended token mapping so the reference look can be expressed with the existing design system and enrollment theming:

| Reference style | Token / variable (suggested) | Notes |
|-----------------|------------------------------|--------|
| `bg-gray-50/50`, `bg-gray-100` | `--color-background`, `var(--color-background)` or `--surface-2` | Page and neutral backgrounds. |
| `text-gray-900` | `--color-text`, `--text-primary` | Primary text. |
| `text-gray-600`, `text-gray-500`, `text-gray-400` | `--color-textSecondary`, `--text-secondary` | Secondary and muted. |
| `border-gray-200`, `border-gray-100` | `--color-border`, `--border-subtle` | Card and divider borders. |
| `bg-emerald-50`, `text-emerald-700`, `bg-emerald-600` | `--success` or enrollment accent; e.g. `--enroll-brand` or `--brand-success` | Badge, primary CTA, “current” step. |
| `bg-blue-100`, `text-blue-600` | `--brand-primary` or `--color-primary` (if blue) | Secondary accent (e.g. growth card). |
| `bg-purple-50`, `border-purple-500` | Optional `--color-ai` or keep Tailwind for one-off (AI card). | SupportSection AI card. |
| `rounded-xl`, `rounded-2xl` | `--radius-xl`, `--radius-2xl` | Card and step radius. |
| `shadow-sm`, `hover:shadow-md` | Existing shadow utilities or `--shadow-*` | Cards. |
| `font-sans`, Inter | Already in tokens / Tailwind | No change. |
| Section title `text-2xl font-bold` | Use token for “section title” if defined; else keep utility with token color | Consistency with other dashboard sections. |

Enrollment-specific screens already use `--enroll-*` (e.g. `--enroll-brand`, `--enroll-card-bg`). For PreEnrollmentDashboard, reuse `--color-*` and `--surface-*` first; use `--enroll-*` only where the page is explicitly part of the enrollment flow (e.g. “Start Enrollment” CTA) so light/dark and brand stay consistent.

---

## 11. Summary

- **Layout:** Single-column main, `max-w-7xl`, same horizontal/vertical padding as production DashboardLayout. Sections stacked with consistent vertical gap (e.g. `space-y-8`).
- **Sections:** Hero (2-column on lg) → InsightCards (2-col grid) → EnrollmentSteps (4-col strip) → LearningSection (full-width dark card) → SupportSection (2-col cards) → FAQSection (centered accordion).
- **Reusable components:** PreEnrollmentHero (or extend HeroSection), InsightCards (or split into EmployerMatch + GrowthImpact), EnrollmentStepsStrip, LearningBanner, SupportSection (or AdvisorSupportCards), FAQSection/FAQAccordion. Navbar stays as “reference only”; production keeps DashboardLayout + DashboardHeader.
- **Design system:** Use production Card, Button, DashboardSection; prefer theme tokens for colors, borders, radius, spacing; add or map “accent” (emerald) for primary CTA; keep lucide-react and align Framer Motion usage.
- **Tokens:** Map grays to `--color-background`, `--color-text`, `--color-textSecondary`, `--color-border`; emerald to success/enrollment accent; blues to brand primary where appropriate; use `--radius-*` and spacing vars for new PreEnrollmentDashboard components.

This gives a clear blueprint for implementing PreEnrollmentDashboard without changing existing production code.
