# Pre-Enrollment Hero — Typography & CTA Audit

## STEP 1 — Current typography scale

| Element | Current Tailwind | Approx. sizes | Responsive breakpoints |
|--------|-------------------|---------------|-------------------------|
| **Greeting** | `text-sm sm:text-base` | 14px → 16px | base, sm |
| **User name (h1)** | `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl` | 30→36→48→60→72px | 5 steps |
| **Hero headline (h2)** | `text-xl md:text-2xl` | 20px → 24px | base, md |

**Issue:** Name is the largest; headline is much smaller. Desired order: greeting (smallest) → name (medium) → headline (largest).

**Spacing:** Greeting `mb-1`, name `mb-4 sm:mb-6`, headline `mb-3`, subtitle `mb-6 sm:mb-8 md:mb-10`.

## CTA audit (before)

| Property | Primary | Secondary |
|----------|---------|-----------|
| Padding | `px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4` | Same |
| Font | `text-sm sm:text-base font-semibold` | Same |
| Radius | `rounded-2xl` | Same |
| Height | Implicit from py | Same |

Primary and secondary already match; we will standardize with a shared base and ensure stacked heights.

## Chip

- `mt-0.5` (2px) — increase to 8–12px (`mt-2` or `mt-3`).
- `text-xs` — keep (smaller than button).
- Align under primary left edge — already in `flex flex-col items-start`.

---

## After implementation

### Old vs new font sizes

| Element | Old | New |
|---------|-----|-----|
| **Greeting** | text-sm → text-base (14→16px) | text-xs → text-sm (12→14px) — smallest |
| **User name** | text-3xl→7xl (30→72px) | text-xl→4xl (20→36px) — ~25–30% reduction, medium |
| **Hero headline** | text-xl→2xl (20→24px) | text-2xl→6xl (24→60px) — largest, dominant |

### CTA adjustments

- **Shared:** `min-h-[44px] sm:min-h-[48px]`, `px-6 py-3 sm:px-7 sm:py-3.5`, `text-sm`, `rounded-2xl`. Primary = filled; secondary = outlined. Same height when stacked on mobile.
- **Alignment:** Container uses `sm:items-end` so chip under primary doesn’t misalign baseline with secondary button.
- **Chip:** `mt-2` (8px), `text-xs`, `py-1.5`; left-aligned under primary.

### Responsive

- Long names: `break-words` on name; no overflow.
- CTAs: `flex-col` on default, `sm:flex-row`; equal min-height when stacked.
- Typography scales at sm/md/lg/xl without layout shift; spacing rhythm kept (mb-2, mb-3/mb-4, mb-4/mb-6).
