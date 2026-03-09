# Personalization Wizard – Audit and Fix Report

**Date:** March 2025  
**Scope:** 3-step Personalization Wizard (Age → Location → Savings)  
**Location:** `src/features/personalization/`

---

## 1️⃣ Files Modified

| File | Changes |
|------|---------|
| `src/features/personalization/components/WizardHeader.tsx` | Removed unused `ReactNode` import; close button already had inline SVG (visible). |
| `src/features/personalization/components/WizardSteps.tsx` | Completed steps show **check icon** instead of number; added `CheckIcon` import; added `aria-label` on step buttons. |
| `src/features/personalization/components/InsightCard.tsx` | Text tokens switched to `--color-text` / `--color-text-secondary`; background/border to `--color-background-secondary` / `--color-border`; added `role="region"`, `aria-label="Insight"`, and animation class. |
| `src/features/personalization/components/AgeStep.tsx` | **Calendar icon** in age card avatar; **Layers icon** for AI insight; all text to `--color-text` / `--color-text-secondary`; step content wrapper class for animation; `aria-label` on Edit. |
| `src/features/personalization/components/LocationStep.tsx` | **Location insight** only when `state.location` is set; **MapPin icon** in insight; **SearchIcon** kept (inline); text tokens to `--color-text` / `--color-text-secondary`; surface to `--color-surface`; `aria-label`, `aria-pressed`, `aria-describedby` on inputs/buttons. |
| `src/features/personalization/components/SavingsStep.tsx` | **$ / % toggle** added (rounded-full, token-based active state); **Savings insight** only when `savings > 0`; **PiggyBank icon** in insight; **validation**: numbers-only, error message and red border when invalid; `aria-invalid`, `aria-describedby`, `role="alert"` for error. |
| `src/features/personalization/personalization-wizard.css` | See “CSS fixes” below. |
| **New:** `src/features/personalization/components/icons.tsx` | Centralized **CloseIcon**, **SearchIcon**, **CalendarIcon**, **MapPinIcon**, **PiggyBankIcon**, **LayersIcon**, **CheckIcon** for consistent rendering and theme (currentColor). |

---

## 2️⃣ Components Updated

- **WizardHeader** – Close icon remains inline SVG; no visibility issue.
- **WizardSteps** – Completed steps show check icon; active step remains filled circle + blue; improved ARIA.
- **WizardFooter** – Focus and hover styles in CSS (see below).
- **AgeStep** – Age card shows calendar icon; insight uses Layers icon; text and surfaces use theme tokens; insight always visible (age from profile).
- **LocationStep** – Search icon in place; location insight only after a location is selected; MapPin icon in insight.
- **SavingsStep** – $/% toggle; savings insight only when value > 0; PiggyBank icon; validation and error message.
- **RetirementSlider** – Styling moved to CSS (6px track, custom thumb webkit/moz).
- **InsightCard** – Token and a11y updates; fade-in animation class.

---

## 3️⃣ CSS Fixes Applied

- **Text visibility**  
  - Replaced `--text-primary` / `--text-secondary` with `--color-text` / `--color-text-secondary` (and tertiary) across wizard so light/dark themes work.

- **Step indicator**  
  - Completed: step circle shows **check icon** (WizardSteps + `.personalization-wizard__steps-num svg` sizing).  
  - Active: filled circle, `--color-primary`.  
  - Connector and borders use tokens.

- **Retirement age slider**  
  - Track: **height 6px**, **rounded-full**, token background.  
  - **Custom thumb** for WebKit and Moz: 20px circle, `--color-primary`, border, shadow.  
  - `-webkit-slider-runnable-track` set for 6px track.  
  - Focus-visible ring on thumb.

- **Savings slider**  
  - Same pattern: 6px track, custom thumb (18px), tokens.  
  - `.personalization-wizard__savings-fill` for fill; range input layered for interaction.

- **Toggle ($ / %)**  
  - Container: **rounded-full**, border, `--color-background-tertiary`.  
  - Buttons: **rounded-full**, border; active: `--color-primary` bg, `--color-text-inverse`.  
  - Transition and focus-visible ring.

- **Icons**  
  - Age card avatar: flex center + SVG size so **Calendar** icon is visible.  
  - Step check: `.personalization-wizard__steps-num svg` sized for **Check** icon.

- **Focus and accessibility**  
  - Focus-visible rings on: close button, step buttons, toggle buttons, footer buttons, search input, savings input, slider thumbs (webkit/moz).

- **Responsive**  
  - Dialog: **max-height 90dvh** (95dvh on small screens); body **min-height: 0** to avoid overflow.  
  - Location list: 1 column on narrow viewport.  
  - Step labels/padding tightened on mobile.

