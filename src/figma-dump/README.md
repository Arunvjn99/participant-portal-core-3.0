# Figma Dump — Raw Figma Make Output (Reference Only)

## Purpose

This folder stores **raw Figma Make output** for visual and structural reference during integration. It is part of the safe Figma-to-production integration workflow for the Retirement Participant Portal.

## Critical Rules

1. **Code in this folder must NEVER be imported directly** into production routes, components, or bundles. Treat it as read-only reference material.

2. **Visual reference only.** Use it to understand layout, copy, and component structure—then reimplement in production using the app’s design system and tokens.

3. **Production code must use design-system components.** All new or updated screens must use existing primitives (e.g. from `src/components/ui`) and layout wrappers (`DashboardLayout`, `EnrollmentLayout`). Do not copy Figma components into `src/components` or `src/pages`.

4. **All colors must map to existing CSS variables.** Use `var(--color-*)`, `var(--enroll-*)`, `var(--txn-*)`, etc. No hex, no `rgb()`/`rgba()` in production UI.

5. **No hardcoded gradients allowed.** Use token-based gradients (e.g. `var(--banner-gradient)`, `var(--contrib-*)`) or theme-driven variables. Do not paste Figma gradient definitions into production CSS or inline styles.

## Workflow

1. Export or paste Figma Make output **into this folder only** (e.g. a subfolder per screen or export).
2. Read `INTEGRATION_RULES.md` in this folder before translating any screen.
3. Implement production screens in the correct module (`src/pages/*`, `src/features/*`) using existing components and tokens.
4. Do not move or refactor production files to satisfy Figma structure; map Figma to existing architecture.

## What This Folder Is Not

- **Not** a source for copy-paste into `src/components` or `src/pages`.
- **Not** part of the build or test bundle (ensure build/tests ignore or exclude it if desired).
- **Not** a replacement for the design system; the app’s theme, tokens, and UI primitives remain the single source of truth.

## See Also

- `INTEGRATION_RULES.md` — Translation rules when turning Figma screens into production code.
- `docs/FULL_ARCHITECTURE_AUDIT.md` — Architecture, token layers, and layout roots.
