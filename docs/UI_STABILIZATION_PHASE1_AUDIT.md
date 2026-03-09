# Phase 1 — Full Hardcoded Audit Report

**Scope:** ChoosePlan page, PlanCard, Help section (HelpSectionCard), Stepper (EnrollmentHeaderWithStepper + EnrollmentStepper), Footer (EnrollmentFooter), SectionHeadingWithAccent, EnrollmentPageContent.

**No changes made.** Audit only.

---

## 1. COLORS (hex / rgb / rgba)

### ChoosePlan.tsx
| Location | Value | Usage |
|----------|--------|--------|
| Icon TrendingUp | `#2b7fff` | text color (Roth) |
| Icon Shield | `#9810fa` | text color (Traditional) |
| Icon Sparkles | `#155dfc` | text color (Help card) |
| Inline style | `paddingBottom: 40` | spacing |

### PlanCard.tsx
| Location | Value | Usage |
|----------|--------|--------|
| CARD_RADIUS | `16` | borderRadius (px) |
| CARD_PADDING | `26` | padding (px) |
| focus-visible ring | `#155dfc` | focus ring |
| hover border | `#155dfc/40` | unselected hover |
| borderColor | `#155dfc` \| `#e5e7eb` | card border |
| background | `linear-gradient(167.2deg, rgb(255,255,255)... rgba(249,250,251,0.3))` | card bg |
| Badge | `top: -12`, `height: 30` | px |
| Badge | `linear-gradient(90deg, #155dfc 0%, #1447e6 100%)` | badge bg |
| Badge | `0px 10px 15px -3px rgba(0,0,0,0.1)...` | boxShadow |
| Badge text | `fontSize: 12`, `text-white` | typography |
| Icon wrap | `rgb(239, 246, 255)`, `rgb(219, 234, 254)` (selected) | bg |
| Icon wrap | `rgb(250, 245, 255)`, `rgb(243, 232, 255)` (unselected) | bg |
| Title | `fontSize: 24`, `#101828` | typography |
| Description | `fontSize: 14`, `#4a5565` | typography |
| Ask AI button | `#bedbff`, `#1447e6`, gradient bg | border, color, bg |
| Ask AI hover | `#93c5fd` | border |
| Selected pill | `#dcfce7`, `#d0fae5`, `#00a63e`, `#008236` | bg, border, color |
| Select pill | `#eceef2`, `#030213` | bg, color |
| Benefits col | `#e5e7eb` | border |
| Key benefits heading | `fontSize: 14`, `#101828` | typography |
| ListChecks icon | `#008236` | color |
| Benefit item | `#e5e7eb`, `rgb(249,250,251)`, `rgb(248,250,252)` | border, bg |
| Benefit text | `fontSize: 14`, `#364153` | typography |
| Grid | `380px`, `gap-6`, `pl-[25px]`, `h-12`, `rounded-[14px]`, `mt-3`, `mt-6`, `gap-3`, `h-9`, `rounded-lg`, `px-4`, `mb-4`, `gap-2`, `h-[38px]`, `rounded-[10px]`, `px-[13px]` | layout/radius/spacing |

### HelpSectionCard.tsx
| Location | Value | Usage |
|----------|--------|--------|
| border | `#e5e7eb` | borderColor |
| background | `linear-gradient(171.35deg, rgb(248, 250, 252) 0%, rgb(239, 246, 255) 100%)` | bg |
| padding | `p-[33px]` | 33px |
| gap | `gap-6` | 24px |
| Icon container | `h-12 w-12`, `rounded-[14px]`, `#dbeafe` | size, radius, bg |
| Title | `fontSize: 24`, `#101828` | typography |
| Description | `fontSize: 16`, `#4a5565` | typography |
| Button | `#eceef2`, `#030213`, `fontSize: 14` | bg, color, typography |
| Button hover | `#d4d6dc` | bg |
| rounded-3xl | 24px | radius |

### SectionHeadingWithAccent.tsx
| Location | Value | Usage |
|----------|--------|--------|
| TITLE_GRADIENT | `linear-gradient(90deg, rgb(21, 93, 252) 0%, rgb(152, 16, 250) 100%)` | title bg |
| ACCENT_GRADIENT | `linear-gradient(180deg, rgb(21, 93, 252) 0%, rgb(152, 16, 250) 100%)` | accent bar |
| left | `-16` | px |
| height | `64` | px |
| fontSize | `36`, `18` | typography |
| leading | `40px`, `7` (28px) | typography |
| tracking | `0.37px`, `-0.44px` | typography |
| Subtitle | `var(--color-text-secondary)` | already token |