---

## 4️⃣ Logic Fixes Implemented

- **Step 1 – Age**  
  - Insight shown immediately (age from profile). No change to logic; icons and tokens only.

- **Step 2 – Location**  
  - **Condition:** `locationSelected = Boolean(state.location?.trim())`.  
  - **Insight:** Rendered only when `locationSelected` is true.  
  - Copy: e.g. “{state.location} is a popular retirement destination” + subtitle.

- **Step 3 – Savings**  
  - **Condition:** `showInsight = savingsValue > 0` (with `savingsValue` from parsed input).  
  - **Insight:** Rendered only when `showInsight` is true.  
  - Copy: “You're building a strong foundation” + subtitle.

---

## 5️⃣ Validation Added

- **Savings step**  
  - **Allowed:** Digits only (spaces allowed and stripped for parsing).  
  - **Rejected:** Letters, symbols (except spaces).  
  - **Helper:** “Enter your total retirement savings.”  
  - **Invalid state:** When `touched && inputValue.length > 0 && hasNonNumericChars(inputValue)` (e.g. `/\D/.test(s.replace(/\s/g, ""))`):  
    - Red border on input (`--color-danger`).  
    - **Message:** “Enter numbers only. No text or symbols.” with `role="alert"`.  
    - `aria-invalid="true"` and `aria-describedby` pointing to error id.

---

## 6️⃣ Animations Implemented

- **Modal entrance**  
  - `@keyframes personalization-wizard-dialog-in`: opacity 0→1, scale 0.96→1.  
  - Applied to `.personalization-wizard__dialog`, 0.2s ease-out.

- **Step content**  
  - `@keyframes personalization-wizard-step-in`: opacity 0→1, translateX(8px)→0.  
  - Applied to `.personalization-wizard__step-content` (body-inner of each step), 0.25s ease-out.

- **Insight cards**  
  - `@keyframes personalization-wizard-insight-in`: opacity 0→1.  
  - Class `personalization-wizard__insight-card--animate`, 0.3s ease-out.

- **Buttons**  
  - Footer CTA: hover uses `filter: brightness(1.05)` and **elevation** (`box-shadow: var(--shadow-lg)`).  
  - Toggle and other buttons: 0.2s transitions on background/color/border.

---

## 7️⃣ Accessibility

- **ARIA**  
  - Step nav: `aria-label="Progress"`; step buttons: `aria-label`, `aria-current="step"` when active, `aria-pressed` on location options.  
  - Search: `aria-label="Search states"`, `aria-describedby="location-hint"`.  
  - Savings: `aria-label`, `aria-invalid`, `aria-describedby` for helper/error.  
  - Toggle: `role="group"`, `aria-label="Display format"`, `aria-pressed` on $/%.  
  - Insight: `role="region"`, `aria-label="Insight"`.

- **Keyboard**  
  - Modal already has focus trap and Escape handling in `Modal.tsx`.  
  - All interactive elements are focusable; step buttons allow moving by step.

- **Focus**  
  - Visible focus rings on all controls (see CSS section) via `:focus-visible` and token-based box-shadow.

---

## 8️⃣ Final Test Checklist

| Check | Status |
|-------|--------|
| Open wizard from dashboard (incomplete profile) | ✅ |
| Step 1 Age: stepper, slider, calculation, insight visible | ✅ |
| Icons visible (calendar, layers, close) | ✅ |
| Step 2 Location: search, list, select → insight appears only after selection | ✅ |
| MapPin icon in location insight | ✅ |
| Step 3 Savings: $/% toggle, input, slider | ✅ |
| Savings insight appears only when value > 0 | ✅ |
| Validation: non-numeric shows error message and red border | ✅ |
| Step indicator: active = blue filled circle; completed = check icon | ✅ |
| Slider: 6px track, rounded, blue thumb (webkit/moz) | ✅ |
| Modal entrance and step transition animations | ✅ |
| Focus visible on key controls | ✅ |
| Responsive: modal height and overflow on small viewports | ✅ |

---

## Summary

- **Files modified:** 7 existing + 1 new (`icons.tsx`).  
- **Components updated:** All wizard steps, header, steps indicator, footer, slider, insight card.  
- **CSS:** Text tokens, slider track/thumb, toggle, step check icon, animations, focus, responsive.  
- **Logic:** Location insight only when location selected; savings insight only when savings > 0.  
- **Validation:** Savings numbers-only and error messaging.  
- **Animations:** Modal entrance, step transition, insight fade-in, button hover.  
- **A11y:** ARIA and focus-visible on wizard controls.  
- No changes were made to unrelated parts of the application.
