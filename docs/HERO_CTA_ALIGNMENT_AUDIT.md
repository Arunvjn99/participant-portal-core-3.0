# Hero CTA Group — Alignment Audit

## STEP 1 — Button structure (before fix)

### Primary button
| Property | Value |
|----------|--------|
| **Wrapper** | Inside `<div class="flex flex-col items-start">` with chip below |
| **Height** | `min-h-[44px] sm:min-h-[48px]` (no explicit h-) |
| **Vertical padding** | `py-3 sm:py-3.5` |
| **Border** | None (filled) |
| **Font** | `text-sm font-semibold` |
| **Display** | `inline-flex` |
| **Alignment** | `items-center justify-center gap-2` |
| **Radius** | `rounded-2xl` |
| **Icon** | ArrowRight size={18}, no translate-y |

### Secondary button
| Property | Value |
|----------|--------|
| **Wrapper** | Direct child of CTA group div |
| **Height** | `min-h-[44px] sm:min-h-[48px]` |
| **Vertical padding** | `py-3 sm:px-7 sm:py-3.5` |
| **Border** | `border-2` (included in box-sizing) |
| **Font** | `text-sm font-semibold` |
| **Display** | `inline-flex` |
| **Alignment** | `items-center justify-center gap-2` |
| **Radius** | `rounded-2xl` |
| **Icon** | Compass size={18} |

### Parent container
| Property | Value |
|----------|--------|
| **Display** | `flex flex-col sm:flex-row` |
| **Cross-axis** | `sm:items-end` ← **cause of misalignment** |
| **Gap** | `gap-3 sm:gap-4` |

**Root cause:** With `sm:items-end`, the flex items are (1) the column [primary + chip] and (2) the secondary button. Their *bottom* edges align, so the chip pushes the primary column taller and the primary button sits higher than the secondary. Fix: align by *top* (`sm:items-start`) so both buttons share the same top edge; with identical height they then share the same baseline.

### Chip
- Renders inside first column, below primary button; `mt-2`. Not inside either button. Correct structure; chip does not need to affect second column.

---

## Changes applied (structural fix)

1. **Parent:** `sm:items-end` → `sm:items-start` so both flex items align by top; both buttons share the same top edge and, with identical height, the same bottom edge.
2. **Height:** Both buttons use explicit `h-11 sm:h-12` (44px / 48px) instead of `min-h-*` so height is identical.
3. **Vertical padding:** `py-0` on both; vertical centering from `items-center` inside the fixed height. Same effective padding via `px-6`, `gap-2`.
4. **Leading:** Both `leading-none` for consistent line-height.
5. **Icons:** Both `size={18}`, `shrink-0` so they don’t affect layout; no translate-y.
6. **Secondary:** `box-border` so `border-2` is inside the height and doesn’t add to it.
7. **Chip:** Unchanged; still below primary only, outside both buttons; first column has `w-full sm:w-auto` so stacking is unchanged.
