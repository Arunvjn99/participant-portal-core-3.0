# Pre-Enrollment Dashboard — UI Audit

**Scope:** `/dashboard` (PreEnrollment page) and all pre-enrollment UI components.  
**Focus:** Layout, visual hierarchy, design tokens, interactions, accessibility, responsiveness, and copy.

---

## 1. Page structure and layout

### 1.1 Entry and shell

| Item | Detail |
|------|--------|
| **Route** | `/dashboard` → `PreEnrollment` (`src/pages/dashboard/PreEnrollment.tsx`) |
| **Layout** | `DashboardLayout` with `header={<DashboardHeader />}` |
| **Content wrapper** | Plain `<div>`; no semantic wrapper or BEM class |

**Finding:** Global CSS defines `.pre-enrollment`, `.pre-enrollment__section`, `.pre-enrollment__resources`, `.pre-enrollment__stats` in `src/index.css`, but the PreEnrollment page does **not** use these classes. The main content is a bare `<div>` with no `pre-enrollment` class. Either use the existing BEM wrapper for consistency and future styling, or remove the unused CSS.

### 1.2 Section order and hierarchy

1. **Hero** — Greeting, hero title, subtitle, primary CTA (“Start My Enrollment”), secondary CTA (“Explore My Options”), time chip, floating cards (desktop) / projection card (mobile).
2. **Learning** — Section title, “View library” link, horizontal scroll of resource cards.
3. **Advisor** — Section title, two cards (Human Advisor, Core AI), booking flow modal.

**Finding:** Visual hierarchy is clear. Spacing is consistent (e.g. `py-8 sm:py-12 md:py-16 lg:py-20` on Learning and Advisor). Hero is the only section with a distinct background (`.pre-enrollment-hero-bg`, noise, gradient); Learning and Advisor sit on the default background with Advisor using `bg-[var(--color-surface)]` and a top border for separation.

---

## 2. Design tokens and consistency

### 2.1 Token usage

Pre-enrollment components use a mix of token families:

| Token / utility | Where used | Note |
|-----------------|------------|------|
| `--color-text`, `--color-textSecondary` | HeroSection (main), LearningSection, AdvisorSection, FloatingCards, AdvisorOptionCard, modals | Primary semantic tokens; correct. |
| `--text-primary`, `--text-secondary` | HeroSection **mobile fallback** only (lines 130–131) | Different family; theme defines them (e.g. in `tokens.css` / light/dark). Rest of Hero uses `--color-text` / `--color-textSecondary`. |
| `--surface-1` | HeroSection gradient fade, FloatingCards cards | Defined in theme; used for cards and hero fade. |
| `--surface-primary` | LearningSection card overlays (category badge, play icon bg) | Defined in theme; used with opacity. |
| `--color-surface`, `--color-border`, `--color-background`, `--color-background-secondary` | Buttons, cards, sections | Consistent. |
| `--brand-primary`, `--color-primary` | Hero gradient text, FloatingCards chart/brand accents | Consistent. |
| `brand-50`, `brand-100`, `brand-300`, `brand-600` (Tailwind) | AdvisorOptionCard hover, FloatingCards blur, contribution % | Assume Tailwind/theme extend; verify in theme config. |

**Recommendation:** In `HeroSection.tsx` mobile fallback (lines 130–131), replace `--text-primary` / `--text-secondary` with `--color-text` / `--color-textSecondary` so the hero uses one token family and stays consistent with theme overrides (e.g. dark mode) that may only map `--color-text`.

### 2.2 Hardcoded values

- **HeroSection:** Green status chip uses `bg-green-500/80` (not a semantic token). Consider a token like `--color-success` or a “status” token if the design system has one.
- **FloatingCards:** Chart and blur orbs use `var(--brand-primary)` and `var(--color-primary)`; no raw hex in pre-enrollment hero/cards.

---

## 3. Components — UI and behavior

### 3.1 HeroSection (`src/components/pre-enrollment/HeroSection.tsx`)

