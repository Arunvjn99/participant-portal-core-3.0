# Design System — Participant Portal (Enrollment)

## Product context

- **Product**: US retirement (401k) participant portal; enrollment flow after plan selection.
- **Key pages**: Choose Plan → Contribution → **Future contributions (Auto Increase)** → Investments → Review.
- **Auto Increase step**: Decision moment after the user sets contribution %. Goal: persuade users to enable 1% annual auto increase by showing financial impact. This is **not** a settings page — it is a conversion-focused decision screen.

## Branding & styling (enrollment)

- **Colors**: Use CSS variables only. Primary palette from `src/theme/tokens.css`:
  - `--enroll-bg`, `--enroll-card-bg`, `--enroll-card-border`, `--enroll-soft-bg`
  - `--enroll-brand`, `--enroll-brand-rgb`, `--enroll-accent`, `--enroll-accent-rgb`
  - `--enroll-text-primary`, `--enroll-text-secondary`, `--enroll-text-muted`
- **Surfaces**: `--enroll-card-radius` (16px), `--enroll-elevation-1`, `--enroll-elevation-2`, `--enroll-elevation-3`
- **Spacing**: 8px grid. Use `--spacing-*` (4, 8, 12, 16, 24, 32, 40, 48px) and Tailwind rhythm (e.g. gap-4, p-6, mb-8).
- **Typography**: Clean hierarchy; no decorative or serif fonts. Prefer system-ui / Avenir / Outfit (see tailwind.config.js). Strong heading scale (e.g. 2xl–4xl for hero headline, 10px uppercase labels, 18px+ for key numbers).
- **Borders**: Subtle; use `--enroll-card-border` or `var(--enroll-soft-bg)` for separation.

## Motion & interaction

- Subtle hover: lift (`translateY(-2px)`), slightly stronger shadow.
- Buttons: primary = brand fill; secondary = border + transparent. Trust line small and muted.
- No flashy animations; calm, professional.

## Layout conventions

- **Enrollment step**: Max width 7xl, horizontal padding 24–48px. Header (stepper optional) then content. Footer: Back | Save & Exit + Continue.
- **Desktop-first**: Layouts should be responsive-friendly (grid, flex, breakpoints) with accessible contrast.

## Premium Auto Increase (design direction for this step)

- **Style**: Premium fintech UI; modern SaaS; soft depth and layered surfaces; calm but confident palette; emotional but professional; clean typography; **subtle gradients only in hero section**; strong visual hierarchy; conversion-focused.
- **Hero**: Large hero card at top. Left: small label (“BOOST YOUR FUTURE”), strong headline with delta amount, subtext, “with / without” projection and highlighted delta badge. Right: primary CTA “Enable Auto Increase”, secondary “Skip for now”, trust line “You can change or cancel anytime.” Hero uses soft brand gradient background and elevated surface.
- **Comparison cards**: Three cards below hero — Current Projection (muted), With Auto Increase (slight emphasis), Additional Savings (most emphasized, accent background). Depth and clear hierarchy; not flat.
- **Growth visualization**: Line chart with two lines (without / with auto increase), clean legend, minimal grid, soft gradient fill under “with auto increase” line.
- **Reinforcement**: Short line e.g. “Most participants increase contributions by 1% annually” with small icon.
- **Skip modal**: When user clicks “Skip for now” — title “Before you skip…”, body about missing estimated $X, primary “Enable Auto Increase”, secondary “Skip Anyway”. Clean, professional, not aggressive.
- **Constraints**: No flashy gradients outside hero; no neon colors; accessible contrast; premium financial brand feel; 8px grid; strong typographic hierarchy.

## Fidelity rule for iterations

All design variations must use **only** the fonts, colors, spacing, and component styles defined in this design system and in `src/theme/tokens.css`. Do not introduce new fonts, neon colors, or unrelated visual styles.