### EnrollmentFooter.tsx
| Location | Value | Usage |
|----------|--------|--------|
| style | `pointerEvents: "none", opacity: 0.6` | disabled primary link |

### EnrollmentHeaderWithStepper.tsx
| Location | Value | Usage |
|----------|--------|--------|
| py-3 | 12px | spacing |
| max-width | 600px (media query) | breakpoint |
| 1024px | media query | breakpoint |

### EnrollmentStepper.tsx
| Location | Value | Usage |
|----------|--------|--------|
| text-sm | 14px | typography |
| w-8 h-8 | 32px | size |
| size={14} | icon | px |
| max-w-4xl | 896px | layout |
| mx-2 sm:mx-4 | spacing | px |
| Uses | var(--color-textSecondary), var(--color-success), var(--color-surface), var(--color-border), var(--color-text), var(--color-primary) | already tokens |

### EnrollmentPageContent.tsx
| Location | Value | Usage |
|----------|--------|--------|
| style | `background: "var(--enroll-bg)"` | token |
| pb-12, pt-4, mb-4, mb-2 | spacing | Tailwind |

### index.css (enrollment-footer, ask-ai-btn)
| Location | Value | Usage |
|----------|--------|--------|
| margin-top | 48px | px |
| padding-top | 24px | px |
| max-width | 1440px | px |
| min-height | 44px | px |
| padding | 10px 20px, 10px 24px | px |
| min-width | 160px | px |
| box-shadow | 0 4px 12px rgba(0, 0, 0, 0.15) | shadow |
| ask-ai-gradient | #f8fafc, #eff6ff, #eef2ff | hex in gradient |

---

## 2. SPACING (px / Tailwind px equivalents)

- ChoosePlan: `max-w-[1144px]`, `gap-8`, `px-4 sm:px-6`, `paddingBottom: 40`, `gap-6`
- PlanCard: `26` (padding), `gap-6`, `gap-3`, `mt-3`, `mt-6`, `right-6`, `top: -12`, `height: 30`, `px-3 py-1.5`, `pl-[25px]`, `pt-4`, `mb-4`, `gap-2`, `px-4`, `py-1`, `px-[13px]`
- HelpSectionCard: `p-[33px]`, `gap-6`, `gap-3`
- SectionHeadingWithAccent: `left: -16`, `height: 64`, `mt-3`
- Footer (index.css): `48px`, `24px`, `10px 20px`, `10px 24px`, `44px`, `160px`
- Stepper: `py-3`, `px-4 sm:px-6 lg:px-8`, `gap-3`, `mx-2 sm:mx-4`

---

## 3. RADIUS

- PlanCard: `16` (card), `rounded-lg` (8), `rounded-[14px]` (icon wrap), `rounded-[10px]` (benefit item)
- HelpSectionCard: `rounded-3xl` (24px), `rounded-[14px]` (icon), `rounded-lg` (button)
- SectionHeadingWithAccent: `rounded-full` (accent bar)
- Stepper: `rounded-full` (step circle)

---

## 4. SHADOWS

- PlanCard: `var(--shadow-lg)`, `var(--shadow-sm)`; badge: `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)`
- index.css footer primary hover: `0 4px 12px rgba(0, 0, 0, 0.15)`
- index.css ask-ai-btn-gradient: hex gradient values

---

## 5. TYPOGRAPHY

- PlanCard: 12, 14, 24 (fontSize); font-medium, font-semibold; leading-4, leading-5, leading-8; tracking
- HelpSectionCard: 24, 16, 14; font-bold, font-normal, font-semibold; leading-8, leading-6, leading-5
- SectionHeadingWithAccent: 36, 18; font-bold, font-normal; leading-[40px], leading-7
- Stepper: text-sm, font-medium, font-bold
- Footer: 0.9375em, font-weight 500 (from index.css)

---

## 6. LAYOUT

- Fixed widths: `max-w-[1144px]`, `380px` (grid col), `max-w-7xl`, `max-w-4xl`, `max-width: 1440px`, `min-width: 160px`
- z-index: (none found in scanned components)
- Inline styles: ChoosePlan (paddingTop/Bottom), PlanCard (multiple style={}), HelpSectionCard (style={}), SectionHeadingWithAccent (style={}), EnrollmentFooter (style for disabled)

---

## Summary counts (approximate)

| Category | Count (hardcoded instances) |
|----------|-----------------------------|
| Colors (hex/rgb/rgba) | 50+ |
| px spacing | 40+ |
| radius values | 8+ |
| shadows | 4+ |
| font sizes | 15+ |
| font weights | 6+ |
| fixed widths | 6+ |
| inline styles | 20+ |