| Element | UI | Issue / note |
|--------|----|---------------|
| Status chip | “Enrollment Open” with pulse dot | Clear; green may not match tenant theme. |
| Greeting | Two lines: `greetingTitle` + user name | Uses `profile?.name \|\| "there"`. |
| Hero title | Part1 + gradient Part2 | Good hierarchy; gradient uses brand/primary. |
| Subtitle | Single paragraph | Readable; max-width and line-height OK. |
| Primary CTA | “Start My Enrollment” → opens PersonalizePlanModal | Works. |
| Secondary CTA | “Explore My Options” (Compass icon) | **No `onClick` or navigation.** Button does nothing. |
| Time chip | “Takes X minutes” below CTAs | Informative; doesn’t compete with primary CTA. |
| FloatingCards | Desktop (md+); motion cards | Visible from `md`; good. |
| Mobile fallback | Single card “$1.2M” + “Projected future value” | Replaces FloatingCards below `md`; token inconsistency noted above. |

**Recommendation:** Either wire “Explore My Options” to a real destination (e.g. scroll to Learning section, or a “Learn about your plan” route) or remove/repurpose the button so users don’t click a no-op.

### 3.2 LearningSection (`src/components/pre-enrollment/LearningSection.tsx`)

| Element | UI | Issue / note |
|--------|----|---------------|
| Section header | “Understand your retirement plan” + subtitle | Clear. |
| “View library” | Link-style button, `hidden sm:block` | **No `onClick` or `href`.** Not visible on small screens. |
| Resource cards | Horizontal scroll, 4 cards (from `RESOURCES`) | Cards have `cursor-pointer`, hover lift/shadow. **No click handler** — cards don’t navigate or open content. |
| Card content | Thumbnail, category, title, duration, play icon | Accessible labels via `alt={title}`. |

**Recommendation:** Either (1) make cards link to actual learning content (route or modal) and add keyboard support, or (2) remove `cursor-pointer` and treat as visual only until links exist. “View library” should link or scroll somewhere, or be hidden until the library exists.

### 3.3 AdvisorSection (`src/components/pre-enrollment/AdvisorSection.tsx`)

| Element | UI | Issue / note |
|--------|----|---------------|
| Section header | “How would you like guidance today?” + subtext | Centered; clear. |
| Human Advisor card | “View Availability” opens AdvisorBookingFlow; “Visit Advisor Portal” | **Secondary action is `onClick: () => {}`** — no-op. |
| AI card | “Start AI Chat” opens Core AI modal | Works when `coreAI` is available. |
| AdvisorOptionCard | Two-column grid on md+; equal height, borders | Layout and hover states (including `highlight` for AI card) are consistent. |

**Recommendation:** Wire “Visit Advisor Portal” / “Chat with AI advisor” to a real URL or in-app destination, or remove the secondary action if not yet available.

### 3.4 FloatingCards (`src/components/pre-enrollment/FloatingCards.tsx`)

| Element | UI | Issue / note |
|--------|----|---------------|
| Projection card | “At 65” value, “On track”, area chart | Uses Recharts; tooltip styled. |
| Smart recommendation chip | “Roth suggestion” copy | Small type; readable. |
| Contribution card | Slider 1–15%, “Employer match max” | **Range input has no `aria-label` or `aria-valuetext`.** |
| Blur orbs | Decorative | `aria-hidden`; fine. |

**Recommendation:** Add an accessible name for the contribution slider (e.g. `aria-label` and optional `aria-valuetext` with current %).

### 3.5 Skeletons

- **HeroSkeleton:** Placeholder blocks match general hero layout; no hero background.
- **LearningSkeleton:** Three card-shaped placeholders; matches horizontal card strip.
- **AdvisorSkeleton:** (Not read in full; assume it mirrors AdvisorSection.)

Skeletons use `animate-pulse` and `bg-[var(--color-border)]`; appropriate for loading state.

---

## 4. Accessibility

| Area | Status | Suggestion |
|------|--------|------------|
| **Focus** | Primary/secondary buttons use `focus:ring-2` and offset | Good. |
| **Hero CTAs** | Both are `<button>` with visible text; primary has ArrowRight icon | Consider `aria-label` on secondary if icon is treated as essential to meaning. |
| **Learning cards** | `cursor-pointer`, no role/link | Add `role="button"` or wrap in `<a>`/`<button>`, and ensure keyboard activatable; or remove pointer if non-interactive. |
| **FloatingCards range** | No `aria-label` | Add `aria-label` (e.g. “Contribution percentage”) and optionally `aria-valuetext`. |
| **Modal flows** | AdvisorBookingFlow / PersonalizePlanModal | Verify focus trap and return focus on close (not fully audited here). |
| **Section landmarks** | Hero, Learning, Advisor use `<section>` | Good. |
| **Headings** | Hero: h1, h2; Learning/Advisor: h2 | Hierarchy is logical. |

---

## 5. Responsiveness

| Breakpoint | Hero | Learning | Advisor |
|------------|------|----------|---------|
| Default | Single column; mobile fallback card | Horizontal scroll; “View library” hidden | Single column |
| sm | Same; “View library” visible | Same | Same |
| md | FloatingCards visible; two-column hero content possible | Same | Two-column grid |
| lg / xl | Full hero + floating cards; more padding | Same | Same |

**Findings:** Hero and Advisor use responsive typography and spacing. LearningSection cards use `w-max` and horizontal scroll with `scrollbar-hide`; consider a visible scroll hint (e.g. fade or “scroll” cue) on large screens if many cards. HeroSkeleton hides the right block below `lg` (`hidden lg:block`); matches Hero’s use of FloatingCards from `md` — confirm intent (skeleton could show a placeholder from `md` to match).

---

## 6. Copy and i18n

- **Keys:** Hero uses `dashboard.*` (e.g. `dashboard.greetingTitle`, `dashboard.startEnrollment`); Learning and Advisor use `preEnrollment.*` in `common.json`. Consistent per section.
- **AdvisorBookingModal:** One instance of hardcoded “Advisor” label (around line 222 in AdvisorBookingModal) instead of a translation key; should be i18n for consistency.
- **Learning resources:** Titles/categories/durations come from `preEnrollment.resource{id}*`; aligned with `RESOURCES` in constants.

---

## 7. Summary of recommended fixes

| Priority | Item | Action |
|----------|------|--------|
| High | Secondary CTA “Explore My Options” | Add navigation (e.g. scroll to Learning) or remove. |
| High | Learning cards | Add click target (route/modal) and keyboard support, or remove pointer style. |
| High | “View library” | Add `href`/`onClick` or hide until feature exists. |
| Medium | “Visit Advisor Portal” | Wire to URL or feature, or remove. |
| Medium | Hero mobile fallback | Use `--color-text` / `--color-textSecondary` instead of `--text-primary` / `--text-secondary`. |
| Medium | Contribution slider | Add `aria-label` (and optional `aria-valuetext`). |
| Low | Page wrapper | Use `className="pre-enrollment"` on main wrapper or remove unused `.pre-enrollment*` CSS. |
| Low | Status chip | Consider semantic token instead of `bg-green-500/80`. |
| Low | AdvisorBookingModal “Advisor” | Replace with i18n key. |

---

## 8. File reference

| File | Role |
|------|------|
| `src/pages/dashboard/PreEnrollment.tsx` | Page; DashboardLayout + Hero, Learning, Advisor (with skeletons) |
| `src/components/pre-enrollment/HeroSection.tsx` | Hero content, CTAs, PersonalizePlanModal trigger, FloatingCards / mobile card |
| `src/components/pre-enrollment/FloatingCards.tsx` | Projection card, recommendation chip, contribution slider |
| `src/components/pre-enrollment/LearningSection.tsx` | Learning header + horizontal resource cards |
| `src/components/pre-enrollment/AdvisorSection.tsx` | Advisor header + AdvisorOptionCards + AdvisorBookingFlow |
| `src/components/pre-enrollment/AdvisorOptionCard.tsx` | Reusable dual-option card (Human / AI) |
| `src/components/pre-enrollment/AdvisorBookingFlow.tsx` | Multi-step booking modal |
| `src/components/pre-enrollment/constants.ts` | ADVISORS, RESOURCES (and types) |
| `src/layouts/DashboardLayout.tsx` | Shell (header, main, footer) |
| `src/index.css` | `.pre-enrollment-hero-bg`, `.pre-enrollment-hero-noise`, `.pre-enrollment*`, `.elevation-*` |

This audit is analysis-only; no code changes were applied.
